const express=require('express');
const { createTask, getMyTasks, getSingleTask, updateTask, deleteTask, getDashboardStats} = require('../../controllers/taskController/taskController');
const authMiddleware=require('../../middleware/authMiddleware/authMiddleware');

const router=express.Router();

router.post("/createTask", authMiddleware, createTask);
router.get("/myAllTasks", authMiddleware, getMyTasks);
router.get("/getTask/:id", authMiddleware, getSingleTask);
router.put("/update-Task/:id", authMiddleware, updateTask);
router.delete("/deleteTask/:id", authMiddleware, deleteTask);
router.get("/dashboardStats", authMiddleware, getDashboardStats);

module.exports=router;