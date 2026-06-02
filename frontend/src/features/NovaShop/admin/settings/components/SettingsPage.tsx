import { Form, Input, InputNumber, Spin, Switch, message } from 'antd'
import { Save } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/features/NovaShop/shared/ui/Button'
import type { ShopSettings } from '@/types/admin.types'
import { useAdminSettings, useUpdateAdminSettings } from '../../hooks/useAdminSettings'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
import AdminSection from '../../layout/components/AdminSection'
import AdminShell from '../../layout/components/AdminShell'
import { toAdminAmount } from '../../lib/adminApi'

export default function SettingsPage() {
  const { t: translate } = useTranslation()
  const [form] = Form.useForm<ShopSettings>()
  const settingsQuery = useAdminSettings()
  const updateMutation = useUpdateAdminSettings()

  useEffect(() => {
    if (!settingsQuery.data) {
      return
    }

    form.setFieldsValue({
      shopName: settingsQuery.data.shopName,
      supportEmail: settingsQuery.data.supportEmail,
      supportPhone: settingsQuery.data.supportPhone,
      shippingFeeDefault: toAdminAmount(settingsQuery.data.shippingFeeDefault),
      freeShippingThreshold: toAdminAmount(settingsQuery.data.freeShippingThreshold),
      taxRate: toAdminAmount(settingsQuery.data.taxRate),
      maintenanceMode: settingsQuery.data.maintenanceMode,
    })
  }, [settingsQuery.data, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      updateMutation.mutate(values, {
        onSuccess: () => message.success(translate('admin.settings.messages.saved')),
        onError: () => message.error(translate('admin.settings.messages.saveFailed')),
      })
    } catch {
      message.error(translate('admin.settings.messages.validationError'))
    }
  }

  if (settingsQuery.isLoading) {
    return (
      <AdminShell className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </AdminShell>
    )
  }

  return (
    <AdminShell className="max-w-[960px]">
      <AdminPageHeader
        eyebrow={translate('admin.settings.eyebrow')}
        title={translate('admin.settings.title')}
        titleHighlight={translate('admin.settings.titleHighlight')}
        description={translate('admin.settings.description')}
        actions={
          <Button
            leftIcon={<Save className="size-4" />}
            loading={updateMutation.isPending}
            onClick={handleSave}
          >
            {translate('admin.settings.save')}
          </Button>
        }
      />

      <Form form={form} layout="vertical" className="space-y-6">
        <AdminSection title={translate('admin.settings.general.title')}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label={translate('admin.settings.general.storeName')}
              name="shopName"
              rules={[
                { required: true, message: translate('admin.settings.general.storeNameRequired') },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={translate('admin.settings.general.supportEmail')}
              name="supportEmail"
              rules={[
                { required: true, message: translate('admin.settings.general.emailRequired') },
                { type: 'email', message: translate('admin.settings.general.emailInvalid') },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={translate('admin.settings.general.supportPhone')}
              name="supportPhone"
              rules={[{ required: true, message: translate('admin.settings.general.phoneRequired') }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={translate('admin.settings.general.freeShipping')}
              name="freeShippingThreshold"
            >
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label={translate('admin.settings.general.shippingFee')} name="shippingFeeDefault">
              <InputNumber className="w-full" min={0} />
            </Form.Item>
            <Form.Item label={translate('admin.settings.general.taxRate')} name="taxRate">
              <InputNumber className="w-full" min={0} max={1} step={0.01} />
            </Form.Item>
          </div>
        </AdminSection>

        <AdminSection title={translate('admin.settings.operations.title')}>
          <Form.Item
            label={translate('admin.settings.operations.maintenance')}
            name="maintenanceMode"
            valuePropName="checked"
            extra={translate('admin.settings.operations.maintenanceExtra')}
          >
            <Switch />
          </Form.Item>
        </AdminSection>
      </Form>
    </AdminShell>
  )
}
