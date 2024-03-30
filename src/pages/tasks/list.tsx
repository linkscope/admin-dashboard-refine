import KanbanBoard from './components/KanbanBoard'
import KanbanColumn, { KanbanColumnSkeleton } from './components/KanbanColumn'
import KanbanItem from './components/KanbanItem'
import ProjectCard, { ProjectCardSkeleton } from './components/ProjectCard'
import KanbanAddCardBtn from './components/KanbanAddCardBtn'

import { useList } from '@refinedev/core'
import { TASK_STAGES_QUERY, TASKS_QUERY } from '~/graphql/queries'
import { useMemo } from 'react'
import type { TaskStage } from '~/graphql/schema.types'
import type { GetFieldsFromList } from '@refinedev/nestjs-query'
import type { TasksQuery } from '~/graphql/types'

const TasksSkeleton = () => {
  return (
    <div
      className="-m-8"
      style={{
        width: 'calc(100% + 4rem)',
        height: 'calc(100vh - 64px)',
      }}
    >
      <div className="w-full h-full flex p-8 overflow-scroll">
        {Array.from({ length: 6 }).map((_, index) => (
          <KanbanColumnSkeleton key={index}>
            {Array.from({ length: 4 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </KanbanColumnSkeleton>
        ))}
      </div>
    </div>
  )
}

const TasksList = () => {
  const { data: stages, isLoading: isStagesLoading } = useList<TaskStage>({
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
      gqlQuery: TASK_STAGES_QUERY,
    },
  })
  const { data: tasks, isLoading: isTasksLoading } = useList<GetFieldsFromList<TasksQuery>>({
    resource: 'tasks',
    sorters: [
      {
        field: 'dueDate',
        order: 'asc',
      },
    ],
    pagination: {
      mode: 'off',
    },
    queryOptions: {
      enabled: !!stages,
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  })

  const taskStage = useMemo(() => {
    if (!tasks?.data || !stages?.data) {
      return {
        unsignedStage: [],
        stages: [],
      }
    }

    const unsignedStage = tasks.data.filter((task) => task.stageId === null)
    // @ts-ignore
    const grouped: TaskStage[] = stages.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => task.stageId?.toString() === stage.id),
    }))

    return {
      unsignedStage,
      columns: grouped,
    }
  }, [stages, tasks])

  const handleAddCard = (stageId: string) => {}

  if (isStagesLoading || isTasksLoading) return <TasksSkeleton />

  return (
    <div
      className="-m-8"
      style={{
        width: 'calc(100% + 4rem)',
        height: 'calc(100vh - 64px)',
      }}
    >
      <div className="w-full h-full flex p-8 overflow-scroll">
        <KanbanBoard>
          <KanbanColumn
            id="unsigned"
            title="未分配"
            count={taskStage.unsignedStage.length || 0}
            description="描述"
            onAddClick={() => handleAddCard('unsigned')}
          >
            {taskStage.unsignedStage.map((task) => (
              <KanbanItem key={task.id} id={task.id} data={{ ...task, stageId: 'unsigned' }}>
                <ProjectCard {...task} dueDate={task.dueDate || undefined} />
              </KanbanItem>
            ))}

            {!taskStage.unsignedStage.length && <KanbanAddCardBtn onClick={() => handleAddCard('unsigned')} />}
          </KanbanColumn>

          {taskStage.columns?.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              count={column.tasks.length}
              id={column.id}
              onAddClick={() => handleAddCard(column.id)}
            >
              {column.tasks.map((task) => (
                <KanbanItem key={task.id} id={task.id} data={task}>
                  <ProjectCard {...task} dueDate={task.dueDate || undefined} />
                </KanbanItem>
              ))}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </div>
    </div>
  )
}

export default TasksList
