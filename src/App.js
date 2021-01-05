import { useState } from 'react';

import { Button, Card, Divider, Input, Space, Typography } from "antd";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 16px 24px;
`;

const App = props => {
  const [newTask, setNewTask] = useState({});
  const [newSubTask, setNewSubTask] = useState({
    title: ''
  });
  const [todos, setTodos] = useState({
    "data": [
      {
        "name": "Cleaning",
        "isAllDone": false,
        "task": [
          {
            "title": "Washing clothes",
            "isDone": false
          },
          {
            "title": "Washing Dishes",
            "isDone": false
          }
        ]
      },
      {
        "name": "Workout",
        "isAllDone": false,
        "task": [
          {
            "title": "Running",
            "isDone": false
          }
        ]
      }
    ]
  });

  const taskInputHandler = event => {
    const newTask = {
      "name": event.target.value,
      "isAllDone": false,
      "task": []
    }
    setNewTask(newTask);
  };

  const onCreateTask = () => {
    const createTaskName = newTask
    const newTodos = { ...todos };
    newTodos.data = [...todos.data];
    newTodos.data.push(createTaskName);
    setTodos(newTodos);
  };

  const onDuplicate = id => {
    const newDup = { ...todos.data[id] };
    const curTodos = { ...todos };
    curTodos.data.push(newDup);
    setTodos(curTodos);
  };

  const subTaskInputHandler = event => {
    const data = { ...newSubTask.title, title: event.target.value };
    setNewSubTask(data);
  }

  const onTaskDone = (subTaskId, taskId) => {
    const task = { ...todos.data[taskId].task[subTaskId] };
    task.isDone = !task.isDone;
    const updatedTask = { ...todos };
    updatedTask.data[taskId].task[subTaskId] = task
    setTodos(updatedTask);

    checkAllTaskDone(taskId);
  }

  const onDeleteSubTask = (subTaskId, taskId) => {
    const task = [...todos.data[taskId].task];
    task.splice(subTaskId, 1);
    const updatedTask = { ...todos };
    updatedTask.data[taskId].task = task
    setTodos(updatedTask);

    checkAllTaskDone(taskId);
  }

  const checkAllTaskDone = (taskId) => {
    const allSubTasks = [...todos.data[taskId].task];
    // console.log(allSubTasks);
    let allDone = true;
    for (let subTask of allSubTasks) {
      if (subTask.isDone && allDone) {
        allDone = true;
      } else {
        allDone = false;
      };
    };

    const task = { ...todos };
    const updatedAllTaskDone = { ...task.data[taskId] };
    updatedAllTaskDone.isAllDone = allDone;
    console.log(updatedAllTaskDone);
    // task.data[taskId].isAllDone = 
    // setTodos()
  };

  let allTasks = todos.data.map((task, id) => {
    const taskId = id;
    let subTasks = null;
    if (task.task.length !== 0) {
      subTasks = task.task.map((subtask, id) => {
        if (!todos.data[taskId].task[id].isDone) {
          return (<Space key={subtask.title}>
            <Typography.Text key={subtask.title + Math.random()}>{subtask.title + ' (To Do)'}</Typography.Text>
            <Button type="primary" onClick={() => onTaskDone(id, taskId)}>Done</Button>
            <Button type="danger" onClick={() => onDeleteSubTask(id, taskId)}>Delete</Button>
          </Space>)
        } else {
          return (<Space key={subtask.title}>
            <Typography.Text style={{ textDecoration: "line-through" }}>
              {subtask.title + ' (Done)'}
            </Typography.Text>
            <Button type="primary" onClick={() => onTaskDone(id, taskId)}>Undone</Button>
            <Button type="danger" onClick={() => onDeleteSubTask(id, taskId)}>delete</Button>
          </Space >)
        };
      });
    }


    let styleAllDone = { width: 600 };
    if (task.isAllDone) styleAllDone = { width: 600, textDecoration: "line-through" };

    return (
      <Space direction="vertical" style={{ marginTop: 24 }} key={task.name + Math.random()}>
        <Card
          title={task.name}
          style={styleAllDone}
          extra={<Button type="primary"
            onClick={() => onDuplicate(id)}>Duplicate</Button>}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <Input placeholder="Enter Subtask Name" style={{ width: 400 }}
                onChange={(event) => subTaskInputHandler(event)} />
              <Button type="primary">Add Task</Button>
            </Space>
            <Divider />
            {subTasks}
          </Space>
        </Card>
      </Space>
    )

  });

  return (
    <Container>
      <Space>
        <Input style={{ width: 400 }} placeholder="Enter Task Name"
          onChange={(event) => taskInputHandler(event)} />
        <Button type="primary" onClick={onCreateTask}>Create Task</Button>

      </Space>
      {allTasks}

    </Container>
  );
}

export default App;
