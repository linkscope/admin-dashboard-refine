import { memo } from 'react'
import { useForm, useSelect } from '@refinedev/antd'
import { UPDATE_TASK_MUTATION } from '~/graphql/mutations'
import { Avatar, Button, Form, Select, Space, Tag, Typography } from 'antd'
import { USERS_SELECT_QUERY } from '~/graphql/queries'
import type { Task } from '~/graphql/schema.types'

interface Props {
  initialValues: {
    userIds?: {
      label: string
      value: string
    }[]
  }
  cancelForm: () => void
}

export const UserFallback = ({ users = [] }: { users?: Task['users'] }) => {
  if (users.length > 0) {
    return (
      <Space size={[0, 0]} wrap>
        {users.map((user) => (
          <Tag key={user.id} className="p-1 pr-2 rounded-6 leading-unset mr-unset">
            <Space size={4}>
              <Avatar className="inline-flex" src={user.avatarUrl}>
                {user.name}
              </Avatar>
            </Space>
          </Tag>
        ))}
      </Space>
    )
  }

  return <Typography.Link>添加人员</Typography.Link>
}

const UserForm = memo(({ initialValues, cancelForm }: Props) => {
  const { formProps, saveButtonProps } = useForm({
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    onMutationSuccess: () => {
      cancelForm()
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  })

  const { selectProps } = useSelect({
    resource: 'users',
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
    optionLabel: 'name',
  })

  return (
    <div className="flex items-end justify-between gap-3">
      <Form {...formProps} className="w-full" initialValues={initialValues}>
        <Form.Item noStyle name="userIds">
          <Select {...selectProps} dropdownStyle={{ padding: 0 }} className="w-full" mode="multiple" />
        </Form.Item>
      </Form>
      <Space>
        <Button type="default" onClick={cancelForm}>
          取消
        </Button>
        <Button {...saveButtonProps} type="primary">
          保存
        </Button>
      </Space>
    </div>
  )
})

export default UserForm
