import Button from '@/features/NovaShop/shared/ui/Button'
import type { ApiAddressResponse, CreateAddressRequest } from '@/types/address.types'
import type { FormProps } from 'antd'
import { Form, Input, Modal, Select, Switch } from 'antd'
import { MapPin, Phone, Tag, UserRound } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateAddress, useUpdateAddress } from '../hooks/useAddresses'
import {
  buildDistrictSelectOptions,
  buildWardSelectOptions,
  getCityOptions,
} from '../lib/addressLocationOptions'

type AddressFormValues = CreateAddressRequest

type AddressFormModalProps = {
  open: boolean
  editingAddress: ApiAddressResponse | null
  onClose: () => void
}

const inputClassName = 'rounded-2xl!'
const selectClassName = 'w-full'
const selectSearchConfig = { optionFilterProp: 'label' as const }

export default function AddressFormModal({ open, editingAddress, onClose }: AddressFormModalProps) {
  const { t: translate } = useTranslation()
  const [form] = Form.useForm<AddressFormValues>()
  const createMutation = useCreateAddress()
  const updateMutation = useUpdateAddress()
  const isEditing = Boolean(editingAddress)
  const isPending = createMutation.isPending || updateMutation.isPending
  const selectedCity = Form.useWatch('city', form)
  const selectedDistrict = Form.useWatch('district', form)
  const selectedWard = Form.useWatch('ward', form)

  const cityOptions = getCityOptions()
  const districtOptions = buildDistrictSelectOptions(selectedCity, selectedDistrict)
  const wardOptions = buildWardSelectOptions(selectedCity, selectedDistrict, selectedWard)

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

  const modalTitle = isEditing
    ? translate('profile.address.form.editTitle')
    : translate('profile.address.form.addTitle')

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={520}
      closable
      title={null}
      styles={{
        container: { borderRadius: 24, overflow: 'hidden', padding: 0 },
        body: { padding: 0, maxHeight: 'calc(100vh - 96px)', overflow: 'hidden' },
      }}
    >
      <div className="flex max-h-[calc(100vh-96px)] flex-col">
        <div className="shrink-0 border-b border-slate-100 bg-linear-to-br from-emerald-50/90 via-white to-teal-50/60 px-7 py-6">
          <div className="flex items-center gap-3 pr-10">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,0.55)]">
              <MapPin className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                {translate('profile.address.title')}
              </p>
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{modalTitle}</h2>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="profile-form flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-7 py-6">
            <Form.Item name="label" label={translate('profile.address.form.label')}>
              <Input
                size="large"
                className={inputClassName}
                prefix={<Tag className="size-4 text-slate-400" />}
                placeholder={translate('profile.address.form.labelPlaceholder')}
              />
            </Form.Item>

            <div className="profile-form-grid grid w-full gap-x-4 gap-y-5">
              <Form.Item
                name="recipientName"
                className="mb-0! min-w-0"
                label={translate('profile.address.form.recipientName')}
                rules={[{ required: true, message: translate('profile.address.form.required') }]}
              >
                <Input
                  size="large"
                  className={inputClassName}
                  prefix={<UserRound className="size-4 text-slate-400" />}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                className="mb-0! min-w-0"
                label={translate('profile.address.form.phone')}
                rules={[
                  { required: true, message: translate('profile.address.form.required') },
                  {
                    pattern: /^0[0-9]{9,10}$/,
                    message: translate('profile.address.form.phoneInvalid'),
                  },
                ]}
              >
                <Input
                  size="large"
                  className={inputClassName}
                  prefix={<Phone className="size-4 text-slate-400" />}
                />
              </Form.Item>
            </div>

            <div className="space-y-6 border-t border-slate-100 pt-6">
              <Form.Item
                name="city"
                label={translate('profile.address.form.city')}
                rules={[{ required: true, message: translate('profile.address.form.required') }]}
              >
                <Select
                  size="large"
                  className={selectClassName}
                  placeholder={translate('profile.address.form.selectCity')}
                  options={cityOptions}
                  showSearch={selectSearchConfig}
                  onChange={() => {
                    form.setFieldsValue({ district: undefined, ward: undefined })
                  }}
                />
              </Form.Item>

              <div className="profile-form-grid grid w-full gap-x-4 gap-y-5">
                <Form.Item
                  name="district"
                  className="mb-0! min-w-0"
                  label={translate('profile.address.form.district')}
                  rules={[{ required: true, message: translate('profile.address.form.required') }]}
                >
                  <Select
                    size="large"
                    className={selectClassName}
                    placeholder={translate('profile.address.form.selectDistrict')}
                    options={districtOptions}
                    disabled={!selectedCity}
                    showSearch={selectSearchConfig}
                    onChange={() => {
                      form.setFieldValue('ward', undefined)
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="ward"
                  className="mb-0! min-w-0"
                  label={translate('profile.address.form.ward')}
                >
                  <Select
                    size="large"
                    className={selectClassName}
                    placeholder={translate('profile.address.form.selectWard')}
                    options={wardOptions}
                    disabled={!selectedDistrict}
                    showSearch={selectSearchConfig}
                    allowClear
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="line1"
                label={translate('profile.address.form.line1')}
                rules={[{ required: true, message: translate('profile.address.form.required') }]}
              >
                <Input
                  size="large"
                  className={inputClassName}
                  prefix={<MapPin className="size-4 text-slate-400" />}
                />
              </Form.Item>

              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3.5">
                <span className="text-sm font-semibold text-slate-700">
                  {translate('profile.address.form.setDefault')}
                </span>
                <Form.Item name="isDefault" valuePropName="checked" noStyle>
                  <Switch size="small" />
                </Form.Item>
              </label>
            </div>
          </div>

          <div className="flex shrink-0 gap-3 border-t border-slate-100 bg-white px-7 py-5">
            <Button variant="ghost" type="button" fullWidth onClick={onClose}>
              {translate('profile.address.form.cancel')}
            </Button>
            <Button type="submit" glow fullWidth loading={isPending}>
              {translate('profile.address.form.save')}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}
