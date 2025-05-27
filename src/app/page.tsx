import Link from "next/link";

import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Workshop EBAC: <br></br>Crea un Chatbot con IA
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="/admin"
            >
              <h3 className="text-2xl font-bold">Generador de Tokens →</h3>
              <div className="text-lg">
                Panel de administración para generar nuevos tokens asociados a
                un dominio. El widget del chatbot solo podrá ser cargado si el
                dominio está registrado.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
              href="/demo"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Demo: Chatbot Widget →</h3>
              <div className="text-lg">
                Sitio web de muestra con el chatbot integrado como widget.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white"></p>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
