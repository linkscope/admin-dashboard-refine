import { CreateButton, DeleteButton, EditButton, FilterDropdown, List, TextField, useTable } from '@refinedev/antd'
import { getDefaultFilter, useGo } from '@refinedev/core'
import { useMemo } from 'react'
import { COMPANIES_LIST_QUERY } from '~/graphql/queries'
import { Table, Input, Space, Avatar } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { FilterDropdownProps } from 'antd/lib/table/interface'
import type { Company } from '~/graphql/schema.types'

const renderFilterDropdown = (props: FilterDropdownProps) => {
	return (
		<FilterDropdown {...props}>
			<Input placeholder="搜索公司" />
		</FilterDropdown>
	)
}

const CompaniesList = () => {
	const go = useGo()
	const { tableProps, filters } = useTable({
		resource: 'companies',
		onSearch: (values: Company) => {
			return [
				{
					field: 'name',
					operator: 'contains',
					value: values.name,
				},
			]
		},
		pagination: { pageSize: 12 },
		sorters: {
			initial: [
				{
					field: 'createdAt',
					order: 'desc',
				},
			],
		},
		filters: {
			initial: [
				{
					field: 'name',
					operator: 'contains',
					value: undefined,
				},
			],
		},
		meta: {
			gqlQuery: COMPANIES_LIST_QUERY,
		},
	})

	const headerButtons = useMemo(
		() => (
			<CreateButton
				onClick={() =>
					go({
						to: {
							resource: 'companies',
							action: 'create',
						},
						options: {
							keepQuery: true,
						},
						type: 'replace',
					})
				}
			/>
		),
		[],
	)

	return (
		<List headerButtons={headerButtons}>
			<Table {...tableProps} pagination={{ ...tableProps.pagination }} rowKey="id">
				<Table.Column<Company>
					dataIndex="name"
					title="公司名称"
					defaultFilteredValue={getDefaultFilter('id', filters)}
					filterIcon={<SearchOutlined />}
					filterDropdown={renderFilterDropdown}
					render={(_, record) => (
						<Space>
							<Avatar shape="square" src={record.avatarUrl}>
								{record.name}
							</Avatar>
							<TextField value={record.name} />
						</Space>
					)}
				/>
				<Table.Column<Company>
					dataIndex="totalRevenue"
					title="总收入"
					render={(_, record) => (
						<TextField
							value={Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'USD' }).format(
								record?.dealsAggregate?.[0]?.sum?.value || 0,
							)}
						/>
					)}
				/>
				<Table.Column<Company>
					dataIndex="id"
					title="操作"
					fixed="right"
					render={(value) => (
						<Space>
							<EditButton size="small" recordItemId={value} />
							<DeleteButton size="small" recordItemId={value} />
						</Space>
					)}
				/>
			</Table>
		</List>
	)
}

export default CompaniesList
