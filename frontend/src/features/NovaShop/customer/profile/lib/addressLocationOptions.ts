export type AddressLocationOption = {
  value: string
  label: string
}

type AddressDistrictNode = {
  name: string
  wards: readonly string[]
}

type AddressCityNode = {
  city: string
  districts: readonly AddressDistrictNode[]
}

const ADDRESS_LOCATION_TREE: readonly AddressCityNode[] = [
  {
    city: 'TP. Hồ Chí Minh',
    districts: [
      {
        name: 'Quận 1',
        wards: [
          'Phường Bến Nghé',
          'Phường Bến Thành',
          'Phường Cầu Kho',
          'Phường Cầu Ông Lãnh',
          'Phường Đa Kao',
          'Phường Nguyễn Cư Trinh',
          'Phường Nguyễn Thái Bình',
          'Phường Phạm Ngũ Lão',
          'Phường Tân Định',
        ],
      },
      {
        name: 'Quận 3',
        wards: [
          'Phường 1',
          'Phường 2',
          'Phường 3',
          'Phường 4',
          'Phường 5',
          'Phường 6',
          'Phường 7',
          'Phường 8',
          'Phường 9',
          'Phường 10',
          'Phường 11',
          'Phường 12',
          'Phường 13',
          'Phường 14',
        ],
      },
      {
        name: 'Quận 7',
        wards: [
          'Phường Bình Thuận',
          'Phường Phú Mỹ',
          'Phường Phú Thuận',
          'Phường Tân Hưng',
          'Phường Tân Phong',
          'Phường Tân Phú',
          'Phường Tân Quy',
          'Phường Tân Thuận Đông',
          'Phường Tân Thuận Tây',
        ],
      },
    ],
  },
  {
    city: 'Hà Nội',
    districts: [
      {
        name: 'Quận Ba Đình',
        wards: [
          'Phường Cống Vị',
          'Phường Điện Biên',
          'Phường Đội Cấn',
          'Phường Giảng Võ',
          'Phường Kim Mã',
          'Phường Liễu Giai',
          'Phường Ngọc Hà',
          'Phường Ngọc Khánh',
          'Phường Phúc Xá',
          'Phường Quán Thánh',
          'Phường Trúc Bạch',
        ],
      },
      {
        name: 'Quận Hoàn Kiếm',
        wards: [
          'Phường Cửa Đông',
          'Phường Cửa Nam',
          'Phường Hàng Bạc',
          'Phường Hàng Bài',
          'Phường Hàng Bồ',
          'Phường Hàng Buồm',
          'Phường Hàng Đào',
          'Phường Hàng Gai',
          'Phường Lý Thái Tổ',
          'Phường Phan Chu Trinh',
          'Phường Tràng Tiền',
        ],
      },
    ],
  },
  {
    city: 'Đà Nẵng',
    districts: [
      {
        name: 'Quận Hải Châu',
        wards: [
          'Phường Bình Hiên',
          'Phường Bình Thuận',
          'Phường Hải Châu I',
          'Phường Hải Châu II',
          'Phường Hòa Cường Bắc',
          'Phường Hòa Cường Nam',
          'Phường Nam Dương',
          'Phường Phước Ninh',
          'Phường Thạch Thang',
          'Phường Thanh Bình',
        ],
      },
    ],
  },
]

function toOption(value: string): AddressLocationOption {
  return { value, label: value }
}

function withCurrentOption(
  options: AddressLocationOption[],
  currentValue?: string | null,
): AddressLocationOption[] {
  if (!currentValue || options.some((option) => option.value === currentValue)) {
    return options
  }

  return [toOption(currentValue), ...options]
}

export function getCityOptions(): AddressLocationOption[] {
  return ADDRESS_LOCATION_TREE.map((node) => toOption(node.city))
}

export function getDistrictOptions(city?: string | null): AddressLocationOption[] {
  if (!city) {
    return []
  }

  const cityNode = ADDRESS_LOCATION_TREE.find((node) => node.city === city)
  return cityNode?.districts.map((district) => toOption(district.name)) ?? []
}

export function getWardOptions(
  city?: string | null,
  district?: string | null,
): AddressLocationOption[] {
  if (!city || !district) {
    return []
  }

  const cityNode = ADDRESS_LOCATION_TREE.find((node) => node.city === city)
  const districtNode = cityNode?.districts.find((node) => node.name === district)
  return districtNode?.wards.map((ward) => toOption(ward)) ?? []
}

export function buildDistrictSelectOptions(
  city?: string | null,
  currentDistrict?: string | null,
): AddressLocationOption[] {
  return withCurrentOption(getDistrictOptions(city), currentDistrict)
}

export function buildWardSelectOptions(
  city?: string | null,
  district?: string | null,
  currentWard?: string | null,
): AddressLocationOption[] {
  return withCurrentOption(getWardOptions(city, district), currentWard)
}
