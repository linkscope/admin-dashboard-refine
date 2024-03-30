import { memo } from 'react'
import { Button, DatePicker, Form, Space, Tag, Typography } from 'antd'
import { TextField, useForm } from '@refinedev/antd'
import type { Task } from '~/graphql/schema.types'
import { UPDATE_TASK_MUTATION } from '~/graphql/mutations'
import dayjs from 'dayjs'
import getDateColor from '~/utilities/getDateColor'

interface Props {
  initialValues: {
    dueDate?: Task['dueDate']
  }
  cancelForm: () => void
}

export const DueDateFallback = memo(({ dueDate }: { dueDate?: Task['dueDate'] }) => {
  if (dueDate) {
    const color = getDateColor(dueDate, 'processing')
    const getTagText = () => {
      switch (color) {
        case 'error':
          return '超过截止日期'
        case 'warning':
          return '即将到截止日期'
        default:
          return '进行中'
      }
    }

    return (
      <Space size={[0, 8]}>
        <Tag color={color}>{getTagText()}</Tag>
        <TextField value={dayjs(dueDate).format('MMMM D, YYYY - h:ma')} />
      </Space>
    )
  }

  return <Typography.Link>添加截止日期</Typography.Link>
})

const DueDateForm = memo(({ initialValues, cancelForm }: Props) => {
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
    <div className="flex items-center justify-between">
      <Form {...formProps} initialValues={initialValues}>
        <Form.Item
          noStyle
          name="dueDate"
          getValueProps={(value) => {
            if (!value) {
              return { value: undefined }
            }
            return { value: dayjs(value) }
          }}
        >
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{
              format: 'HH:mm',
            }}
            className="bg-white"
          />
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

export default DueDateForm
