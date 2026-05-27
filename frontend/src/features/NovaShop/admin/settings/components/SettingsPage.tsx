import { Form, Input, Select, Switch, message } from 'antd'
import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '@/features/NovaShop/shared/ui/Button'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
import AdminSection from '../../layout/components/AdminSection'
import AdminShell from '../../layout/components/AdminShell'

interface StoreSettingsForm {
  storeName: string
  storeEmail: string
  currency: string
  freeShippingThreshold: number
  maintenanceMode: boolean
  orderNotifications: boolean
}

export default function SettingsPage() {
  const { t: translate } = useTranslation()
  const [form] = Form.useForm<StoreSettingsForm>()

  const handleSave = async () => {
    try {
      await form.validateFields()
      message.success(translate('admin.settings.messages.saved'))
    } catch {
      message.error(translate('admin.settings.messages.validationError'))
    }
  }

  return (
    <AdminShell className="max-w-[960px]">
      <AdminPageHeader
        eyebrow={translate('admin.settings.eyebrow')}
        title={translate('admin.settings.title')}
        titleHighlight={translate('admin.settings.titleHighlight')}
        description={translate('admin.settings.description')}
        actions={
          <Button leftIcon={<Save className="size-4" />} onClick={handleSave}>
            {translate('admin.settings.save')}
          </Button>
        }
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          storeName: 'NovaShop',
          storeEmail: 'support@nova.shop',
          currency: 'VND',
          freeShippingThreshold: 500000,
          maintenanceMode: false,
          orderNotifications: true,
        }}
        className="space-y-6"
      >
        <AdminSection title={translate('admin.settings.general.title')}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label={translate('admin.settings.general.storeName')}
              name="storeName"
              rules={[
                { required: true, message: translate('admin.settings.general.storeNameRequired') },
              ]}
            >
              <Input placeholder="NovaShop" />
            </Form.Item>
            <Form.Item
              label={translate('admin.settings.general.supportEmail')}
              name="storeEmail"
              rules={[
                { required: true, message: translate('admin.settings.general.emailRequired') },
                { type: 'email', message: translate('admin.settings.general.emailInvalid') },
              ]}
            >
              <Input placeholder="support@nova.shop" />
            </Form.Item>
            <Form.Item label={translate('admin.settings.general.currency')} name="currency">
              <Select
                options={[
                  { value: 'VND', label: translate('admin.settings.general.currencyVnd') },
                  { value: 'USD', label: translate('admin.settings.general.currencyUsd') },
                ]}
              />
            </Form.Item>
            <Form.Item
              label={translate('admin.settings.general.freeShipping')}
              name="freeShippingThreshold"
            >
              <Input type="number" min={0} />
            </Form.Item>
          </div>
        </AdminSection>

        <AdminSection title={translate('admin.settings.operations.title')}>
          <div className="space-y-4">
            <Form.Item
              label={translate('admin.settings.operations.maintenance')}
              name="maintenanceMode"
              valuePropName="checked"
              extra={translate('admin.settings.operations.maintenanceExtra')}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={translate('admin.settings.operations.orderNotifications')}
              name="orderNotifications"
              valuePropName="checked"
              extra={translate('admin.settings.operations.orderNotificationsExtra')}
            >
              <Switch />
            </Form.Item>
          </div>
        </AdminSection>
      </Form>
    </AdminShell>
  )
}
