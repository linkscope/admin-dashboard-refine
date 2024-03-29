import { memo, useMemo, useCallback } from 'react'
import { Drawer, Button, Card, Form, Avatar, Input } from 'antd'
import { TextField, useForm, SaveButton } from '@refinedev/antd'
import { CloseOutlined } from '@ant-design/icons'

import { UPDATE_USER_MUTATION } from '~/graphql/mutations'

interface Props {
  opened: boolean
  setOpened: (opened: boolean) => void
  userId: string
}

const AccountSettings = memo(({ opened, setOpened, userId }: Props) => {
  const { saveButtonProps, formProps, queryResult } = useForm({
    resource: 'users',
    action: 'edit',
    mutationMode: 'optimistic',
    id: userId,
    meta: {
      gqlMutation: UPDATE_USER_MUTATION,
    },
  })
  const { avatarUrl, name } = useMemo(() => queryResult?.data?.data || {}, [queryResult?.data?.data])

  const saveAccountInfo = useCallback(async () => {
    await saveButtonProps.onClick()
    setOpened(false)
  }, [saveButtonProps])

  return (
    <Drawer open={opened} width={756} styles={{ header: { display: 'none' } }}>
      <div className="flex items-center justify-between mb-4">
        <TextField strong value="账户设置" />
        <Button type="text" icon={<CloseOutlined />} onClick={() => setOpened(false)} />
      </div>
      <Card>
        <Form {...formProps} layout="vertical">
          <Avatar shape="square" src={avatarUrl} alt={name} className="w-24 h-24 mb-6">
            {name}
          </Avatar>
          <Form.Item label="姓名" name="name">
            <Input placeholder="姓名" />
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item label="职位" name="jobTitle">
            <Input placeholder="职位" />
          </Form.Item>
          <Form.Item label="电话" name="phone">
            <Input placeholder="电话" />
          </Form.Item>
        </Form>
        <SaveButton {...saveButtonProps} className="block ml-auto" onClick={saveAccountInfo} />
      </Card>
    </Drawer>
  )
})

export default AccountSettings
