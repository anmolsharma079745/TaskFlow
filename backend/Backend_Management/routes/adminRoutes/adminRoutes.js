const express= require('express');
const router= express.Router();
const {getAllUsers , getSingleUser , updateUser , deleteUser , getAllTasks,  getSingleTask, updateTask, deleteTask, getDashboardStats} = require('../../controllers/adminController/adminController.js');
const authMiddleware = require('../../middleware/authMiddleware/authMiddleware.js');
const roleMiddleware = require('../../middleware/roleMiddleware/roleMiddleware.js');

router.get('/getAllUsers',authMiddleware,roleMiddleware('admin'), getAllUsers);
router.get('/getSingleUser/:id',authMiddleware,roleMiddleware('admin'), getSingleUser);
router.put('/updateUser/:id',authMiddleware,roleMiddleware('admin'), updateUser);
router.delete('/deleteUser/:id',authMiddleware,roleMiddleware('admin'), deleteUser);
router.get('/getAllTasks',authMiddleware,roleMiddleware('admin'), getAllTasks);
router.get('/getSingleTask/:id',authMiddleware,roleMiddleware('admin'), getSingleTask);
router.put('/updateTask/:id',authMiddleware,roleMiddleware('admin'), updateTask);
router.delete('/deleteTask/:id',authMiddleware,roleMiddleware('admin'), deleteTask);
router.get('/getDashboardStats',authMiddleware,roleMiddleware('admin'), getDashboardStats);

module.exports= router;