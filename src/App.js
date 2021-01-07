import { useState } from 'react';

import { Button, Card, Divider, Input, Space, Typography } from "antd";
import styled from "styled-components";

const Container = styled.div` 
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100vw;
  padding: 16px 24px;
`;

const App = props => {
  const [newTask, setNewTask] = useState({});
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
    const createTaskName = newTask;
    const curTodos = { ...todos };
    curTodos.data = [...todos.data];
    curTodos.data.push(createTaskName);
    const newTaskId = curTodos.data.length-1;
    curTodos.data[newTaskId].isAllDone = checkAllTaskDone(newTaskId, curTodos);
    setTodos(curTodos);
  };

  const onDuplicate = id => {
    const newDup = { ...todos.data[id] };
    const curTodos = { ...todos };
    curTodos.data = [...todos.data];
    curTodos.data.push(newDup);
    setTodos(curTodos);
  };

  const onCreateSubTask = (taskName, taskId) => {
    const curTodos = { ...todos };
    curTodos.data = [...todos.data];
    curTodos.data[taskId] = { ...todos.data[taskId] };
    curTodos.data[taskId].task = [...curTodos.data[taskId].task];
    curTodos.data[taskId].task.push({ title: taskName, isDone: false });
    // update isAllDone
    curTodos.data[taskId].isAllDone = checkAllTaskDone(taskId, curTodos);
    setTodos(curTodos);
  }

  const onTaskDone = (subTaskId, taskId) => {
    const curTodos = { ...todos };
    curTodos.data = [...todos.data];
    curTodos.data[taskId] = { ...todos.data[taskId] };
    curTodos.data[taskId].task = [...curTodos.data[taskId].task];
    curTodos.data[taskId].task[subTaskId] = { ...curTodos.data[taskId].task[subTaskId] };
    curTodos.data[taskId].task[subTaskId].isDone = !curTodos.data[taskId].task[subTaskId].isDone;
    curTodos.data[taskId].isAllDone = checkAllTaskDone(taskId, curTodos);
    setTodos(curTodos);
  }

  const onDeleteSubTask = (subTaskId, taskId) => {
    const curTodos = { ...todos };
    curTodos.data = [...todos.data];
    curTodos.data[taskId] = { ...todos.data[taskId] };
    curTodos.data[taskId].task = [...curTodos.data[taskId].task];
    curTodos.data[taskId].task.splice(subTaskId, 1);
    curTodos.data[taskId].isAllDone = checkAllTaskDone(taskId, curTodos);
    setTodos(curTodos);
  }

  const checkAllTaskDone = (taskId, curTodos) => {
    let isAllDone = true;
    if (curTodos.data[taskId].task.length === 0) {
      return true;
    }
    for (const subTask of curTodos.data[taskId].task) {
      if (subTask.isDone && isAllDone) {
        isAllDone = true;
      } else {
        isAllDone = false;
      };
    };
    return (isAllDone);
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

    const InputEl = () => {
      const [taskName, setTaskName] = useState("");
      return (
        <div>
          <Input placeholder="Enter Subtask Name" style={{ width: 400 }}
            type="text"
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
          />
          <Button type="primary" onClick={() => onCreateSubTask(taskName, taskId)}>Add Task</Button>
        </div>
      );
    };

    return (
      <Space direction="vertical" style={{ marginTop: 24 }} key={task.name + Math.random()}>
        <Card
          title={task.name}
          style={task.isAllDone ? { width: 600, textDecoration: "line-through" } : { width: 600 }}
          extra={<Button type="primary"
            onClick={() => onDuplicate(id)}>Duplicate</Button>}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <InputEl />
            </Space>
            <Divider />
            {subTasks}
          </Space>
        </Card>
      </Space>
    );
  });

  return (
    <Container>
      <Space>
        <Card 
        style={{marginBottom: '24px ', textAlign: 'center'}}>
        This is an assignment given from the company I applied for a job. <br></br>
        <strong>My task was to put in the logic with React Hooks.</strong> (Ant Design was given.) <br></br>
        <a href="https://github.com/joetlobb/React-Front-End-Test">Github Source Code</a>
        </Card>
      </Space>
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