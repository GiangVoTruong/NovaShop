import { Form, Input, Select, Switch, message } from 'antd'
import { Save } from 'lucide-react'
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
  const [form] = Form.useForm<StoreSettingsForm>()

  const handleSave = async () => {
    try {
      await form.validateFields()
      message.success('Đã lưu cài đặt cửa hàng')
    } catch {
      message.error('Vui lòng kiểm tra lại thông tin')
    }
  }

  return (
    <div className="mx-auto max-w-[960px]">
      <AdminPageHeader
        eyebrow="Cài đặt hệ thống"
        title={
          <>
            Cấu hình <span className="text-gradient">cửa hàng</span>
          </>
        }
        description="Quản lý thông tin cửa hàng, thông báo và tuỳ chọn vận hành."
        actions={
          <Button leftIcon={<Save className="size-4" />} onClick={handleSave}>
            Lưu thay đổi
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
          <h2 className="mb-4 text-lg font-bold text-slate-900">Thông tin chung</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Form.Item
              label="Tên cửa hàng"
              name="storeName"
              rules={[{ required: true, message: 'Nhập tên cửa hàng' }]}
            >
              <Input placeholder="NovaShop" />
            </Form.Item>
            <Form.Item
              label="Email hỗ trợ"
              name="storeEmail"
              rules={[
                { required: true, message: 'Nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder="support@nova.shop" />
            </Form.Item>
            <Form.Item label="Tiền tệ" name="currency">
              <Select
                options={[
                  { value: 'VND', label: 'VND — Việt Nam Đồng' },
                  { value: 'USD', label: 'USD — US Dollar' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Miễn phí ship từ (VND)" name="freeShippingThreshold">
              <Input type="number" min={0} />
            </Form.Item>
          </div>
        </section>

        <section className="glass rounded-3xl p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Vận hành</h2>
          <div className="space-y-4">
            <Form.Item
              label="Chế độ bảo trì"
              name="maintenanceMode"
              valuePropName="checked"
              extra="Khi bật, khách hàng sẽ thấy trang bảo trì thay vì cửa hàng."
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="Thông báo đơn hàng mới"
              name="orderNotifications"
              valuePropName="checked"
              extra="Gửi email cho admin khi có đơn hàng mới."
            >
              <Switch />
            </Form.Item>
          </div>
        </section>
      </Form>
    </div>
  )
}
