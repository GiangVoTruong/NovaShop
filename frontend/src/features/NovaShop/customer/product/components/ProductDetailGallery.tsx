import { cx } from '@/features/NovaShop/shared/ui/cx'
import { ZoomIn } from 'lucide-react'

interface ProductDetailGalleryProps {
  images: string[]
  productName: string
  discount: number
  activeImage: number
  onSelectImage: (index: number) => void
}

export default function ProductDetailGallery({
  images,
  productName,
  discount,
  activeImage,
  onSelectImage,
}: ProductDetailGalleryProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
      {images.length > 1 && (
        <div className="order-2 flex gap-2.5 overflow-x-auto pb-1 lg:order-1 lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((imageUrl, imageIndex) => (
            <button
              key={`${imageUrl}-${imageIndex}`}
              type="button"
              onClick={() => onSelectImage(imageIndex)}
              className={cx(
                'size-[72px] shrink-0 overflow-hidden rounded-2xl border-2 transition-all lg:size-20',
                activeImage === imageIndex
                  ? 'border-fuchsia-500 shadow-md shadow-fuchsia-500/20'
                  : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <img src={imageUrl} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="group relative order-1 min-w-0 flex-1 lg:order-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={images[activeImage]}
            alt={productName}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="pointer-events-none absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-slate-600 opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <ZoomIn className="size-4" />
          </span>
        </div>

        {discount > 0 && (
          <span className="absolute left-5 top-5 rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-pink-500/40 sm:text-sm">
            -{discount}%
          </span>
        )}
      </div>
    </div>
  )
}
