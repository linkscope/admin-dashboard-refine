import { ShopOutlined, TeamOutlined, AuditOutlined } from '@ant-design/icons'
import type { Props } from '.'

const IconWrapper = ({ children, color }: React.PropsWithChildren<{ color: string }>) => {
  return (
    <div className="flex items-center justify-center h-8 w-8 rounded-full" style={{ backgroundColor: color }}>
      {children}
    </div>
  )
}

export const variants: {
  [key in Props['resource']]: {
    primaryColor: string
    secondaryColor?: string
    icon: React.ReactNode
    title: string
    data: { index: string; value: number }[]
  }
} = {
  companies: {
    primaryColor: '#1677FF',
    secondaryColor: '#BAE0FF',
    icon: (
      <IconWrapper color="#E6F4FF">
        <ShopOutlined
          style={{
            color: '#1677FF',
            fontSize: '1rem',
          }}
        />
      </IconWrapper>
    ),
    title: '公司数量',
    data: [
      {
        index: '1',
        value: 3500,
      },
      {
        index: '2',
        value: 2750,
      },
      {
        index: '3',
        value: 5000,
      },
      {
        index: '4',
        value: 4250,
      },
      {
        index: '5',
        value: 5000,
      },
    ],
  },
  contacts: {
    primaryColor: '#52C41A',
    secondaryColor: '#D9F7BE',
    icon: (
      <IconWrapper color="#F6FFED">
        <TeamOutlined
          style={{
            color: '#52C41A',
            fontSize: '1rem',
          }}
        />
      </IconWrapper>
    ),
    title: '沟通数量',
    data: [
      {
        index: '1',
        value: 10000,
      },
      {
        index: '2',
        value: 19500,
      },
      {
        index: '3',
        value: 13000,
      },
      {
        index: '4',
        value: 17000,
      },
      {
        index: '5',
        value: 13000,
      },
      {
        index: '6',
        value: 20000,
      },
    ],
  },
  deals: {
    primaryColor: '#FA541C',
    secondaryColor: '#FFD8BF',
    icon: (
      <IconWrapper color="#FFF2E8">
        <AuditOutlined
          style={{
            color: '#FA541C',
            fontSize: '1rem',
          }}
        />
      </IconWrapper>
    ),
    title: '交易总数',
    data: [
      {
        index: '1',
        value: 1000,
      },
      {
        index: '2',
        value: 1300,
      },
      {
        index: '3',
        value: 1200,
      },
      {
        index: '4',
        value: 2000,
      },
      {
        index: '5',
        value: 800,
      },
      {
        index: '6',
        value: 1700,
      },
      {
        index: '7',
        value: 1400,
      },
      {
        index: '8',
        value: 1800,
      },
    ],
  },
}
