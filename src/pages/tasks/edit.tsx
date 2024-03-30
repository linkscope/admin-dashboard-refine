import { TasksList } from '.'
import { DeleteButton, useModalForm } from '@refinedev/antd'
import { UPDATE_TASK_MUTATION } from '~/graphql/mutations'
import type { Task } from '~/graphql/schema.types'
import { Modal } from 'antd'
import { useNavigation } from '@refinedev/core'
import { useState } from 'react'
import { AlignLeftOutlined, FieldTimeOutlined, UsergroupAddOutlined } from '@ant-design/icons'

import TitleForm from './components/TitleForm'
import StageForm from './components/StageForm'
import Accordion from './components/Accordion'
import DescriptionForm, { DescriptionFallback } from './components/DescriptionForm'
import DueDateForm, { DueDateFallback } from './components/DueDateForm'
import UserForm, { UserFallback } from './components/UserForm'

const TasksEdit = () => {
  const { list } = useNavigation()
  const { modalProps, close, queryResult } = useModalForm<Task>({
    action: 'edit',
    defaultVisible: true,
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  })
  const [activeKey, setActiveKey] = useState<string | undefined>()
  const { description, dueDate, users, title } = queryResult?.data?.data ?? {}
  const isLoading = queryResult?.isLoading ?? true

  return (
    <TasksList>
      <Modal
        {...modalProps}
        onCancel={() => {
          close()
          list('tasks', 'replace')
        }}
        title={<TitleForm initialValues={{ title }} isLoading={isLoading} />}
        width={586}
        footer={
          <DeleteButton type="link" onSuccess={() => list('tasks', 'replace')}>
            删除任务
          </DeleteButton>
        }
      >
        <StageForm isLoading={isLoading} />
        <Accordion
          accordionKey="description"
          activeKey={activeKey}
          setActive={setActiveKey}
          icon={<AlignLeftOutlined />}
          isLoading={isLoading}
          label="描述"
          fallback={<DescriptionFallback description={description} />}
        >
          <DescriptionForm initialValues={{ description }} cancelForm={() => setActiveKey(undefined)} />
        </Accordion>
        <Accordion
          accordionKey="due-date"
          activeKey={activeKey}
          setActive={setActiveKey}
          icon={<FieldTimeOutlined />}
          isLoading={isLoading}
          label="截止日期"
          fallback={<DueDateFallback dueDate={dueDate} />}
        >
          <DueDateForm initialValues={{ dueDate: dueDate ?? undefined }} cancelForm={() => setActiveKey(undefined)} />
        </Accordion>
        <Accordion
          accordionKey="users"
          activeKey={activeKey}
          setActive={setActiveKey}
          icon={<UsergroupAddOutlined />}
          isLoading={isLoading}
          label="用户"
          fallback={<UserFallback users={users} />}
        >
          <UserForm
            initialValues={{
              userIds: users?.map((user) => ({
                label: user.name,
                value: user.id,
              })),
            }}
            cancelForm={() => setActiveKey(undefined)}
          />
        </Accordion>
      </Modal>
    </TasksList>
  )
}

export default TasksEdit
