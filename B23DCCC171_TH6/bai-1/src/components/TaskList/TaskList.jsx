import { Card, Empty } from 'antd';
import { useTasks } from '../../contexts/TaskContext';
import TaskItem from '../TaskItem';
import './TaskList.css';

// Import from @hello-pangea/dnd instead of react-beautiful-dnd
// NOTE: You'll need to install this package: npm install @hello-pangea/dnd
// or: yarn add @hello-pangea/dnd
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function TaskList({ tasks = [], currentUser = '', onEditTask = () => {} }) {
  const { reorderTasks } = useTasks();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderTasks(items);
  };

  return (
    <Card title="Danh sách công việc" className="task-list-card">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks" type="TASK">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="task-list"
              style={{ minHeight: 100 }}
            >
              {tasks && tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <Draggable
                    key={String(task.id)}
                    draggableId={String(task.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="task-item-container"
                      >
                        <TaskItem
                          task={task}
                          isCurrentUserTask={task.assignee === currentUser}
                          onEdit={() => onEditTask(task)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <div style={{ padding: '16px 0' }}>
                  <Empty
                    description="Không có công việc nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Card>
  );
}

export default TaskList;