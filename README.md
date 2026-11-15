# TREMENDA PINTA — Catálogo digital

> **Q' PINTANGA EL CAMBA**

Catálogo / revista digital de ropa americana original (Dickies, workwear y streetwear) con estética lookbook urbano. Está pensado para abrirse desde el celular cuando los clientes llegan por WhatsApp o Instagram: ven las prendas, filtran por categoría y marca, abren la ficha de cada prenda y hacen el pedido por WhatsApp con un mensaje que ya va escrito.

## Qué incluye

- **Header fijo** con logo, buscador por nombre o marca y botón directo a WhatsApp.
- **Portada estilo revista** con el eslogan, frase de marca y botón "Ver Catálogo".
- **Filtros combinables** por categoría (Poleras, Pantalones, Polerones, Camisas, Gorras, Accesorios) y por marca (Dickies como marca principal; se suman más con una línea).
- **Cuadrícula de prendas** con foto 4:5, etiqueta de marca, estado (Disponible / Agotado), tallas, precio en Bs. y descripción corta.
- **Ficha tipo revista** con foto grande, descripción completa, selector de talla y botón **"Pedir por WhatsApp"**.
- **Modo Admin / Nuevo Producto** (pie de página, con PIN): formulario con vista previa que genera y copia el bloque de código listo para pegar.

## Cómo actualizar el catálogo

Todo el catálogo vive en **`src/data/productos.js`**, comentado paso a paso.

1. Entrá a la web → pie de página → **Modo Admin / Nuevo Producto** → PIN (por defecto `1234`).
2. Llená el formulario y tocá **Generar código de producto** (se copia solo).
3. Pegalo en `src/data/productos.js` debajo de `// 👇 PEGÁ LOS PRODUCTOS NUEVOS AQUÍ`.
4. Si cargaste foto, guardala en `public/img/productos/` con el nombre que indica la pantalla (hay un botón para descargarla ya renombrada).
5. Guardá y publicá.

Para marcar algo agotado cambiá `estado: 'Disponible'` por `estado: 'Agotado'`. Para sumar una marca agregá una línea en `MARCAS`.

### Configuración (`src/data/config.js`)

| Constante           | Para qué sirve                                                     |
| ------------------- | ------------------------------------------------------------------ |
| `WHATSAPP_NUMERO`   | Número que recibe los pedidos (formato `591XXXXXXXX`, sin `+`).    |
| `ADMIN_PIN`         | PIN del Modo Admin.                                                |
| `INSTAGRAM_USUARIO` | Usuario de Instagram para el pie de página (vacío = oculto).       |
| `FRASE_PORTADA`     | Frase que aparece en la portada.                                   |

## Tecnologías

TanStack Start (React 19) · Vite · Tailwind CSS 4 · Radix UI · Netlify (hosting + Image CDN para optimizar las fotos).

## Correr localmente

```bash
npm install
netlify dev        # recomendado: incluye el Image CDN de Netlify
# o
npm run dev        # http://localhost:3000
```

Requiere Node 22.13+ o Node 24.
