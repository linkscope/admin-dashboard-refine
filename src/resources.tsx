import type { IResourceItem } from '@refinedev/core'
import { DashboardOutlined, ShopOutlined, ProjectOutlined } from '@ant-design/icons'

const resources: IResourceItem[] = [
	{
		name: 'dashboard',
		list: '/',
		meta: {
			label: '仪表盘',
			icon: <DashboardOutlined />,
		},
	},
	{
		name: 'companies',
		list: '/companies',
		show: '/companies/:id',
		create: '/companies/create',
		edit: '/companies/edit/:id',
		meta: {
			label: '公司',
			icon: <ShopOutlined />,
		},
	},
	{
		name: 'tasks',
		list: '/tasks',
		create: '/tasks/create',
		edit: '/tasks/edit/:id',
		meta: {
			label: '任务',
			icon: <ProjectOutlined />,
		},
	},
]

export default resources
