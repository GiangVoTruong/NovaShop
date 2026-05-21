import { Form, Input, Select, Switch, message } from 'antd'
import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../../shared/ui/Button'
import AdminPageHeader from '../../layout/components/AdminPageHeader'

interface StoreSettingsForm {
  storeName: string
  storeEmail: string
  currency: string
  freeShippingThreshold: number
  maintenanceMode: boolean
  orderNotifications: boolean
}

export default function SettingsPage() {
  const { t } = useTranslation()
  const [form] = Form.useForm<StoreSettingsForm>()

  const handleSave = async () => {
    try {
      await form.validateFields()
      message.success(t('admin.settings.messages.saved'))
    } catch {
      message.error(t('admin.settings.messages.validationError'))
    }
  }

  return (
    <div className="mx-auto max-w-[960px]">
      <AdminPageHeader
        eyebrow={t('admin.settings.eyebrow')}
        title={
          <>
            {t('admin.settings.title')}{' '}
            <span className="text-gradient">{t('admin.settings.titleHighlight')}</span>
          </>
        }
        description={t('admin.settings.description')}
        actions={
          <Button leftIcon={<Save className="size-4" />} onClick={handleSave}>
            {t('admin.settings.save')}
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
        <section className="glass rounded-3xl p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {t('admin.settings.general.title')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label={t('admin.settings.general.storeName')}
              name="storeName"
              rules={[
                { required: true, message: t('admin.settings.general.storeNameRequired') },
              ]}
            >
              <Input placeholder="NovaShop" />
            </Form.Item>
            <Form.Item
              label={t('admin.settings.general.supportEmail')}
              name="storeEmail"
              rules={[
                { required: true, message: t('admin.settings.general.emailRequired') },
                { type: 'email', message: t('admin.settings.general.emailInvalid') },
              ]}
            >
              <Input placeholder="support@nova.shop" />
            </Form.Item>
            <Form.Item label={t('admin.settings.general.currency')} name="currency">
              <Select
                options={[
                  { value: 'VND', label: t('admin.settings.general.currencyVnd') },
                  { value: 'USD', label: t('admin.settings.general.currencyUsd') },
                ]}
              />
            </Form.Item>
            <Form.Item
              label={t('admin.settings.general.freeShipping')}
              name="freeShippingThreshold"
            >
              <Input type="number" min={0} />
            </Form.Item>
          </div>
        </section>

        <section className="glass rounded-3xl p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {t('admin.settings.operations.title')}
          </h2>
          <div className="space-y-4">
            <Form.Item
              label={t('admin.settings.operations.maintenance')}
              name="maintenanceMode"
              valuePropName="checked"
              extra={t('admin.settings.operations.maintenanceExtra')}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={t('admin.settings.operations.orderNotifications')}
              name="orderNotifications"
              valuePropName="checked"
              extra={t('admin.settings.operations.orderNotificationsExtra')}
            >
              <Switch />
            </Form.Item>
          </div>
        </section>
      </Form>
    </div>
  )
}
