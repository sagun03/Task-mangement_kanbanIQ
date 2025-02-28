import express from "express";
import TaskController from "./tasks.controller";

const router = express.Router();
const taskController = TaskController.getInstance();

// Create a new task
/**
 
@swagger
/tasks:
post:
summary: Create a new task
description: Adds a new task with relevant details
requestBody:
required: true
content:
application/json:
schema:
type: object
properties:
title:
type: string
example: "New Task"
description:
type: string
example: "Task description here"
priority:
type: string
enum: [high, medium, low]
example: "high"
dueDate:
type: string
format: date-time
example: "2025-02-28T12:00:00Z"
assignedTo:
type: string
example: "userId123"
assignedBy:
type: string
example: "userId456"
status:
type: string
enum: [To Do, In Progress, Done]
example: "To Do"
createdBy:
type: string
example: "adminId789"
boardOriginalId:
type: string
example: "board123"
responses:
201:
description: Task created successfully
400:
description: Invalid request body
500:
description: Internal server error*/
router.post("/", async (req, res) => {
    await taskController.createTask(req, res);
  });