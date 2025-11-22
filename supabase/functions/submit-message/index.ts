import { serve } from "std/http";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { buildOpenAIMessages, getOpenAIConfig } from "./prompt.ts";

// ============================================================================
// Constants & Configuration
// ============================================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const JSON_HEADERS = {
  ...corsHeaders,
  "Content-Type": "application/json",
};

// Zod schema for request validation
const MessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message exceeds maximum length of 1000 characters"),
});

type MessageRequest = z.infer<typeof MessageSchema>;

// ============================================================================
// Configuration & Environment
// ============================================================================

interface Config {
  supabaseUrl: string;
  secretKey: string;
  openaiApiKey: string;
  openaiConfig: ReturnType<typeof getOpenAIConfig>;
}

/**
 * Validates and retrieves required environment variables.
 * Throws an error if any required env vars are missing.
 */
function getConfig(): Config {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const secretKey = Deno.env.get("SECRET_KEY");
  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

  if (!supabaseUrl) {
    console.error("[submit-message] Server misconfigured: missing SUPABASE_URL");
    throw new Error("Server configuration error");
  }

  if (!secretKey) {
    console.error("[submit-message] Server misconfigured: missing SECRET_KEY");
    throw new Error("Server configuration error");
  }

  if (!openaiApiKey) {
    console.error("[submit-message] Server misconfigured: missing OPENAI_API_KEY");
    throw new Error("Server configuration error");
  }

  return {
    supabaseUrl,
    secretKey,
    openaiApiKey,
    openaiConfig: getOpenAIConfig(),
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a Supabase admin client with secret API key.
 * This client bypasses Row Level Security (RLS) policies,
 * which is appropriate for trusted edge functions.
 * Uses the modern secret key instead of the legacy service_role key.
 */
function getSupabaseAdminClient(config: Config) {
  return createClient(config.supabaseUrl, config.secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Authenticates the request by extracting and validating the JWT token.
 * Returns the authenticated user or throws an error.
 */
async function authenticateRequest(
  req: Request,
  supabaseAdmin: ReturnType<typeof getSupabaseAdminClient>
) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  return user;
}

/**
 * Validates the request body against the MessageSchema.
 * Returns the parsed and validated data or throws an error.
 */
function validateRequest(body: unknown): MessageRequest {
  const result = MessageSchema.safeParse(body);

  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new Error(firstError?.message || "Invalid request body");
  }

  return result.data;
}

/**
 * Extracts plain text content from the flexible response payloads returned by
 * different OpenAI model families (e.g. GPT-4o, GPT-5).
 */
function extractTextContent(content: unknown): string {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (part && typeof part === "object") {
          if ("text" in part && typeof (part as { text?: string }).text === "string") {
            return (part as { text: string }).text;
          }
          if ("value" in part && typeof (part as { value?: string }).value === "string") {
            return (part as { value: string }).value;
          }
        }

        return "";
      })
      .join("")
      .trim();
  }

  if (content && typeof content === "object") {
    if ("text" in content && typeof (content as { text?: string }).text === "string") {
      return (content as { text: string }).text.trim();
    }
  }

  return "";
}

/**
 * Calls OpenAI API to rewrite the message using the configured prompt.
 * Returns the rewritten message or throws an error.
 */
async function rewriteMessageWithAI(
  message: string,
  config: Config
): Promise<string> {
  const { openaiApiKey, openaiConfig } = config;

  // GPT-5 models use max_completion_tokens instead of max_tokens
  // GPT-5 models don't support temperature parameter (only default value of 1)
  const isGPT5Model = openaiConfig.model.startsWith("gpt-5");
  const requestBody: Record<string, unknown> = {
    model: openaiConfig.model,
    messages: buildOpenAIMessages(message),
  };

  // Only include temperature for non-GPT-5 models
  if (!isGPT5Model) {
    requestBody.temperature = openaiConfig.temperature;
  }

  if (isGPT5Model) {
    requestBody.max_completion_tokens = openaiConfig.max_tokens;
  } else {
    requestBody.max_tokens = openaiConfig.max_tokens;
  }

  const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!openaiResponse.ok) {
    const errorData = await openaiResponse.text();
    let errorMessage = "Failed to process message with AI";
    try {
      const errorJson = JSON.parse(errorData);
      errorMessage = errorJson.error?.message || errorData || errorMessage;
    } catch {
      // If parsing fails, use the raw error data
      errorMessage = errorData || errorMessage;
    }
    console.error("[submit-message] OpenAI API error:", errorData);
    throw new Error(errorMessage);
  }

  const openaiData = await openaiResponse.json();
  const primaryChoice = Array.isArray(openaiData?.choices) ? openaiData.choices[0] : undefined;
  const politeMessage =
    extractTextContent(primaryChoice?.message?.content) ||
    extractTextContent(primaryChoice?.content);

  if (!politeMessage) {
    console.error("[submit-message] Unexpected OpenAI payload shape", {
      hasChoices: Array.isArray(openaiData?.choices),
      choiceKeys: primaryChoice ? Object.keys(primaryChoice) : [],
    });
    throw new Error("AI did not return a valid response");
  }

  return politeMessage;
}

/**
 * Saves the rewritten message to the database.
 * Uses secret key client to bypass RLS policies.
 * Returns the inserted message or throws an error.
 */
async function saveMessage(
  supabaseAdmin: ReturnType<typeof getSupabaseAdminClient>,
  userId: string,
  politeMessage: string
) {
  const { data: insertedMessage, error: insertError } = await supabaseAdmin
    .from("messages")
    .insert({
      content: politeMessage,
      user_id: userId,
    })
    .select()
    .single();

  if (insertError) {
    console.error("[submit-message] Database insert error:", insertError);
    throw new Error("Failed to save message");
  }

  return insertedMessage;
}

/**
 * Creates an error response with consistent formatting.
 */
function createErrorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: JSON_HEADERS,
  });
}

/**
 * Creates a success response with consistent formatting.
 */
function createSuccessResponse(data: unknown): Response {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: JSON_HEADERS,
  });
}

// ============================================================================
// Main Handler
// ============================================================================

/**
 * Handles POST requests for submitting and rewriting messages.
 */
async function handlePost(req: Request): Promise<Response> {
  // Get configuration (validates env vars)
  const config = getConfig();

  // Authenticate the request
  const supabaseAdmin = getSupabaseAdminClient(config);
  const user = await authenticateRequest(req, supabaseAdmin);

  // Parse and validate request body
  const body = await req.json();
  const { message } = validateRequest(body);

  // Rewrite message using AI
  const politeMessage = await rewriteMessageWithAI(message, config);

  // Save to database
  const insertedMessage = await saveMessage(supabaseAdmin, user.id, politeMessage);

  // Return success response
  return createSuccessResponse(insertedMessage);
}

/**
 * Main serve handler for the edge function.
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405);
  }

  try {
    return await handlePost(req);
  } catch (error) {
    // Log full error details server-side
    console.error("[submit-message] Edge function error:", error);

    // Map known errors to appropriate HTTP status codes
    const errorMessage = error instanceof Error ? error.message : "Internal server error";

    if (errorMessage === "Missing authorization header" || errorMessage === "Unauthorized") {
      return createErrorResponse(errorMessage, 401);
    }

    if (errorMessage.includes("cannot be empty") || errorMessage.includes("exceeds maximum length")) {
      return createErrorResponse(errorMessage, 400);
    }

    if (errorMessage.includes("Failed to process message with AI") || errorMessage.includes("did not return a valid response")) {
      return createErrorResponse(errorMessage, 502);
    }

    // Default to 500 for unexpected errors
    return createErrorResponse("Internal server error", 500);
  }
});
