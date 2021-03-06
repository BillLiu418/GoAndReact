import "semantic-ui-css/semantic.min.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Button } from "semantic-ui-react";
import styled from "styled-components";
const endpoint = "http://localhost:8080";

export const ToDoList = () => {
  const [appState, setAppState] = useState({ task: "", items: [] });

  useEffect(() => {
    getTask();
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setAppState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSubmit = () => {
    const task = appState.task;
    if (task) {
      axios
        .post(
          endpoint + "/api/task",
          {
            task,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          getTask();
          setAppState((prevState) => ({ ...prevState, task: "" }));
          console.log(res);
        });
    }
  };

  const getTask = () => {
    axios.get(endpoint + "/api/task").then((res) => {
      console.log(res);
      if (res.data) {
        setAppState((prevState) => ({
          ...prevState,
          items: res.data.map((item) => {
            let color = "yellow";

            if (item.status) {
              color = "green";
            }
            return (
              <Card key={item._id} color={color} fluid>
                <Card.Content>
                  <Card.Header textAlign="left">
                    <div style={{ wordWrap: "break-word" }}>{item.task}</div>
                  </Card.Header>

                  <Card.Meta textAlign="right">
                    <Icon
                      name="check circle"
                      color="green"
                      onClick={() => updateTask(item._id)}
                    />
                    <span style={{ paddingRight: 10 }}>Done</span>
                    <Icon
                      name="undo"
                      color="yellow"
                      onClick={() => undoTask(item._id)}
                    />
                    <span style={{ paddingRight: 10 }}>Undo</span>
                    <Icon
                      name="delete"
                      color="red"
                      onClick={() => deleteTask(item._id)}
                    />
                    <span style={{ paddingRight: 10 }}>Delete</span>
                  </Card.Meta>
                </Card.Content>
              </Card>
            );
          }),
        }));
      } else {
        setAppState((prevState) => ({ ...prevState, items: [] }));
      }
    });
  };

  const updateTask = (id) => {
    axios
      .put(endpoint + "/api/task/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log(res);
        getTask();
      });
  };

  const undoTask = (id) => {
    axios
      .put(endpoint + "/api/undoTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log(res);
        getTask();
      });
  };

  const deleteTask = (id) => {
    axios
      .delete(endpoint + "/api/deleteTask/" + id, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log(res);
        getTask();
      });
  };

  return (
    <div>
      <div className="row">
        <Header className="header" as="h2">
          TO DO LIST
        </Header>
      </div>
      <div className="row">
        <Form onSubmit={onSubmit}>
          <Input
            type="text"
            name="task"
            onChange={onChange}
            value={appState.task}
            fluid
            placeholder="Create Task"
          />
          <Button>Create Task</Button>
        </Form>
      </div>
      <div className="row">
        <Card.Group>{appState.items}</Card.Group>
      </div>
    </div>
  );
};
