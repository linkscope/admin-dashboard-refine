import { TasksList } from '.'
import { Form, Input, Modal } from 'antd'
import { useModalForm } from '@refinedev/antd'
import { CREATE_TASK_MUTATION } from '~/graphql/mutations'
import { useNavigation } from '@refinedev/core'
import { useSearchParams } from 'react-router-dom'

const TasksCreate = () => {
  const [searchParams] = useSearchParams()
  const { list } = useNavigation()
  const { formProps, modalProps, close } = useModalForm({
    action: 'create',
    defaultVisible: true,
    meta: {
      gqlMutation: CREATE_TASK_MUTATION,
    },
  })

  return (
    <TasksList>
      <Modal
        {...modalProps}
        onCancel={() => {
          close()
          list('tasks', 'replace')
        }}
        title="创建新任务"
        width={512}
      >
        <Form
          {...formProps}
          layout="vertical"
          onFinish={(values) => {
            formProps?.onFinish?.({
              ...values,
              stageId: searchParams.get('stageId') ? Number(searchParams.get('stageId')) : null,
              userIds: [],
            })
          }}
        >
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
        </Form>
      </Modal>
    </TasksList>
  )
}

export default TasksCreate
