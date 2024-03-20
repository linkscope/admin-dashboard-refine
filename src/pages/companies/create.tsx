import { TextField, useModalForm, useSelect } from '@refinedev/antd'
import { CompaniesList } from '~/pages'
import { Avatar, Form, Input, Modal, Select } from 'antd'
import { useGo } from '@refinedev/core'
import { CREATE_COMPANY_MUTATION } from '~/graphql/mutations'
import { useCallback } from 'react'
import { USERS_SELECT_QUERY } from '~/graphql/queries'
import type { GetFieldsFromList } from '@refinedev/nestjs-query'
import type { UsersSelectQuery } from '~/graphql/types'

const CompaniesCreate = () => {
	const go = useGo()

	const goToListPage = useCallback(() => {
		go({
			to: { resource: 'companies', action: 'list' },
			options: { keepQuery: true },
			type: 'replace',
		})
	}, [go])

	const { formProps, modalProps } = useModalForm({
		action: 'create',
		defaultVisible: true,
		resource: 'companies',
		redirect: false,
		mutationMode: 'pessimistic',
		onMutationSuccess: goToListPage,
		meta: {
			gqlQuery: CREATE_COMPANY_MUTATION,
		},
	})

	const { selectProps, queryResult } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
		resource: 'users',
		optionLabel: 'name',
		meta: {
			gqlQuery: USERS_SELECT_QUERY,
		},
	})

	return (
		<CompaniesList>
			<Modal {...modalProps} mask={true} onCancel={goToListPage} title="创建公司" width={512}>
				<Form {...formProps} layout="vertical">
					<Form.Item label="公司名称" name="name" rules={[{ required: true }]}>
						<Input placeholder="请输入公司名称" />
					</Form.Item>
					<Form.Item label="供应商" name="salesOwnerId" rules={[{ required: true }]}>
						<Select
							{...selectProps}
							placeholder="请选择供应商"
							options={
								queryResult.data?.data.map((user) => ({
									value: user.id,
									label: (
										<div className="flex items-center gap-2">
											<Avatar shape="circle" src={user.avatarUrl ?? undefined}>
												{user.name}
											</Avatar>
											<TextField value={user.name} />
										</div>
									),
								})) ?? []
							}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</CompaniesList>
	)
}

export default CompaniesCreate
