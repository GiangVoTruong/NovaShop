import Button from '@/features/NovaShop/shared/ui/Button'
import type { ApiAddressResponse, CreateAddressRequest } from '@/types/address.types'
import { Checkbox, Form, Input, Modal } from 'antd'
import type { FormProps } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateAddress, useUpdateAddress } from '../hooks/useAddresses'

type AddressFormValues = CreateAddressRequest

type AddressFormModalProps = {
  open: boolean
  editingAddress: ApiAddressResponse | null
  onClose: () => void
}

export default function AddressFormModal({ open, editingAddress, onClose }: AddressFormModalProps) {
  const { t: translate } = useTranslation()
  const [form] = Form.useForm<AddressFormValues>()
  const createMutation = useCreateAddress()
  const updateMutation = useUpdateAddress()
  const isEditing = Boolean(editingAddress)
  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!open) {
      return
    }

    if (editingAddress) {
      form.setFieldsValue({
        label: editingAddress.label ?? undefined,
        recipientName: editingAddress.recipientName,
        phone: editingAddress.phone,
        line1: editingAddress.line1,
        ward: editingAddress.ward ?? undefined,
        district: editingAddress.district,
        city: editingAddress.city,
        isDefault: editingAddress.isDefault,
      })
      return
    }

    form.resetFields()
  }, [open, editingAddress, form])

  const handleSubmit: FormProps<AddressFormValues>['onFinish'] = (values) => {
    if (editingAddress) {
      updateMutation.mutate(
        { addressId: editingAddress.id, request: values },
        { onSuccess: onClose },
      )
      return
    }

    createMutation.mutate(values, { onSuccess: onClose })
  }

  return (
    <Modal
      open={open}
      title={
        isEditing
          ? translate('profile.address.form.editTitle')
          : translate('profile.address.form.addTitle')
      }
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
        <Form.Item name="label" label={translate('profile.address.form.label')}>
          <Input placeholder={translate('profile.address.form.labelPlaceholder')} />
        </Form.Item>
        <Form.Item
          name="recipientName"
          label={translate('profile.address.form.recipientName')}
          rules={[{ required: true, message: translate('profile.address.form.required') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label={translate('profile.address.form.phone')}
          rules={[
            { required: true, message: translate('profile.address.form.required') },
            {
              pattern: /^0[0-9]{9,10}$/,
              message: translate('profile.address.form.phoneInvalid'),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="line1"
          label={translate('profile.address.form.line1')}
          rules={[{ required: true, message: translate('profile.address.form.required') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="ward" label={translate('profile.address.form.ward')}>
          <Input />
        </Form.Item>
        <Form.Item
          name="district"
          label={translate('profile.address.form.district')}
          rules={[{ required: true, message: translate('profile.address.form.required') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="city"
          label={translate('profile.address.form.city')}
          rules={[{ required: true, message: translate('profile.address.form.required') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="isDefault" valuePropName="checked">
          <Checkbox>{translate('profile.address.form.setDefault')}</Checkbox>
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            {translate('profile.address.form.cancel')}
          </Button>
          <Button type="submit" glow loading={isPending}>
            {translate('profile.address.form.save')}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
