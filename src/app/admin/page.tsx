// src/app/admin/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function AdminPage() {
  const [allowedDomain, setAllowedDomain] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [embedCode, setEmbedCode] = useState("");

  const createWidgetToken = api.widgetAuth.createWidgetToken.useMutation();

  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowedDomain) return;

    try {
      const generatedWidgetToken = await createWidgetToken.mutateAsync({
        allowedDomain,
      });

      setGeneratedToken(generatedWidgetToken.token);

      const code = `
        <!-- Chatbot Widget -->
        <script src="${window.location.origin}/chat-widget-loader.js"></script>
        <script>
            window.ChatWidget.init({
                token: '${generatedWidgetToken.token}',
                domain: '${allowedDomain}'
            });
        </script>`;

      setEmbedCode(code);
    } catch (error) {
      console.error("Error creating domain:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Regresar al Inicio
        </Link>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Administración de Chatbot</h1>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">
          Generar Token para Dominio
        </h2>

        <form onSubmit={handleGenerateToken} className="mb-6">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Dominio (ej: https://misitio.com)
            </label>
            <input
              type="text"
              value={allowedDomain}
              onChange={(e) => setAllowedDomain(e.target.value)}
              placeholder="https://ejemplo.com"
              className="w-full rounded border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="rounded bg-blue-500 px-6 py-3 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Generar Token
          </button>
        </form>

        {generatedToken && (
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-gray-700">
                Token generado:
              </h3>
              <code className="block rounded bg-gray-100 p-3 text-sm">
                {generatedToken}
              </code>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-700">
                Código de integración:
              </h3>
              <textarea
                value={embedCode}
                readOnly
                rows={8}
                className="w-full rounded border bg-gray-100 p-3 font-mono text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(embedCode);
                  const button = document.activeElement as HTMLButtonElement;
                  const originalText = button.innerText;
                  button.innerText = "¡Copiado!";
                  setTimeout(() => {
                    button.innerText = originalText;
                  }, 2000);
                }}
                className="mt-2 rounded bg-green-500 px-4 py-2 text-white transition-all duration-200 hover:bg-green-600"
              >
                Copiar Código
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
