import { Biohazard, BadgeCheck, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { codeToHtml } from 'shiki';
import Link from 'next/link';
import { AuthorAvatar } from './author-avatar';

export const metadata = {
  title: 'Arquitectura | Polite Proxy',
  description: 'Guía educativa sobre Supabase Edge Functions y arquitectura segura.',
};

// Helper for code blocks with Shiki highlighting
async function CodeBlock({ code, label }: { code: string; label?: string }) {
  const html = await codeToHtml(code, {
    lang: 'typescript',
    theme: 'github-light'
  });

  return (
    <div className="relative mt-4 rounded-lg border bg-white p-0 font-mono text-sm overflow-hidden text-black">
      {label && (
        <div className="flex items-center px-4 py-2 border-b bg-muted/30">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            {label}
          </span>
        </div>
      )}
      <div
        className="overflow-x-auto p-4 [&>pre]:!bg-transparent [&>pre]:!m-0"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Custom Header for /about */}
      <div className="sticky top-0 z-50 border-b-4 border-black bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-full hazard-stripe opacity-20" />

        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 z-10">
            <div className="bg-black text-primary p-1.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
              <Biohazard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none italic">
                POLITE PROXY
              </h1>
              <p className="text-[10px] font-bold text-black uppercase tracking-widest">
                Arquitectura y Edge Functions
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end z-10">
            <span className="text-xs font-bold uppercase tracking-wider">~10 min de lectura</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 pt-8 space-y-12">

        {/* Author Clearance Card */}
        <div className="flex justify-center">
          <Link
            href="https://x.com/wmoralesdev"
            target="_blank"
            className="group relative block w-full no-underline"
          >
            <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
            <div className="relative flex items-center gap-4 border-2 border-black bg-white p-4 transition-transform group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]">
              <AuthorAvatar />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Autorizado por
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">
                    <BadgeCheck className="h-3 w-3" /> Verificado
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold uppercase leading-tight">Walter Morales</h3>
                    <p className="text-xs font-mono text-muted-foreground">@wmoralesdev</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-black" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Slide 1: Introduction */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">¿Qué es Polite Proxy?</CardTitle>
            <CardDescription className="text-lg">
              Una demostración de cómo sanear contenido generado por usuarios de forma segura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Polite Proxy es una aplicación que intercepta mensajes "tóxicos" o informales y los
              reescribe instantáneamente para que sean educados y profesionales antes de guardarlos.
            </p>
            <div className="space-y-2">
              <h3 className="font-bold uppercase text-sm tracking-wider">El flujo básico:</h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
                <li>El usuario escribe un mensaje y pulsa enviar.</li>
                <li>El frontend envía el texto a una <strong>Supabase Edge Function</strong>.</li>
                <li>La función sanea el texto y llama a OpenAI para reescribirlo.</li>
                <li>La función guarda el resultado final en la base de datos.</li>
                <li>La UI se actualiza en tiempo real.</li>
              </ul>
            </div>
            <div className="bg-primary/10 p-4 border-l-4 border-primary mt-4">
              <p className="text-sm italic">
                <strong>Nota clave:</strong> Todo el procesamiento ocurre en el servidor (Edge Function),
                protegiendo nuestras claves API y asegurando que solo datos limpios entren en la base de datos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Slide 2: Edge Functions 101 */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Cómo funcionan las Supabase Edge Functions</CardTitle>
            <CardDescription>
              Pequeños servidores bajo demanda que viven cerca de tu base de datos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Una Edge Function es código TypeScript/JavaScript (ejecutado por Deno) que puedes desplegar globalmente.
              Actúa como una API personalizada extremadamente rápida.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-muted-foreground">
              <li>Se invocan vía HTTP (como cualquier API REST).</li>
              <li>Tienen acceso seguro a variables de entorno (`SECRET_KEY`).</li>
              <li>Se ejecutan en milisegundos y escalan automáticamente.</li>
            </ul>

            <CodeBlock
              label="functions/submit-message/index.ts"
              code={`import { serve } from "std/http";

serve(async (req) => {
  // 1. Solo aceptamos POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // 2. Procesamos la lógica
  try {
    return await handlePost(req);
  } catch (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }
});`}
            />

            <div className="mt-6 pt-6 border-t-2 border-muted">
              <h3 className="font-bold uppercase text-sm tracking-wider mb-4">Ciclo de vida de una Edge Function</h3>
              <div className="space-y-3">
                <div className="bg-muted/30 p-3 rounded border-l-4 border-primary">
                  <p className="text-sm font-medium mb-2">1. Desarrollo local</p>
                  <p className="text-xs text-muted-foreground">Escribes el código TypeScript/Deno en tu máquina y lo pruebas con el CLI de Supabase.</p>
                </div>
                <div className="bg-muted/30 p-3 rounded border-l-4 border-primary">
                  <p className="text-sm font-medium mb-2">2. Despliegue</p>
                  <p className="text-xs text-muted-foreground">Usas <code className="bg-black/10 px-1 rounded">supabase functions deploy submit-message</code> para publicar la función en la nube.</p>
                </div>
                <div className="bg-muted/30 p-3 rounded border-l-4 border-primary">
                  <p className="text-sm font-medium mb-2">3. Endpoint público</p>
                  <p className="text-xs text-muted-foreground">La función queda disponible en <code className="bg-black/10 px-1 rounded">/functions/v1/submit-message</code> y puede recibir peticiones HTTP.</p>
                </div>
                <div className="bg-muted/30 p-3 rounded border-l-4 border-primary">
                  <p className="text-sm font-medium mb-2">4. Invocaciones y logs</p>
                  <p className="text-xs text-muted-foreground">Cada llamada genera logs que puedes ver en el dashboard de Supabase para debugging y monitoreo.</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-background border-2 border-dashed border-muted rounded-lg">
                <p className="text-xs font-bold uppercase mb-2 text-center">Diagrama del ciclo de vida</p>
                <pre className="text-xs font-mono text-center leading-relaxed">
                  {`Código Local → Deploy → Endpoint Público → Invocaciones → Logs/Monitoring
    ↓              ↓            ↓                ↓              ↓
  Deno CLI    Supabase CLI   HTTP URL      Requests      Dashboard`}
                </pre>
              </div>

              <CodeBlock
                label="Comandos de despliegue y prueba"
                code={`# Desplegar la función
supabase functions deploy submit-message

# Probar localmente (con autenticación)
supabase functions invoke submit-message
  --body '{"message": "test"}'
  --header "Authorization: Bearer YOUR_TOKEN"

# Ver logs en tiempo real
supabase functions logs submit-message`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Slide 3: Why Better Protection */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Por qué protegen mejor tus datos</CardTitle>
            <CardDescription>
              Seguridad por diseño, no por oscuridad.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  Enfoque tradicional (Cliente)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Si haces todo desde el navegador, expones lógica de validación y a veces claves.
                  Un usuario malintencionado puede saltarse el frontend y escribir basura en tu DB.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-sm uppercase flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Enfoque Edge Function
                </h3>
                <p className="text-sm text-muted-foreground">
                  La función actúa como un portero. Nadie escribe en la tabla `messages` directamente;
                  todos deben pasar por la función, que garantiza limpieza y orden.
                </p>
              </div>
            </div>

            <div className="rounded border p-4 bg-muted text-center font-mono text-sm">
              Navegador (Inseguro) → Edge Function (Portero Seguro) → Base de Datos
            </div>

            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Las claves de OpenAI y Supabase Admin nunca salen del servidor.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Validación centralizada: si cambias la regla, se aplica a todos al instante.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Slide 4: Sanitization Pipeline */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">El flujo de saneamiento</CardTitle>
            <CardDescription>
              Transformando el caos en orden, paso a paso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ol className="space-y-4 relative border-l-2 border-muted ml-3 pl-6">
              <li className="relative">
                <span className="absolute -left-[31px] top-0 bg-background border-2 border-muted w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <h4 className="font-bold">Validación estricta</h4>
                <p className="text-sm text-muted-foreground">Usamos Zod para asegurar que el mensaje no esté vacío ni sea demasiado largo.</p>
                <div className="mt-2 p-2 bg-primary/5 border-l-2 border-primary text-xs">
                  <strong>🔒 Protección:</strong> Las claves de API y la estructura interna de la base de datos nunca se exponen al cliente.
                </div>
              </li>
              <li className="relative">
                <span className="absolute -left-[31px] top-0 bg-background border-2 border-muted w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <h4 className="font-bold">Reescritura con IA</h4>
                <p className="text-sm text-muted-foreground">Enviamos el texto a OpenAI con instrucciones de ser "cortés y profesional".</p>
                <div className="mt-2 p-2 bg-primary/5 border-l-2 border-primary text-xs">
                  <strong>🔒 Protección:</strong> La clave de OpenAI permanece oculta en variables de entorno del servidor. El cliente nunca la ve.
                </div>
              </li>
              <li className="relative">
                <span className="absolute -left-[31px] top-0 bg-background border-2 border-muted w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <h4 className="font-bold">Persistencia segura</h4>
                <p className="text-sm text-muted-foreground">Solo guardamos la respuesta saneada. El mensaje original nunca toca la base de datos.</p>
                <div className="mt-2 p-2 bg-primary/5 border-l-2 border-primary text-xs">
                  <strong>🔒 Protección:</strong> Usamos el cliente admin de Supabase (SECRET_KEY) que bypass RLS, pero solo después de validar y sanear.
                </div>
              </li>
            </ol>

            <div className="mt-6 pt-6 border-t-2 border-muted">
              <h3 className="font-bold uppercase text-sm tracking-wider mb-4">Manejo de errores y casos límite</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded">
                  <p className="font-bold mb-1">❌ Validación Zod falla</p>
                  <p className="text-xs text-muted-foreground mb-1">Si el mensaje está vacío o excede 1000 caracteres:</p>
                  <p className="text-xs font-mono bg-black/5 p-2 rounded">HTTP 400: {"{"} "error": "El mensaje no puede estar vacío" {"}"}</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded">
                  <p className="font-bold mb-1">❌ OpenAI devuelve error</p>
                  <p className="text-xs text-muted-foreground mb-1">Si la API de OpenAI falla o no responde:</p>
                  <p className="text-xs font-mono bg-black/5 p-2 rounded">HTTP 502: {"{"} "error": "Failed to process message with AI" {"}"}</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded">
                  <p className="font-bold mb-1">❌ Inserción en DB falla</p>
                  <p className="text-xs text-muted-foreground mb-1">Si hay un problema al guardar en Supabase:</p>
                  <p className="text-xs font-mono bg-black/5 p-2 rounded">HTTP 500: {"{"} "error": "Failed to save message" {"}"}</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 rounded">
                  <p className="font-bold mb-1">⚠️ Autenticación inválida</p>
                  <p className="text-xs text-muted-foreground mb-1">Si el token JWT es inválido o expiró:</p>
                  <p className="text-xs font-mono bg-black/5 p-2 rounded">HTTP 401: {"{"} "error": "Unauthorized" {"}"}</p>
                </div>
              </div>
            </div>

            <CodeBlock
              label="Validación con Zod"
              code={`const MessageSchema = z.object({
  message: z.string()
    .min(1, "El mensaje no puede estar vacío")
    .max(1000, "Máximo 1000 caracteres"),
});

function validateRequest(body: unknown) {
  return MessageSchema.safeParse(body);
}`}
            />
          </CardContent>
        </Card>

        {/* Slide 5: Deep Dive */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Dentro de la función submit-message</CardTitle>
            <CardDescription>
              Un vistazo al orquestador principal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 text-sm">
                <p>
                  La función <code>handlePost</code> coordina todo el proceso. Es lineal y fácil de auditar.
                </p>
                <ul className="space-y-2">
                  <li className="p-2 bg-muted/50 rounded">
                    <strong>1. Config:</strong> Carga variables de entorno de forma segura.
                  </li>
                  <li className="p-2 bg-muted/50 rounded">
                    <strong>2. Auth:</strong> Verifica quién llama usando el token del usuario.
                  </li>
                  <li className="p-2 bg-muted/50 rounded">
                    <strong>3. AI:</strong> Transforma el mensaje.
                  </li>
                  <li className="p-2 bg-muted/50 rounded">
                    <strong>4. DB:</strong> Escribe en Supabase usando privilegios de administrador (bypass RLS).
                  </li>
                </ul>
              </div>

              <div className="min-w-0">
                <CodeBlock
                  label="Orquestación Principal"
                  code={`async function handlePost(req: Request) {
  // 1. Configuración segura
  const config = getConfig();

  // 2. Autenticar al usuario
  const supabaseAdmin = getSupabaseAdminClient(config);
  const user = await authenticateRequest(req, supabaseAdmin);

  // 3. Validar entrada
  const body = await req.json();
  const { message } = validateRequest(body);

  // 4. Reescribir con IA
  const politeMessage = await rewriteMessageWithAI(message, config);

  // 5. Guardar resultado
  return await saveMessage(supabaseAdmin, user.id, politeMessage);
}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slide 6: Comparison */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Supabase JS Directo vs Edge Functions</CardTitle>
            <CardDescription>
              ¿Cuándo usar qué herramienta?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b-2 border-black uppercase text-xs font-bold">
                  <tr>
                    <th className="py-2 pr-4">Característica</th>
                    <th className="py-2 px-4 bg-muted/50">Cliente Directo</th>
                    <th className="py-2 pl-4 bg-primary/10">Edge Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 font-medium">Dónde corre</td>
                    <td className="px-4 text-muted-foreground">Navegador del usuario</td>
                    <td className="pl-4 text-primary font-medium">Servidor seguro</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Secretos (API Keys)</td>
                    <td className="px-4 text-red-500 font-bold">Expuestos (Peligro)</td>
                    <td className="pl-4 text-green-600 font-bold">Ocultos (Seguro)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Lógica compleja</td>
                    <td className="px-4 text-muted-foreground">Difícil de mantener</td>
                    <td className="pl-4 text-primary font-medium">Centralizada</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="mb-2 font-bold uppercase text-muted-foreground">Cliente (Simple pero limitado)</p>
                <pre className="bg-muted p-3 rounded border">
                  <code>{`await supabase
  .from('messages')
  .insert({ content: 'hola' })`}</code>
                </pre>
              </div>
              <div>
                <p className="mb-2 font-bold uppercase text-primary">Edge Function (Robusto)</p>
                <pre className="bg-primary/5 p-3 rounded border border-primary/20">
                  <code>{`await fetch('/functions/v1/submit', {
  method: 'POST',
  body: JSON.stringify({ msg })
})`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slide 7: Architecture Diagram */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Arquitectura de un vistazo</CardTitle>
            <CardDescription>
              Vista general del sistema y flujo detallado de una petición.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <h3 className="font-bold uppercase text-sm tracking-wider mb-3">Vista general del sistema</h3>
              <div className="flex justify-center bg-white p-6 border-2 border-dashed border-black/20 rounded-lg">
                <pre className="text-xs md:text-sm leading-loose font-mono text-center">
                  {`[ Next.js UI ]
    ↓
[ Supabase Auth ]
    ↓
[ Edge Function: submit-message ]  ↔  [ OpenAI API ]
    ↓
[ Supabase DB (Tabla: messages) ]
    ↓
[ Realtime Subscription (WebSocket) ]
    ↓
[ Next.js UI (Actualización) ]`}
                </pre>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-muted">
              <h3 className="font-bold uppercase text-sm tracking-wider mb-3">Secuencia detallada de una petición</h3>
              <div className="bg-muted/30 p-4 rounded-lg border-2 border-muted overflow-x-auto">
                <pre className="text-xs font-mono leading-relaxed whitespace-pre">
                  {`1. Usuario escribe "hola tonto" y pulsa enviar
   └─> Frontend: { message: "hola tonto" }

2. Frontend hace fetch() con Authorization header
   └─> POST /functions/v1/submit-message
   └─> Headers: { Authorization: "Bearer JWT_TOKEN" }
   └─> Body: { message: "hola tonto" }

3. Edge Function recibe la petición
   └─> Valida método HTTP (debe ser POST)
   └─> Extrae y verifica JWT token
   └─> Identifica usuario autenticado

4. Validación con Zod
   └─> Verifica: message.length > 0 && message.length <= 1000
   └─> ✅ Pasa validación

5. Edge Function llama a OpenAI API
   └─> Envía: { model: "gpt-4", messages: [...] }
   └─> Headers: { Authorization: "Bearer OPENAI_KEY" } ← OCULTO
   └─> Recibe: { content: "Hola, ¿cómo puedo ayudarte?" }

6. Edge Function guarda en Supabase DB
   └─> Usa SECRET_KEY (admin) ← OCULTO
   └─> INSERT INTO messages (content, user_id)
   └─> Recibe: { id: "123", content: "...", created_at: "..." }

7. Edge Function responde al Frontend
   └─> HTTP 200 OK
   └─> Body: { data: { id, content, created_at, user_id } }

8. Supabase Realtime detecta nuevo INSERT
   └─> WebSocket notifica a todos los clientes suscritos

9. Frontend recibe actualización vía Realtime
   └─> Actualiza UI con el mensaje filtrado
   └─> Usuario ve: "Hola, ¿cómo puedo ayudarte?"`}
                </pre>
              </div>
              <div className="mt-4 p-3 bg-primary/5 border-l-4 border-primary rounded">
                <p className="text-xs">
                  <strong>Nota importante:</strong> En los pasos 5 y 6, las claves secretas (OPENAI_KEY, SECRET_KEY)
                  nunca salen del servidor. El cliente solo ve el resultado final sanitizado.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Slide 8: Frontend Integration */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Cómo usa el Frontend este Backend</CardTitle>
            <CardDescription>
              Integración transparente para el usuario y contrato explícito entre capas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              El frontend es "tonto" a propósito. No sabe cómo sanear mensajes ni tiene claves de OpenAI.
              Solo sabe pedirle al backend que haga el trabajo sucio. Esta separación de responsabilidades
              se mantiene mediante un contrato bien definido que el frontend debe respetar.
            </p>

            <div className="bg-muted/30 p-4 rounded-lg border-2 border-muted">
              <h3 className="font-bold uppercase text-sm tracking-wider mb-4">Contrato Frontend ↔ Backend</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold mb-2">📤 Request (Frontend → Edge Function)</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li><strong>Endpoint:</strong> <code className="bg-black/10 px-1 rounded">POST /functions/v1/submit-message</code></li>
                    <li><strong>Headers requeridos:</strong> <code className="bg-black/10 px-1 rounded">Authorization: Bearer JWT_TOKEN</code></li>
                    <li><strong>Body:</strong> <code className="bg-black/10 px-1 rounded">{"{"} "message": string (1-1000 chars) {"}"}</code></li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">✅ Response exitosa (Edge Function → Frontend)</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li><strong>Status:</strong> <code className="bg-black/10 px-1 rounded">HTTP 200</code></li>
                    <li><strong>Body:</strong> <code className="bg-black/10 px-1 rounded">{"{"} "data": {"{"} "id": string, "content": string, "created_at": string, "user_id": string {"}"} {"}"}</code></li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold mb-2">❌ Response de error (Edge Function → Frontend)</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li><strong>Status:</strong> <code className="bg-black/10 px-1 rounded">400</code> (validación), <code className="bg-black/10 px-1 rounded">401</code> (auth), <code className="bg-black/10 px-1 rounded">500</code> (servidor), <code className="bg-black/10 px-1 rounded">502</code> (OpenAI)</li>
                    <li><strong>Body:</strong> <code className="bg-black/10 px-1 rounded">{"{"} "error": string {"}"}</code></li>
                  </ul>
                </div>
              </div>
            </div>

            <CodeBlock
              label="Tipos TypeScript (conceptuales)"
              code={`// Lo que el frontend envía
interface SubmitMessageRequest {
  message: string;  // 1-1000 caracteres, validado por Zod
}

// Lo que el frontend recibe en caso de éxito
interface SubmitMessageResponse {
  data: {
    id: string;              // UUID del mensaje guardado
    content: string;          // Mensaje ya sanitizado por OpenAI
    created_at: string;       // ISO timestamp
    user_id: string;          // ID del usuario autenticado
  };
}

// Lo que el frontend recibe en caso de error
interface ErrorResponse {
  error: string;  // Mensaje descriptivo del error
}`}
            />

            <CodeBlock
              label="Cliente (React Hook)"
              code={`const handleSubmit = async (text: string) => {
  // Enviamos el texto crudo a nuestra función segura
  const response = await fetch(
    \`\${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/submit-message\`,
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${session.access_token}\`, // Autenticación
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: text }),
    }
  );

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }

  const result: SubmitMessageResponse = await response.json();
  return result.data; // Mensaje sanitizado listo para mostrar
};`}
            />

            <div className="bg-primary/5 p-4 border-l-4 border-primary rounded">
              <p className="text-sm">
                <strong>Separación de responsabilidades:</strong> El frontend solo conoce este contrato público.
                No sabe nada sobre variables de entorno, la estructura física de la tabla `messages`,
                el prompt exacto enviado a OpenAI, ni la lógica interna de saneamiento. Esto hace que el
                sistema sea más seguro, mantenible y fácil de evolucionar sin romper el frontend.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Slide 9: Best Practices */}
        <Card className="bg-primary text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <Biohazard className="w-6 h-6" />
              Buenas prácticas para llevar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 font-medium">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="bg-black text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                <p>Valida y sanea siempre en el servidor. Nunca confíes en el cliente.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-black text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                <p>Mantén tus secretos (API Keys) en variables de entorno dentro de las Edge Functions.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-black text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                <p>Centraliza la lógica de negocio compleja para facilitar auditorías y cambios futuros.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-black text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
                <p>Usa esquemas tipados (como Zod) para garantizar que los datos son lo que esperas.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}

