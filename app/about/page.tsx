import React from 'react';
import { Biohazard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata = {
  title: 'Arquitectura | Polite Proxy',
  description: 'Guía educativa sobre Supabase Edge Functions y arquitectura segura.',
};

// Helper for code blocks
function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative mt-4 rounded-lg border bg-muted/50 p-4 font-mono text-sm">
      {label && (
        <div className="absolute -top-3 left-4">
          <Button
            variant="outline"
            size="sm"
            className="h-6 bg-background text-xs uppercase tracking-widest hover:bg-background hover:text-primary cursor-default"
          >
            {label}
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <pre className="text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
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
            <span className="text-[10px] opacity-70 font-medium">Por Walter Morales (@wmoralesdev)</span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 pt-8 space-y-12">
        
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
              </li>
              <li className="relative">
                <span className="absolute -left-[31px] top-0 bg-background border-2 border-muted w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <h4 className="font-bold">Reescritura con IA</h4>
                <p className="text-sm text-muted-foreground">Enviamos el texto a OpenAI con instrucciones de ser "cortés y profesional".</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[31px] top-0 bg-background border-2 border-muted w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <h4 className="font-bold">Persistencia segura</h4>
                <p className="text-sm text-muted-foreground">Solo guardamos la respuesta saneada. El mensaje original nunca toca la base de datos.</p>
              </li>
            </ol>

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
          </CardHeader>
          <CardContent>
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
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Un ciclo completo: desde la acción del usuario hasta la confirmación visual, pasando por capas de seguridad.
            </p>
          </CardContent>
        </Card>

        {/* Slide 8: Frontend Integration */}
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Cómo usa el Frontend este Backend</CardTitle>
            <CardDescription>
              Integración transparente para el usuario.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              El frontend es "tonto" a propósito. No sabe cómo sanear mensajes ni tiene claves de OpenAI. 
              Solo sabe pedirle al backend que haga el trabajo sucio.
            </p>
            <CodeBlock 
              label="Cliente (React Hook)"
              code={`const handleSubmit = async (text) => {
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

  if (!response.ok) throw new Error("Falló el envío");
};`}
            />
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

