import { memo } from 'react'
import { Button, Form, Space, Typography } from 'antd'
import { MarkdownField, useForm } from '@refinedev/antd'
import type { Task } from '~/graphql/schema.types'
import { UPDATE_TASK_MUTATION } from '~/graphql/mutations'

import MDEditor from '@uiw/react-md-editor'

interface Props {
  initialValues: {
    description?: Task['description']
  }
  cancelForm: () => void
}

export const DescriptionFallback = memo(({ description }: { description?: Task['description'] }) => {
  if (description) {
    return (
      <Typography.Paragraph ellipsis={{ rows: 8 }}>
        <MarkdownField value={description} />
      </Typography.Paragraph>
    )
  }

  return <Typography.Link>添加描述</Typography.Link>
})

const DescriptionForm = memo(({ initialValues, cancelForm }: Props) => {
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

  return (
    <>
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item noStyle name="description">
          <MDEditor preview="edit" data-color-mode="light" height={250} />
        </Form.Item>
      </Form>
      <div className="flex items-center justify-end mt-3">
        <Space>
          <Button type="default" onClick={cancelForm}>
            取消
          </Button>
          <Button {...saveButtonProps} type="primary">
            保存
          </Button>
        </Space>
      </div>
    </>
  )
})

export default DescriptionForm
