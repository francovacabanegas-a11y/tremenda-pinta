import { useEffect, useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  Check,
  ClipboardCopy,
  Download,
  ImagePlus,
  KeyRound,
  LogOut,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ADMIN_PIN } from '@/data/config.js'
import {
  CATEGORIAS,
  MARCAS,
  type CategoriaId,
  type Estado,
  type Producto,
} from '@/lib/catalogo'
import { SiteHeader } from '@/components/catalogo/site-header'
import { ProductCard } from '@/components/catalogo/product-card'

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Modo Admin — TREMENDA PINTA' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: Admin,
})

const CLAVE_SESION = 'tp-admin-ok'

function Admin() {
  const [ok, setOk] = useState(false)

  useEffect(() => {
    setOk(sessionStorage.getItem(CLAVE_SESION) === '1')
  }, [])

  return (
    <div className="min-h-screen bg-carbon">
      <SiteHeader />
      <main className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white"
          >
            <ArrowLeft className="size-4" /> Volver al catálogo
          </Link>
          {ok ? (
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem(CLAVE_SESION)
                setOk(false)
              }}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white"
            >
              <LogOut className="size-4" /> Salir del modo admin
            </button>
          ) : null}
        </div>
        {ok ? (
          <Generador />
        ) : (
          <PinGate
            onOk={() => {
              sessionStorage.setItem(CLAVE_SESION, '1')
              setOk(true)
            }}
          />
        )}
      </main>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  PIN                                                                        */
/* -------------------------------------------------------------------------- */

function PinGate({ onOk }: { onOk: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (pin === String(ADMIN_PIN)) onOk()
        else {
          setError(true)
          setPin('')
        }
      }}
      className="mx-auto max-w-sm rounded-xl bg-grafito p-8 text-center ring-1 ring-white/10"
    >
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-bosque text-esmeralda">
        <KeyRound className="size-6" />
      </span>
      <h1 className="mt-5 font-display text-3xl tracking-wide text-white uppercase">
        Modo Admin
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Ingresá el PIN para cargar una prenda nueva.
      </p>
      <input
        type="password"
        inputMode="numeric"
        autoComplete="off"
        autoFocus
        value={pin}
        onChange={(e) => {
          setPin(e.target.value)
          setError(false)
        }}
        aria-label="PIN"
        aria-invalid={error}
        placeholder="••••"
        className={cn(
          'mt-6 h-14 w-full rounded-lg border bg-carbon text-center font-display text-3xl tracking-[0.5em] text-white focus:ring-2 focus:outline-none',
          error
            ? 'border-destructive focus:ring-destructive/30'
            : 'border-border focus:border-esmeralda focus:ring-esmeralda/30',
        )}
      />
      <p className="mt-2 h-5 text-sm text-destructive" role="alert">
        {error ? 'PIN incorrecto. Probá de nuevo.' : ''}
      </p>
      <button
        type="submit"
        className="mt-2 h-12 w-full rounded-full bg-esmeralda text-sm font-extrabold tracking-wider text-carbon uppercase hover:bg-[#2fe06d]"
      >
        Entrar
      </button>
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/*  Generador de código                                                        */
/* -------------------------------------------------------------------------- */

const TALLAS_RAPIDAS = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', 'Única',
]

function slug(texto: string) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/** Texto JS entre comillas simples, con apóstrofes escapados. */
function js(texto: string) {
  return `'${texto
    .trim()
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\s*\n\s*/g, ' ')}'`
}

function extension(nombreArchivo: string) {
  const ext = nombreArchivo.split('.').pop()?.toLowerCase() ?? 'jpg'
  return ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext) ? ext : 'jpg'
}

async function copiar(texto: string) {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = texto
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

const campo =
  'h-11 w-full rounded-md border border-border bg-carbon px-3 text-sm text-white placeholder:text-white/30 focus:border-esmeralda focus:ring-2 focus:ring-esmeralda/30 focus:outline-none'

function Generador() {
  const [foto, setFoto] = useState<{ url: string; archivo: File } | null>(null)
  const [nombre, setNombre] = useState('')
  const [marca, setMarca] = useState(MARCAS[0]?.nombre ?? '')
  const [categoria, setCategoria] = useState<CategoriaId>(CATEGORIAS[0].id)
  const [tallas, setTallas] = useState<string[]>([])
  const [tallaExtra, setTallaExtra] = useState('')
  const [precio, setPrecio] = useState('')
  const [estado, setEstado] = useState<Estado>('Disponible')
  const [descripcion, setDescripcion] = useState('')
  const [codigo, setCodigo] = useState('')
  const [copiado, setCopiado] = useState(false)

  // Liberar la URL temporal de la vista previa
  useEffect(() => () => foto && URL.revokeObjectURL(foto.url), [foto])

  const id = slug(`${marca} ${nombre}`) || 'nuevo-producto'
  const archivoFoto = foto ? `${id}.${extension(foto.archivo.name)}` : ''
  const rutaImagen = archivoFoto ? `/img/productos/${archivoFoto}` : ''
  const marcaNueva =
    marca.trim() !== '' &&
    !MARCAS.some((m) => m.nombre.toLowerCase() === marca.trim().toLowerCase())

  const vistaPrevia: Producto = useMemo(
    () => ({
      id,
      nombre: nombre || 'Nombre de la prenda',
      marca: marca || 'Marca',
      categoria,
      precio: Number(precio) || 0,
      tallas: tallas.length ? tallas : ['—'],
      estado,
      descripcion:
        descripcion || 'La descripción corta de la prenda aparece aquí.',
      imagen: foto?.url ?? '',
    }),
    [id, nombre, marca, categoria, precio, tallas, estado, descripcion, foto],
  )

  const faltantes = [
    !nombre.trim() && 'nombre',
    !marca.trim() && 'marca',
    !(Number(precio) > 0) && 'precio',
    tallas.length === 0 && 'al menos una talla',
    !descripcion.trim() && 'descripción',
  ].filter(Boolean) as string[]

  function toggleTalla(t: string) {
    setTallas((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    )
  }

  function agregarTallaExtra() {
    const nuevas = tallaExtra
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !tallas.includes(t))
    if (nuevas.length) setTallas((prev) => [...prev, ...nuevas])
    setTallaExtra('')
  }

  async function generar(e: React.FormEvent) {
    e.preventDefault()
    if (faltantes.length) {
      toast.error(`Falta completar: ${faltantes.join(', ')}.`)
      return
    }
    const bloque = [
      '  {',
      `    id: ${js(id)},`,
      `    nombre: ${js(nombre)},`,
      `    marca: ${js(marca)},`,
      `    categoria: ${js(categoria)},`,
      `    precio: ${Number(precio)},`,
      `    tallas: [${tallas.map(js).join(', ')}],`,
      `    estado: ${js(estado)},`,
      `    descripcion:`,
      `      ${js(descripcion)},`,
      `    imagen: ${js(rutaImagen)},`,
      '  },',
    ].join('\n')
    setCodigo(bloque)
    const ok = await copiar(bloque)
    setCopiado(ok)
    if (ok) toast.success('¡Código copiado al portapapeles!')
    else toast.error('No se pudo copiar solo. Copialo a mano desde el recuadro.')
    requestAnimationFrame(() =>
      document
        .getElementById('codigo-generado')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
  }

  return (
    <div>
      <header className="mb-8 max-w-2xl">
        <p className="font-marker text-sm text-esmeralda">modo admin</p>
        <h1 className="font-display text-5xl leading-none tracking-wide text-white uppercase">
          Nuevo producto
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Completá el formulario y presioná{' '}
          <strong className="text-white">Generar código de producto</strong>.
          Se copia un bloque listo para pegar en{' '}
          <code className="rounded bg-grafito px-1.5 py-0.5 text-esmeralda">
            src/data/productos.js
          </code>
          . Esta pantalla no cambia la web en vivo: la prenda aparece cuando
          guardás el archivo y se publica el sitio.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <form
          onSubmit={generar}
          className="space-y-6 rounded-xl bg-grafito p-5 ring-1 ring-white/10 sm:p-7"
        >
          {/* Foto */}
          <Campo etiqueta="Foto (vertical 4:5 recomendada)">
            {foto ? (
              <div className="flex items-center gap-4">
                <img
                  src={foto.url}
                  alt="Vista previa"
                  className="aspect-[4/5] w-24 rounded-md object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0 text-sm">
                  <p className="truncate text-white">{foto.archivo.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Se guardará como{' '}
                    <span className="text-esmeralda">{archivoFoto}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setFoto(null)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-white/60 hover:text-white"
                  >
                    <X className="size-3" /> Quitar foto
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-carbon px-4 py-8 text-center transition hover:border-esmeralda">
                <ImagePlus className="size-7 text-esmeralda" />
                <span className="text-sm font-semibold text-white">
                  Tocá para elegir una foto
                </span>
                <span className="text-xs text-muted-foreground">
                  Opcional · sin foto se usa el placeholder de la marca
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const archivo = e.target.files?.[0]
                    if (archivo)
                      setFoto({ url: URL.createObjectURL(archivo), archivo })
                  }}
                />
              </label>
            )}
          </Campo>

          <Campo etiqueta="Nombre de la prenda" htmlFor="f-nombre">
            <input
              id="f-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Pantalón 874 Original Work Pant"
              className={campo}
            />
          </Campo>

          <div className="grid gap-6 sm:grid-cols-2">
            <Campo etiqueta="Marca" htmlFor="f-marca">
              <input
                id="f-marca"
                list="marcas-conocidas"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Ej. Dickies"
                className={campo}
              />
              <datalist id="marcas-conocidas">
                {MARCAS.map((m) => (
                  <option key={m.nombre} value={m.nombre} />
                ))}
              </datalist>
            </Campo>
            <Campo etiqueta="Categoría" htmlFor="f-categoria">
              <select
                id="f-categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaId)}
                className={campo}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.etiqueta}
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <Campo etiqueta="Tallas">
            <div className="flex flex-wrap gap-2">
              {[...TALLAS_RAPIDAS, ...tallas.filter((t) => !TALLAS_RAPIDAS.includes(t))].map(
                (t) => {
                  const activa = tallas.includes(t)
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={activa}
                      onClick={() => toggleTalla(t)}
                      className={cn(
                        'h-9 min-w-11 rounded-md border px-2.5 text-sm font-bold transition',
                        activa
                          ? 'border-esmeralda bg-esmeralda text-carbon'
                          : 'border-white/15 text-white/80 hover:border-esmeralda/60',
                      )}
                    >
                      {t}
                    </button>
                  )
                },
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={tallaExtra}
                onChange={(e) => setTallaExtra(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    agregarTallaExtra()
                  }
                }}
                placeholder="Otra talla (ej. 40, S/M)"
                aria-label="Agregar otra talla"
                className={campo}
              />
              <button
                type="button"
                onClick={agregarTallaExtra}
                className="h-11 shrink-0 rounded-md border border-white/15 px-4 text-sm font-semibold text-white hover:border-esmeralda"
              >
                Agregar
              </button>
            </div>
          </Campo>

          <div className="grid gap-6 sm:grid-cols-2">
            <Campo etiqueta="Precio (Bs.)" htmlFor="f-precio">
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  Bs.
                </span>
                <input
                  id="f-precio"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="380"
                  className={cn(campo, 'pl-11')}
                />
              </div>
            </Campo>
            <Campo etiqueta="Estado">
              <div className="grid grid-cols-2 gap-2">
                {(['Disponible', 'Agotado'] as const).map((e) => (
                  <button
                    key={e}
                    type="button"
                    aria-pressed={estado === e}
                    onClick={() => setEstado(e)}
                    className={cn(
                      'h-11 rounded-md border text-sm font-bold transition',
                      estado === e
                        ? e === 'Disponible'
                          ? 'border-esmeralda bg-esmeralda text-carbon'
                          : 'border-white/40 bg-white/15 text-white'
                        : 'border-white/15 text-white/70 hover:border-white/40',
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </Campo>
          </div>

          <Campo etiqueta="Descripción" htmlFor="f-descripcion">
            <textarea
              id="f-descripcion"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Corte, tela, detalles, cómo combinarla…"
              className={cn(campo, 'h-auto py-2.5 leading-relaxed')}
            />
          </Campo>

          <button
            type="submit"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-esmeralda text-base font-extrabold tracking-wide text-carbon uppercase shadow-[0_10px_40px_-12px_rgba(34,197,94,0.8)] transition hover:bg-[#2fe06d]"
          >
            <ClipboardCopy className="size-5" /> Generar código de producto
          </button>
          {faltantes.length ? (
            <p className="-mt-3 text-center text-xs text-muted-foreground">
              Falta: {faltantes.join(', ')}
            </p>
          ) : null}
        </form>

        {/* Vista previa */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 text-xs font-bold tracking-[0.25em] text-white/50 uppercase">
            Así se verá en el catálogo
          </p>
          <div className="mx-auto max-w-sm">
            <ProductCard producto={vistaPrevia} />
          </div>
        </aside>
      </div>

      {codigo ? (
        <section
          id="codigo-generado"
          className="mt-10 scroll-mt-24 rounded-xl bg-grafito p-5 ring-1 ring-esmeralda/40 sm:p-7"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-3xl tracking-wide text-white uppercase">
              {copiado ? (
                <Check className="size-7 text-esmeralda" />
              ) : null}
              {copiado ? 'Código copiado' : 'Código listo'}
            </h2>
            <button
              type="button"
              onClick={async () => {
                const ok = await copiar(codigo)
                setCopiado(ok)
                if (ok) toast.success('Copiado otra vez')
              }}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-semibold text-white hover:border-esmeralda"
            >
              <ClipboardCopy className="size-4" /> Copiar de nuevo
            </button>
          </div>

          <ol className="mt-5 space-y-3 text-sm leading-relaxed text-white/80">
            <Paso n={1}>
              Abrí el archivo{' '}
              <code className="text-esmeralda">src/data/productos.js</code>.
            </Paso>
            <Paso n={2}>
              Buscá la línea{' '}
              <code className="text-esmeralda">
                {'// 👇 PEGÁ LOS PRODUCTOS NUEVOS AQUÍ'}
              </code>{' '}
              y pegá el bloque justo debajo (Ctrl+V / Cmd+V). Ya trae la coma
              final.
            </Paso>
            {foto ? (
              <Paso n={3}>
                Guardá la foto en la carpeta{' '}
                <code className="text-esmeralda">public/img/productos/</code>{' '}
                con el nombre{' '}
                <code className="text-esmeralda">{archivoFoto}</code>.{' '}
                <a
                  href={foto.url}
                  download={archivoFoto}
                  className="inline-flex items-center gap-1 font-semibold text-esmeralda underline underline-offset-4"
                >
                  <Download className="size-3.5" /> Descargar foto ya
                  renombrada
                </a>
              </Paso>
            ) : (
              <Paso n={3}>
                Sin foto: se mostrará el placeholder de la marca. Cuando la
                tengas, guardala en{' '}
                <code className="text-esmeralda">public/img/productos/</code> y
                escribí su ruta en <code className="text-esmeralda">imagen</code>{' '}
                (ej. <code>&apos;/img/productos/{id}.jpg&apos;</code>).
              </Paso>
            )}
            {marcaNueva ? (
              <Paso n={4}>
                <strong className="text-white">“{marca.trim()}” es una marca nueva.</strong>{' '}
                Agregá{' '}
                <code className="text-esmeralda">
                  {`{ nombre: '${marca.trim().replace(/'/g, "\\'")}' },`}
                </code>{' '}
                en la lista <code className="text-esmeralda">MARCAS</code> del
                mismo archivo para que aparezca en los filtros.
              </Paso>
            ) : null}
            <Paso n={marcaNueva ? 5 : 4}>
              Guardá el archivo y publicá el sitio. ¡Listo, la prenda ya está en
              el catálogo!
            </Paso>
          </ol>

          <pre className="mt-6 overflow-x-auto rounded-lg bg-carbon p-4 text-[13px] leading-relaxed text-white/90 ring-1 ring-white/10">
            <code>{codigo}</code>
          </pre>
        </section>
      ) : null}
    </div>
  )
}

function Campo({
  etiqueta,
  htmlFor,
  children,
}: {
  etiqueta: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs font-bold tracking-[0.2em] text-white/60 uppercase"
      >
        {etiqueta}
      </label>
      {children}
    </div>
  )
}

function Paso({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-bosque text-xs font-bold text-esmeralda">
        {n}
      </span>
      <span>{children}</span>
    </li>
  )
}
