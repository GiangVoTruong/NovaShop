import Button from '@/features/NovaShop/shared/ui/Button'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import { PATHS } from '@/router/paths'
import { Heart, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function WishlistPage() {
  const { t: translate } = useTranslation()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <EmptyState
        icon={<Heart className="size-7" />}
        title={translate('wishlist.empty.title')}
        description={translate('wishlist.empty.description')}
        action={
          <Link to={PATHS.PRODUCTS}>
            <Button leftIcon={<ShoppingBag className="size-4" />} glow>
              {translate('wishlist.empty.explore')}
            </Button>
          </Link>
        }
      />
    </div>
  )
}
