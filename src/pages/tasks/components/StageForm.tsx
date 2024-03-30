import { memo } from 'react'
import { Checkbox, Form, Select, Skeleton, Space } from 'antd'
import { useForm, useSelect } from '@refinedev/antd'
import { UPDATE_TASK_MUTATION } from '~/graphql/mutations'
import { FlagOutlined } from '@ant-design/icons'
import { TASK_STAGES_SELECT_QUERY } from '~/graphql/queries'

const StageForm = memo(({ isLoading }: { isLoading: boolean }) => {
  const { formProps } = useForm({
    queryOptions: {
      enabled: false,
    },
    autoSave: {
      enabled: true,
      debounce: 0,
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  })

  const { selectProps } = useSelect({
    resource: 'taskStages',
    filters: [
      {
        field: 'title',
        operator: 'in',
        value: ['TODO', 'IN PROGRESS', 'IN PREVIEW', 'DONE'],
      },
    ],
    sorters: [
      {
        field: 'createdAt',
        order: 'asc',
      },
    ],
    meta: {
      gqlQuery: TASK_STAGES_SELECT_QUERY,
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 px-6 border-b border-b-solid border-b-gray-200">
        <Skeleton.Avatar size="small" shape="square" />
        <Skeleton.Input size="small" block className="h-6" />
      </div>
    )
  }

  return (
    <div className="py-3 px-6 border-b border-b-solid border-b-gray-200">
      <Form layout="inline" className="justify-between items-center" {...formProps}>
        <Space size={5}>
          <FlagOutlined />
          <Form.Item noStyle name={['stageId']} initialValue={formProps?.initialValues?.stage?.id}>
            <Select
              {...selectProps}
              popupMatchSelectWidth={false}
              options={selectProps.options?.concat([
                {
                  label: '未分配',
                  value: null,
                },
              ])}
              variant="borderless"
              showSearch={false}
              placeholder="选择任务状态"
              onSearch={undefined}
              size="small"
            />
          </Form.Item>
        </Space>
        <Form.Item noStyle name="complete" valuePropName="checked">
          <Checkbox>标记为已完成</Checkbox>
        </Form.Item>
      </Form>
    </div>
  )
})

export default StageForm
