/* ==========================================================================
 *  TREMENDA PINTA — CATÁLOGO DE PRODUCTOS
 *  "Q' PINTANGA EL CAMBA"
 * ==========================================================================
 *
 *  ESTE ES EL ÚNICO ARCHIVO QUE TENÉS QUE TOCAR PARA ACTUALIZAR EL CATÁLOGO.
 *
 *  ➜ AGREGAR UNA PRENDA
 *    1. Abrí la web, bajá al pie de página y tocá "Modo Admin / Nuevo Producto".
 *    2. Llená el formulario y presioná "Generar código de producto".
 *    3. Pegá el bloque copiado DENTRO de la lista PRODUCTOS (más abajo),
 *       justo después de la línea que dice "👇 PEGÁ LOS PRODUCTOS NUEVOS AQUÍ".
 *    4. Guardá la foto en la carpeta  public/img/productos/  con el MISMO
 *       nombre de archivo que aparece en el campo "imagen".
 *
 *  ➜ VARIAS FOTOS DE UNA PRENDA (frente, espalda, detalle...)
 *    Agregá el campo  imagenes  (mirá el ejemplo del short Lululemon abajo).
 *    Se pueden poner 2, 3 o las fotos que quieras.
 *
 *  ➜ MARCAR UNA PRENDA COMO AGOTADA
 *    Cambiá  estado: 'Disponible'  por  estado: 'Agotado'.
 *
 *  ➜ BORRAR UNA PRENDA
 *    Eliminá su bloque completo, desde la llave  {  hasta la  },
 *
 *  ➜ AGREGAR UNA MARCA NUEVA (ej. Carhartt, Champion, Nike...)
 *    Agregá una línea en la lista MARCAS. Aparece sola en los filtros.
 *
 *  ⚠ Ojo con las comas: cada producto termina en  },  y los textos van entre
 *    comillas simples ' '. Si un texto lleva apóstrofe escribilo así: \'
 * ========================================================================== */

/**
 * MARCAS — se muestran como filtros en el catálogo (en este orden).
 * `destacada: true` le pone el sello de "marca principal".
 * Para sumar una marca, copiá una línea y cambiá el nombre. El campo `marca`
 * de cada producto tiene que coincidir EXACTO con `nombre` (mayúsculas incluidas).
 */
export const MARCAS = [
  { nombre: 'Dickies', destacada: true },
  { nombre: 'Lululemon' },
  { nombre: 'Panama Jack' },
  // { nombre: 'Carhartt' },
  // { nombre: 'Champion' },
  // { nombre: 'Nike' },
]

/**
 * CATEGORÍAS — el `id` es lo que va en el campo `categoria` de cada producto.
 * No cambies los `id` existentes (los productos dependen de ellos);
 * la `etiqueta` sí la podés cambiar libremente.
 */
export const CATEGORIAS = [
  { id: 'tees', etiqueta: 'Poleras / Tees' },
  { id: 'bottoms', etiqueta: 'Pantalones / Bottoms' },
  { id: 'shorts', etiqueta: 'Shorts' },
  { id: 'hoodies', etiqueta: 'Polerones / Hoodies' },
  { id: 'workwear', etiqueta: 'Camisas / Workwear' },
  { id: 'headwear', etiqueta: 'Gorras / Headwear' },
  { id: 'accesorios', etiqueta: 'Accesorios' },
]

/**
 * @typedef {Object} Producto
 * @property {string}   id          Identificador único, sin espacios (ej. 'dickies-874-negro').
 * @property {string}   nombre      Nombre de la prenda tal como se muestra.
 * @property {string}   marca       Debe coincidir con una marca de MARCAS.
 * @property {'tees'|'bottoms'|'shorts'|'hoodies'|'workwear'|'headwear'|'accesorios'} categoria
 * @property {number}   precio      Precio en Bolivianos, SOLO el número (ej. 380).
 * @property {string[]} tallas      Lista de tallas disponibles (ej. ['S', 'M', 'L']).
 * @property {'Disponible'|'Agotado'} estado
 * @property {string}   descripcion Texto de la prenda. La tarjeta muestra el inicio, el modal lo muestra completo.
 * @property {string}   imagen      Ruta de la foto dentro de /public (ej. '/img/productos/874.jpg').
 *                                  Dejalo en '' para mostrar el placeholder de la marca.
 * @property {{src: string, vista?: string}[]} [imagenes]
 *                                  OPCIONAL — varias fotos/ángulos de la prenda (frente, espalda, detalle...).
 *                                  Si lo ponés, la primera es la portada y el cliente puede pasar
 *                                  de una a otra con flechas o miniaturas. `vista` es el nombre del ángulo.
 *                                  Ej:  imagenes: [
 *                                         { src: '/img/productos/x-frente.jpg', vista: 'Frente' },
 *                                         { src: '/img/productos/x-espalda.jpg', vista: 'Espalda' },
 *                                       ],
 */

/** @type {Producto[]} */
export const PRODUCTOS = [
  // 👇 PEGÁ LOS PRODUCTOS NUEVOS AQUÍ (los primeros de la lista salen primero en la web)
{
    id: 'panama-jack-pantalon-secado-rapido',
    nombre: 'Pantalón Secado Rápido Panama Jack',
    marca: 'Panama Jack',
    categoria: 'bottoms',
    precio: 195,
    tallas: ['34 (44 nacional)'],
    estado: 'Disponible',
    descripcion:
      'Pantalón americano Panama Jack gris oscuro de tela técnica liviana y secado rápido. Talla US 34x30 (equivale a 44 nacional).',
    imagen: '/img/productos/panama-jack-1.jpg',
    imagenes: [
      { src: '/img/productos/panama-jack-1.jpg', vista: 'Prenda' },
      { src: '/img/productos/panama-jack-etiqueta.jpg', vista: 'Etiqueta' },
    ],
  },
  {
    id: 'lululemon-short-blanco-8reg',
    nombre: 'Short Deportivo Lululemon Blanco',
    marca: 'Lululemon',
    categoria: 'shorts',
    precio: 80,
    tallas: ['8 Reg'],
    estado: 'Disponible',
    descripcion:
      'Short deportivo Lululemon original color blanco con cintura elástica, paneles laterales de malla respirable y forro interior.',
    imagen: '/img/productos/lululemon-blanco-1.jpg',
    imagenes: [
      { src: '/img/productos/lululemon-blanco-1.jpg', vista: 'Espalda / Logo' },
      { src: '/img/productos/lululemon-blanco-2.jpg', vista: 'Frente' },
      { src: '/img/productos/lululemon-blanco-etiqueta.jpg', vista: 'Etiqueta' },
    ],
  },
  {
    id: 'lululemon-short-negro-talla4',
    nombre: 'Short Deportivo Lululemon Negro',
    marca: 'Lululemon',
    categoria: 'shorts',
    precio: 80,
    tallas: ['4'],
    estado: 'Disponible',
    descripcion:
      'Short deportivo ajustado Lululemon original color negro con pretina ancha estampada gris/negro y logo reflectivo posterior.',
    imagen: '/img/productos/lululemon-negro-1.jpg',
    imagenes: [
      { src: '/img/productos/lululemon-negro-1.jpg', vista: 'Espalda / Logo' },
      { src: '/img/productos/lululemon-negro-2.jpg', vista: 'Frente' },
      { src: '/img/productos/lululemon-negro-etiqueta.jpg', vista: 'Talla' },
    ],
  },

  {
    id: 'lululemon-short-vino-colorblock',
    nombre: 'Short Deportivo Lululemon Vino / Colorblock',
    marca: 'Lululemon',
    categoria: 'shorts',
    precio: 120, // ← cambiá este monto por tu precio real
    tallas: ['L'], // ← cambiá por la talla real de la etiqueta
    estado: 'Disponible',
    descripcion:
      'Short deportivo Lululemon original en tono vino/borgoña con pretina ancha a rayas y bloques de color. Incluye bolsillo trasero con cierre amarillo neón y logo reflectivo Lululemon en la parte posterior. Tela liviana y cómoda, ideal para entrenar o uso diario.',
    imagen: '/img/productos/lululemon-short-vino-frente.jpg',
    imagenes: [
      {
        src: '/img/productos/lululemon-short-vino-frente.jpg',
        vista: 'Frente',
      },
      {
        src: '/img/productos/lululemon-short-vino-espalda.jpg',
        vista: 'Espalda',
      },
    ],
  },

  {
    id: 'dickies-874-original',
    nombre: 'Pantalón 874 Original Work Pant',
    marca: 'Dickies',
    categoria: 'bottoms',
    precio: 380,
    tallas: ['30', '32', '34', '36'],
    estado: 'Disponible',
    descripcion:
      'El clásico que lo empezó todo. Corte recto, tiro medio y tela twill de poliéster/algodón que aguanta todo. Con raya marcada de fábrica, bolsillo para el celu y ese caído pesado que define el look West Coast. Original importado de EE.UU.',
    imagen: '',
  },
  {
    id: 'dickies-1574-work-shirt',
    nombre: 'Camisa Work Shirt Manga Corta 1574',
    marca: 'Dickies',
    categoria: 'workwear',
    precio: 290,
    tallas: ['S', 'M', 'L', 'XL'],
    estado: 'Disponible',
    descripcion:
      "Camisa de trabajo con dos bolsillos al pecho y portalápiz. Tela resistente a manchas y arrugas, ideal pa' usarla abierta sobre una polera blanca o abotonada hasta arriba estilo chicano. Logo Dickies bordado.",
    imagen: '',
  },
  {
    id: 'dickies-heavyweight-tee',
    nombre: 'Polera Heavyweight Pocket Tee',
    marca: 'Dickies',
    categoria: 'tees',
    precio: 180,
    tallas: ['M', 'L', 'XL', 'XXL'],
    estado: 'Disponible',
    descripcion:
      'Polera de algodón pesado (heavyweight) con bolsillo al pecho y cuello acanalado que no se deforma. Fit relajado, cae ancha y recta. La base de cualquier pinta urbana.',
    imagen: '',
  },
  {
    id: 'dickies-logo-hoodie',
    nombre: 'Polerón Icon Logo Hoodie',
    marca: 'Dickies',
    categoria: 'hoodies',
    precio: 420,
    tallas: ['M', 'L', 'XL'],
    estado: 'Agotado',
    descripcion:
      "Polerón canguro de algodón afelpado por dentro, capucha doble y logo Dickies estampado al frente. Puños y cintura acanalados. Abrigador pa' las noches de surazo sin perder el estilo.",
    imagen: '',
  },
  {
    id: 'dickies-twill-cap',
    nombre: 'Gorra Twill Work Cap',
    marca: 'Dickies',
    categoria: 'headwear',
    precio: 150,
    tallas: ['Única'],
    estado: 'Disponible',
    descripcion:
      'Gorra de seis paneles en twill de algodón, visera curva y correa ajustable atrás. Parche Dickies al frente. Combina con todo, del 874 al short.',
    imagen: '',
  },
  {
    id: 'dickies-cinturon-industrial',
    nombre: 'Cinturón Industrial de Lona',
    marca: 'Dickies',
    categoria: 'accesorios',
    precio: 120,
    tallas: ['S/M', 'L/XL'],
    estado: 'Disponible',
    descripcion:
      "Cinturón de lona tejida con hebilla metálica de rodillo. Largo extra pa' dejar la punta colgando como manda la vieja escuela. Resistente y liviano.",
    imagen: '',
  },
]
