import Button from '@/features/NovaShop/shared/ui/Button'
import EmptyState from '@/features/NovaShop/shared/ui/EmptyState'
import { PATHS } from '@/router/paths'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function CheckoutPage() {
  const { t: translate } = useTranslation()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <EmptyState
        icon={<ShoppingBag className="size-7" />}
        title={translate('checkout.empty.title')}
        description={translate('checkout.empty.description')}
        action={
          <Link to={PATHS.PRODUCTS}>
            <Button rightIcon={<ArrowRight className="size-4" />} glow>
              {translate('checkout.empty.shopNow')}
            </Button>
          </Link>
        }
      />
    </div>
  )
}
