import { memo, useEffect } from 'react'
import { Form, Skeleton } from 'antd'
import { TextField, useForm } from '@refinedev/antd'
import { useInvalidate } from '@refinedev/core'
import { UPDATE_TASK_MUTATION } from '~/graphql/mutations'
import type { Task } from '~/graphql/schema.types'

interface Props {
  initialValues: {
    title?: Task['title']
  }
  isLoading?: boolean
}

const TitleInput = ({ value, onChange }: { value?: string; onChange?: (value: string) => void }) => {
  return <TextField editable={{ onChange: (title) => onChange?.(title) }} value={value} />
}

const TitleForm = memo(({ initialValues, isLoading }: Props) => {
  const invalidate = useInvalidate()
  const { formProps } = useForm({
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    warnWhenUnsavedChanges: false,
    autoSave: {
      enabled: true,
    },
    onMutationSuccess: () => {
      invalidate({
        invalidates: ['list'],
        resource: 'tasks',
      })
    },
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  })

  useEffect(() => {
    formProps.form?.setFieldsValue(initialValues)
  }, [initialValues.title])

  if (isLoading) {
    return <Skeleton.Input size="small" className="w-[95%] h-6" block />
  }

  return (
    <Form {...formProps} initialValues={initialValues}>
      <Form.Item noStyle name="title">
        <TitleInput />
      </Form.Item>
    </Form>
  )
})

export default TitleForm
