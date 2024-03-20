import React from 'react'
import type { Contact, ContactStatus } from '~/graphql/schema.types'
import { TextField, useTable, FilterDropdown } from '@refinedev/antd'
import { Tag, Card, Space, Table, Avatar, Input, Select, Button } from 'antd'
import type { TagProps } from 'antd'
import {
	CheckCircleOutlined,
	MailOutlined,
	MinusCircleOutlined,
	PhoneOutlined,
	PlayCircleFilled,
	PlayCircleOutlined,
	SearchOutlined,
	TeamOutlined,
} from '@ant-design/icons'
import type { GetFieldsFromList } from '@refinedev/nestjs-query'
import type { CompanyContactsTableQuery } from '~/graphql/types'
import { useParams } from 'react-router-dom'
import { COMPANY_CONTACTS_TABLE_QUERY } from '~/graphql/queries'
import type { FilterDropdownProps } from 'antd/lib/table/interface'

const statusOptions: {
	label: string
	value: Contact['status']
}[] = [
	{ label: '新发起', value: 'NEW' },
	{ label: '符合条件', value: 'QUALIFIED' },
	{ label: '不符合条件', value: 'UNQUALIFIED' },
	{ label: '赢', value: 'WON' },
	{ label: '协商', value: 'NEGOTIATION' },
	{ label: '输', value: 'LOST' },
	{ label: '感兴趣', value: 'INTERESTED' },
	{ label: '已联络', value: 'CONTACTED' },
	{ label: '失败', value: 'CHURNED' },
]

const StatusTag = ({ status }: { status: ContactStatus }) => {
	let icon: React.ReactNode = null
	let color: TagProps['color']

	switch (status) {
		case 'NEW':
		case 'CONTACTED':
		case 'INTERESTED':
			icon = <PlayCircleOutlined />
			color = 'cyan'
			break
		case 'UNQUALIFIED':
			icon = <PlayCircleOutlined />
			color = 'red'
			break
		case 'QUALIFIED':
		case 'NEGOTIATION':
			icon = <PlayCircleFilled />
			color = 'green'
			break
		case 'LOST':
			icon = <PlayCircleFilled />
			color = 'red'
			break
		case 'WON':
			icon = <CheckCircleOutlined />
			color = 'green'
			break
		case 'CHURNED':
			icon = <MinusCircleOutlined />
			color = 'red'
			break
	}

	return (
		<Tag color={color} className="capitalize">
			{icon} {statusOptions.find((item) => item.value === status)?.label}
		</Tag>
	)
}

const renderFilterDown = (type: string, placeholder: string, props: FilterDropdownProps) => {
	return (
		<FilterDropdown {...props}>
			{type === 'input' ? (
				<Input placeholder={placeholder} />
			) : (
				<Select className="w-50" mode="multiple" placeholder="选择阶段" options={statusOptions} />
			)}
		</FilterDropdown>
	)
}

const ContactTable = () => {
	const params = useParams()
	const { tableProps } = useTable<GetFieldsFromList<CompanyContactsTableQuery>>({
		resource: 'contacts',
		syncWithLocation: false,
		sorters: {
			initial: [{ field: 'createdAt', order: 'desc' }],
		},
		filters: {
			initial: [
				{
					field: 'jobTitle',
					value: '',
					operator: 'contains',
				},
				{
					field: 'name',
					value: '',
					operator: 'contains',
				},
				{
					field: 'status',
					value: undefined,
					operator: 'in',
				},
			],
			permanent: [
				{
					field: 'company.id',
					operator: 'eq',
					value: params?.id,
				},
			],
		},
		meta: {
			gqlQuery: COMPANY_CONTACTS_TABLE_QUERY,
		},
	})

	return (
		<Card
			styles={{ header: { borderBottom: '1px solid #D9D9D9', marginBottom: '1px' }, body: { padding: 0 } }}
			title={
				<Space size="middle">
					<TeamOutlined />
					<TextField value="联络人" />
				</Space>
			}
			extra={
				<>
					<TextField value="总数量：" />
					<TextField strong value={tableProps?.pagination !== false && tableProps.pagination?.total} />
				</>
			}
		>
			<Table {...tableProps} rowKey="id" pagination={{ ...tableProps.pagination, showSizeChanger: false }}>
				<Table.Column<Contact>
					title="姓名"
					dataIndex="name"
					render={(_, record) => (
						<Space>
							<Avatar src={record.avatarUrl}>{record.name}</Avatar>
							<TextField className="whitespace-nowrap" value={record.name} />
						</Space>
					)}
					filterIcon={<SearchOutlined />}
					filterDropdown={(props) => renderFilterDown('input', '搜索姓名', props)}
				/>
				<Table.Column
					title="职位"
					dataIndex="jobTitle"
					filterIcon={<SearchOutlined />}
					filterDropdown={(props) => renderFilterDown('input', '搜索职位', props)}
				/>
				<Table.Column<Contact>
					title="阶段"
					render={(_, record) => <StatusTag status={record.status} />}
					filterDropdown={(props) => renderFilterDown('select', '选择阶段', props)}
				/>
				<Table.Column<Contact>
					dataIndex="id"
					width={112}
					render={(_, record) => (
						<Space>
							<Button size="small" href={`mailto:${record.email}`} icon={<MailOutlined />} />
							<Button size="small" href={`tel:${record.phone}`} icon={<PhoneOutlined />} />
						</Space>
					)}
				/>
			</Table>
		</Card>
	)
}

export default ContactTable
