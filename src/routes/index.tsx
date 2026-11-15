import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SearchX, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  CATEGORIAS,
  MARCAS,
  PRODUCTOS,
  normalizar,
  type Producto,
} from '@/lib/catalogo'
import { SiteHeader } from '@/components/catalogo/site-header'
import { Hero } from '@/components/catalogo/hero'
import { ProductCard } from '@/components/catalogo/product-card'
import { ProductModal } from '@/components/catalogo/product-modal'
import { SiteFooter } from '@/components/catalogo/site-footer'

export const Route = createFileRoute('/')({
  component: Catalogo,
})

const TODAS = 'todas'

function Catalogo() {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState<string>(TODAS)
  const [marca, setMarca] = useState<string>(TODAS)
  const [abierto, setAbierto] = useState<Producto | null>(null)

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda)
    return PRODUCTOS.filter((p) => {
      if (categoria !== TODAS && p.categoria !== categoria) return false
      if (marca !== TODAS && p.marca !== marca) return false
      if (q && !normalizar(`${p.nombre} ${p.marca}`).includes(q)) return false
      return true
    })
  }, [busqueda, categoria, marca])

  const hayFiltros = busqueda !== '' || categoria !== TODAS || marca !== TODAS
  const limpiar = () => {
    setBusqueda('')
    setCategoria(TODAS)
    setMarca(TODAS)
  }

  return (
    <div className="min-h-screen bg-carbon">
      <SiteHeader busqueda={busqueda} onBusqueda={setBusqueda} />

      <main>
        <Hero />

        <section id="catalogo" className="mx-auto max-w-content px-4 pt-12 pb-20 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-marker text-sm text-esmeralda">
                la pinta de la semana
              </p>
              <h2 className="font-display text-5xl leading-none tracking-wide text-white uppercase sm:text-6xl">
                Catálogo
              </h2>
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <strong className="text-white">{filtrados.length}</strong>{' '}
              {filtrados.length === 1 ? 'prenda' : 'prendas'}
              {hayFiltros ? (
                <>
                  {' · '}
                  <button
                    type="button"
                    onClick={limpiar}
                    className="font-semibold text-esmeralda underline-offset-4 hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </>
              ) : null}
            </p>
          </div>

          {/* Barra de filtros combinables */}
          <div className="sticky top-[65px] z-30 -mx-4 mb-8 space-y-2.5 border-y border-white/5 bg-carbon/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
            <FilaFiltros etiqueta="Categoría">
              <Chip activo={categoria === TODAS} onClick={() => setCategoria(TODAS)}>
                Todos
              </Chip>
              {CATEGORIAS.map((c) => (
                <Chip
                  key={c.id}
                  activo={categoria === c.id}
                  onClick={() => setCategoria(c.id)}
                >
                  {c.etiqueta}
                </Chip>
              ))}
            </FilaFiltros>
            <FilaFiltros etiqueta="Marca">
              <Chip activo={marca === TODAS} onClick={() => setMarca(TODAS)}>
                Todas
              </Chip>
              {MARCAS.map((m) => (
                <Chip
                  key={m.nombre}
                  activo={marca === m.nombre}
                  onClick={() => setMarca(m.nombre)}
                  destacada={m.destacada}
                >
                  {m.destacada ? <Star className="size-3 fill-current" /> : null}
                  {m.nombre}
                  {m.destacada ? (
                    <span className="hidden text-[10px] font-bold tracking-wider uppercase opacity-70 sm:inline">
                      · Marca principal
                    </span>
                  ) : null}
                </Chip>
              ))}
            </FilaFiltros>
          </div>

          {filtrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {filtrados.map((p, i) => (
                <ProductCard
                  key={p.id}
                  producto={p}
                  onAbrir={setAbierto}
                  eager={i < 2}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-white/15 bg-grafito px-6 py-16 text-center">
              <SearchX className="size-10 text-esmeralda" />
              <p className="mt-4 font-display text-3xl tracking-wide text-white uppercase">
                Nada por aquí, camba
              </p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                No encontramos prendas con esos filtros. Probá con otra
                búsqueda o escribinos por WhatsApp y te la conseguimos.
              </p>
              <button
                type="button"
                onClick={limpiar}
                className="mt-6 h-11 rounded-full bg-esmeralda px-6 text-sm font-bold text-carbon hover:bg-[#2fe06d]"
              >
                Ver todo el catálogo
              </button>
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
      <ProductModal producto={abierto} onCerrar={() => setAbierto(null)} />
    </div>
  )
}

function FilaFiltros({
  etiqueta,
  children,
}: {
  etiqueta: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden w-20 shrink-0 text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase sm:block">
        {etiqueta}
      </span>
      <div
        role="group"
        aria-label={`Filtrar por ${etiqueta.toLowerCase()}`}
        className="tp-scrollbar-none -mr-4 flex min-w-0 flex-1 gap-2 overflow-x-auto pr-4 sm:mr-0 sm:flex-wrap sm:overflow-visible sm:pr-0"
      >
        {children}
      </div>
    </div>
  )
}

function Chip({
  activo,
  destacada,
  onClick,
  children,
}: {
  activo: boolean
  destacada?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={onClick}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition',
        activo
          ? 'border-esmeralda bg-esmeralda text-carbon'
          : destacada
            ? 'border-esmeralda/40 bg-bosque/40 text-white hover:border-esmeralda'
            : 'border-white/15 bg-grafito text-white/80 hover:border-white/40 hover:text-white',
      )}
    >
      {children}
    </button>
  )
}
