import { Edit, useForm, useSelect, TextField } from '@refinedev/antd'
import { Row, Col, Form, Avatar, Input, Select, InputNumber } from 'antd'
import { UPDATE_COMPANY_MUTATION } from '~/graphql/mutations'
import { USERS_SELECT_QUERY } from '~/graphql/queries'
import type { GetFieldsFromList } from '@refinedev/nestjs-query'
import type { UsersSelectQuery } from '~/graphql/types'
import type { CompanySize, Industry, BusinessType } from '~/graphql/schema.types'

import ContactTable from './components/ContactTable'

const companySizeOptions: {
  label: string
  value: CompanySize
}[] = [
  { label: '企业级', value: 'ENTERPRISE' },
  { label: '大型', value: 'LARGE' },
  { label: '中型', value: 'MEDIUM' },
  { label: '小规模', value: 'SMALL' },
]

const industryOptions: {
  label: string
  value: Industry
}[] = [
  { label: '航空航天业', value: 'AEROSPACE' },
  { label: '农业', value: 'AGRICULTURE' },
  { label: '汽车业', value: 'AUTOMOTIVE' },
  { label: '化工业', value: 'CHEMICALS' },
  { label: '建筑业', value: 'CONSTRUCTION' },
  { label: '国防', value: 'DEFENSE' },
  { label: '教育业', value: 'EDUCATION' },
  { label: '能源业', value: 'ENERGY' },
  { label: '金融服务业', value: 'FINANCIAL_SERVICES' },
  { label: '餐饮业', value: 'FOOD_AND_BEVERAGE' },
  { label: '政府', value: 'GOVERNMENT' },
  { label: '医疗卫生', value: 'HEALTHCARE' },
  { label: '接待服务', value: 'HOSPITALITY' },
  { label: '工业制造业', value: 'INDUSTRIAL_MANUFACTURING' },
  { label: '保险业', value: 'INSURANCE' },
  { label: '生命科学', value: 'LIFE_SCIENCES' },
  { label: '物流', value: 'LOGISTICS' },
  { label: '媒体业', value: 'MEDIA' },
  { label: '矿业', value: 'MINING' },
  { label: '非营利组织', value: 'NONPROFIT' },
  { label: '其他', value: 'OTHER' },
  { label: '制药业', value: 'PHARMACEUTICALS' },
  { label: '专业人员服务', value: 'PROFESSIONAL_SERVICES' },
  { label: '房地产', value: 'REAL_ESTATE' },
  { label: '零售业', value: 'RETAIL' },
  { label: '科技', value: 'TECHNOLOGY' },
  { label: '通讯', value: 'TELECOMMUNICATIONS' },
  { label: '交通运输', value: 'TRANSPORTATION' },
  { label: '公共设施', value: 'UTILITIES' },
]

const businessTypeOptions: {
  label: string
  value: BusinessType
}[] = [
  { label: 'B2B', value: 'B2B' },
  { label: 'B2C', value: 'B2C' },
  { label: 'B2G', value: 'B2G' },
]

const CompaniesEdit = () => {
  const { formProps, saveButtonProps, formLoading, queryResult } = useForm({
    redirect: 'list',
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  })

  const { selectProps, queryResult: users } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: 'users',
    optionLabel: 'name',
    pagination: {
      mode: 'off',
    },
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  })

  return (
    <Row gutter={[32, 32]}>
      <Col xs={24} xl={12}>
        <Edit isLoading={formLoading} saveButtonProps={saveButtonProps} breadcrumb={false}>
          <Form {...formProps} layout="vertical">
            <Avatar shape="square" src={queryResult?.data?.data.avatarUrl} className="w-24 h-24 mb-6">
              {queryResult?.data?.data.name}
            </Avatar>
            <Form.Item label="公司名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入公司名称" />
            </Form.Item>
            <Form.Item
              label="供应商"
              name="salesOwnerId"
              rules={[{ required: true }]}
              initialValue={formProps?.initialValues?.salesOwner?.id}
            >
              <Select
                {...selectProps}
                placeholder="请选择供应商"
                options={
                  users.data?.data.map((user) => ({
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
            <Form.Item name="companySize">
              <Select options={companySizeOptions} />
            </Form.Item>
            <Form.Item name="totalRevenue">
              <InputNumber autoFocus addonBefore="$" min={0} placeholder="0,00" />
            </Form.Item>
            <Form.Item label="行业" name="industry">
              <Select options={industryOptions} />
            </Form.Item>
            <Form.Item label="商业类型" name="businessType">
              <Select options={businessTypeOptions} />
            </Form.Item>
            <Form.Item label="国家" name="country">
              <Input placeholder="国家" />
            </Form.Item>
            <Form.Item label="网站" name="website">
              <Input placeholder="网站" />
            </Form.Item>
          </Form>
        </Edit>
      </Col>
      <Col xs={24} xl={12}>
        <ContactTable />
      </Col>
    </Row>
  )
}

export default CompaniesEdit
