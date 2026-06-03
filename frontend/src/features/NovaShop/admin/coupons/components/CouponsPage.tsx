import { Form, Input, InputNumber, Modal, Select, Spin, message } from 'antd'
import type { FormProps } from 'antd'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatCurrency, formatDate } from '@/features/NovaShop/shared/format'
import type { AdminCoupon, CreateAdminCouponRequest } from '@/types/admin.types'
import Badge from '@/features/NovaShop/shared/ui/Badge'
import Button from '@/features/NovaShop/shared/ui/Button'
import {
  useAdminCoupons,
  useCreateAdminCoupon,
  useDeleteAdminCoupon,
  useUpdateAdminCoupon,
} from '../../hooks/useAdminCoupons'
import { getCouponStatus, toAdminAmount } from '../../lib/adminApi'
import AdminEmptyState from '../../layout/components/AdminEmptyState'
import AdminPage from '../../layout/components/AdminPage'

const COUPON_STATUS_TONE = {
  active: 'emerald',
  expired: 'rose',
  paused: 'amber',
} as const

export default function CouponsPage() {
  const { t: translate } = useTranslation()
  const couponsQuery = useAdminCoupons()
  const [createOpen, setCreateOpen] = useState(false)

  if (couponsQuery.isLoading) {
    return (
      <AdminPage
        eyebrow={translate('admin.coupons.eyebrow')}
        title={translate('admin.coupons.title')}
        titleHighlight={translate('admin.coupons.titleHighlight')}
        description={translate('admin.coupons.description')}
      >
        <Spin size="large" />
      </AdminPage>
    )
  }

  const coupons = couponsQuery.data ?? []

  return (
    <AdminPage
      eyebrow={translate('admin.coupons.eyebrow')}
      title={translate('admin.coupons.title')}
      titleHighlight={translate('admin.coupons.titleHighlight')}
      description={translate('admin.coupons.description')}
      actions={
        <Button leftIcon={<Plus className="size-4" />} onClick={() => setCreateOpen(true)}>
          {translate('admin.coupons.create')}
        </Button>
      }
    >
      {coupons.length === 0 ? (
        <AdminEmptyState message={translate('admin.coupons.empty')} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      )}

      <CreateCouponModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </AdminPage>
  )
}

function CouponCard({ coupon }: { coupon: AdminCoupon }) {
  const { t: translate } = useTranslation()
  const updateMutation = useUpdateAdminCoupon()
  const deleteMutation = useDeleteAdminCoupon()
  const status = getCouponStatus(coupon)
  const usagePercent =
    coupon.usageLimit > 0 ? Math.round((coupon.usedCount / coupon.usageLimit) * 100) : 0
  const discountLabel =
    coupon.type === 'PERCENT'
      ? translate('admin.coupons.discountPercent', { value: toAdminAmount(coupon.value) })
      : translate('admin.coupons.discountFixed', {
          amount: formatCurrency(toAdminAmount(coupon.value)),
        })

  const handleToggleActive = () => {
    updateMutation.mutate(
      { couponId: coupon.id, request: { active: !coupon.active } },
      {
        onSuccess: () => message.success(translate('admin.coupons.messages.updated')),
        onError: () => message.error(translate('admin.coupons.messages.failed')),
      },
    )
  }

  const handleDelete = () => {
    Modal.confirm({
      title: translate('admin.coupons.deleteConfirm'),
      onOk: () =>
        deleteMutation.mutateAsync(coupon.id).then(() => {
          message.success(translate('admin.coupons.messages.deleted'))
        }),
    })
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-blue-300">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xl font-bold tracking-tight text-slate-900">{coupon.code}</p>
          <p className="mt-1 text-sm text-blue-300">{discountLabel}</p>
        </div>
        <Badge tone={COUPON_STATUS_TONE[status]} dot>
          {translate(`status.coupon.${status}`)}
        </Badge>
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <dt>{translate('admin.coupons.minOrder')}</dt>
          <dd className="font-semibold text-slate-200">
            {coupon.minOrderAmount
              ? formatCurrency(toAdminAmount(coupon.minOrderAmount))
              : translate('admin.coupons.none')}
          </dd>
        </div>
        <div className="flex justify-between text-slate-400">
          <dt>{translate('admin.coupons.expires')}</dt>
          <dd className="font-semibold text-slate-200">
            {coupon.endAt ? formatDate(coupon.endAt) : translate('admin.coupons.none')}
          </dd>
        </div>
        <div className="flex justify-between text-slate-400">
          <dt>{translate('admin.coupons.used')}</dt>
          <dd className="font-semibold text-slate-200">
            {coupon.usedCount} / {coupon.usageLimit}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>{translate('admin.coupons.usageProgress')}</span>
          <span>{usagePercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-500 to-cyan-500"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          loading={updateMutation.isPending}
          onClick={handleToggleActive}
        >
          {coupon.active
            ? translate('admin.coupons.pause')
            : translate('admin.coupons.activate')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-rose-400"
          loading={deleteMutation.isPending}
          onClick={handleDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </article>
  )
}

function CreateCouponModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t: translate } = useTranslation()
  const [form] = Form.useForm<CreateAdminCouponRequest>()
  const createMutation = useCreateAdminCoupon()

  const handleSubmit: FormProps<CreateAdminCouponRequest>['onFinish'] = (values) => {
    createMutation.mutate(
      { ...values, code: values.code.trim().toUpperCase() },
      {
        onSuccess: () => {
          message.success(translate('admin.coupons.messages.created'))
          form.resetFields()
          onClose()
        },
        onError: () => message.error(translate('admin.coupons.messages.failed')),
      },
    )
  }

  return (
    <Modal
      open={open}
      title={translate('admin.coupons.create')}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{ type: 'PERCENT', usageLimit: 100, active: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="code"
          label={translate('admin.coupons.form.code')}
          rules={[{ required: true, message: translate('admin.coupons.form.required') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="type" label={translate('admin.coupons.form.type')}>
          <Select
            options={[
              { value: 'PERCENT', label: translate('admin.coupons.form.typePercent') },
              { value: 'FIXED', label: translate('admin.coupons.form.typeFixed') },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="value"
          label={translate('admin.coupons.form.value')}
          rules={[{ required: true, message: translate('admin.coupons.form.required') }]}
        >
          <InputNumber className="w-full" min={1} />
        </Form.Item>
        <Form.Item name="minOrderAmount" label={translate('admin.coupons.form.minOrder')}>
          <InputNumber className="w-full" min={0} />
        </Form.Item>
        <Form.Item
          name="usageLimit"
          label={translate('admin.coupons.form.usageLimit')}
          rules={[{ required: true, message: translate('admin.coupons.form.required') }]}
        >
          <InputNumber className="w-full" min={1} />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            {translate('admin.common.cancel')}
          </Button>
          <Button type="submit" glow loading={createMutation.isPending}>
            {translate('admin.coupons.form.save')}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
