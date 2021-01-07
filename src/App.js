import React, { useState } from 'react';

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

  const onCreateTask = (taskName, taskId) => {
    const curTodos = { ...todos };
    curTodos.data = [...todos.data];
    curTodos.data.push({
      "name": taskName,
      "isAllDone": false,
      "task": []
    });
    const newTaskId = curTodos.data.length - 1;
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
  };

  const onTaskDone = (subTaskId, taskId) => {
    const curTodos = { ...todos };
    curTodos.data = [...todos.data];
    curTodos.data[taskId] = { ...todos.data[taskId] };
    curTodos.data[taskId].task = [...curTodos.data[taskId].task];
    curTodos.data[taskId].task[subTaskId] = { ...curTodos.data[taskId].task[subTaskId] };
    curTodos.data[taskId].task[subTaskId].isDone = !curTodos.data[taskId].task[subTaskId].isDone;
    curTodos.data[taskId].isAllDone = checkAllTaskDone(taskId, curTodos);
    setTodos(curTodos);
  };

  const onDeleteTask = id => {
    const curTodos = { ...todos };
    curTodos.data = [...todos.data];
    curTodos.data.splice(id, 1);
    setTodos(curTodos);
  };

  const onDeleteSubTask = (subTaskId, taskId) => {
    const curTodos = { ...todos };
    curTodos.data = [...todos.data];
    curTodos.data[taskId] = { ...todos.data[taskId] };
    curTodos.data[taskId].task = [...curTodos.data[taskId].task];
    curTodos.data[taskId].task.splice(subTaskId, 1);
    curTodos.data[taskId].isAllDone = checkAllTaskDone(taskId, curTodos);
    setTodos(curTodos);
  };

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

  const InputEl = (props) => {
    const [taskName, setTaskName] = useState("");
    return (
      <div>
        <Input placeholder={props.placeholder} style={{ width: 400, marginRight: '8px' }}
          type="text"
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
        />
        <Button type="primary" onClick={() => props.add(taskName, props.taskId)}>{props.buttonName}</Button>
      </div>
    );
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
    } else {
      subTasks = <p key={Math.random()} style={{textAlign: 'center', margin: 0}}>
        Add Some Task!</p>;
    }

    return (
      <Space direction="vertical" style={{ marginTop: 24 }} key={task.name + Math.random()}>
        <Card
          title={task.name}
          style={task.isAllDone && task.task.length !== 0 ? { width: 600, textDecoration: "line-through", border: '1px solid #ddd' }
            : { width: 600, border: '1px solid #ddd' }}
          extra={<React.Fragment>
            <Button
              style={{ marginRight: '8px' }}
              type="primary"
              onClick={() => onDuplicate(id)}>Duplicate</Button>
            <Button type="danger"
              onClick={() => onDeleteTask(id)}>Delete</Button>
          </React.Fragment>}

        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Space>
              <InputEl add={onCreateSubTask} placeholder="Enter Subtask Name"
                taskId={taskId} buttonName='Add Task' />
            </Space>
            <Divider style={{margin: '12px 0 8px 0'}} />
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
          style={{ marginBottom: '24px ', textAlign: 'center', border: '1px solid #ddd' }}>
          This is an assignment given from the company I applied for a job. <br></br>
          <strong>My task was to put in the logic with React Hooks.</strong> (Ant Design was given.) <br></br>
          <a href="https://github.com/joetlobb/React-Front-End-Test">Github Source Code</a>
        </Card>
      </Space>
      <Space>
        <InputEl add={onCreateTask} placeholder="Enter Task Name"
          taskId={null} buttonName='Create Task' />
        {/* <Input style={{ width: 400 }} placeholder="Enter Task Name"
          onChange={(event) => taskInputHandler(event)} />
        <Button type="primary" onClick={onCreateTask}>Create Task</Button> */}
      </Space>
      {allTasks}
    </Container>
  );
}

export default App;