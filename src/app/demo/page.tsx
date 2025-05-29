import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Regresar al Inicio
        </Link>
      </div>
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Workshop: Chatbot IA (Demo)
        </h1>

        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">
            Bienvenidos a nuestra tienda
          </h2>
          <p className="mb-4 text-gray-600">
            Esta es una tienda de demostración diseñada para mostrar la
            integración de nuestro asistente virtual de compras. El chatbot
            aparecerá en la esquina inferior derecha de la pantalla.
          </p>
          <p className="mb-4 text-gray-600">
            ¡Pregunta al asistente sobre nuestros productos y ofertas!
          </p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-8">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-200">
              <img
                src="https://cdn.shopify.com/s/files/1/0627/5740/4909/files/what-are-sneakers.png?width=750"
                alt="Tenis"
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Tenis deportivos</h3>
            <p className="mb-2 text-gray-600">
              Colección exclusiva de tenis deportivos para running y training.
              Disponible en varios colores.
            </p>
            <p className="font-semibold text-blue-600">$89.99</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 h-48 overflow-hidden rounded-lg bg-gray-200">
              <img
                src="https://cdn.shopify.com/s/files/1/0561/5212/9689/files/Web_1.1_SHOT_1_082_-_Resized_786924b2-d901-4eb0-990d-71dfa9e272f4.jpg?v=1679280769"
                alt="Ropa deportiva"
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Ropa Deportiva</h3>
            <p className="mb-2 text-gray-600">
              Nueva colección de ropa deportiva con tejidos de alta calidad y
              diseños modernos.
            </p>
            <p className="font-semibold text-blue-600">Desde $29.99</p>
          </div>
        </div>
      </div>

      <script src="/chat-widget-loader.js"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.ChatWidget.init({
            token: 'M94Q9fViTUT0NK9X3RdXChQ_q-35G4BB'
          });
        `,
        }}
      />
    </div>
  );
}
