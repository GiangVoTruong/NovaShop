import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PATHS } from '@/router/paths'
import { PRODUCTS } from '../../../shared/data/products'
import { useShop } from '../../../shared/store/useShop'
import Button from '../../../shared/ui/Button'
import EmptyState from '../../../shared/ui/EmptyState'
import ProductCard from '../../product/components/ProductCard'

export default function WishlistPage() {
  const { wishlist } = useShop()
  const items = PRODUCTS.filter((product) => wishlist.includes(product.id))

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
          ♥ Yêu thích
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Wishlist <span className="text-gradient">của bạn</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {items.length} sản phẩm bạn đang để mắt tới
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-7" />}
          title="Chưa có sản phẩm yêu thích"
          description="Nhấn vào biểu tượng trái tim trên sản phẩm để thêm vào danh sách yêu thích."
          action={
            <Link to={PATHS.PRODUCTS}>
              <Button leftIcon={<ShoppingBag className="size-4" />} glow>
                Khám phá sản phẩm
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
