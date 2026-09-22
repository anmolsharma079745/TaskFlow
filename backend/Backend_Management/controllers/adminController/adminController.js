const User= require('../../models/userModel/userModel.js');
const Task = require('../../models/taskModel/taskModel.js');
const transporter = require('../../config/email.js');

const getAllUsers = async (req , res) =>{
    try{
        const users = await User.find({}).select('-password');
        res.status(200).json({
            message:"Users fetched successfully",
            users
        });
    }catch(err){
        res.status(500).json({
            message :"Error fetching users",
            error: err.message      
        })
    }
}

const getSingleUser = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        res.status(200).json({
            message:"User fetched successfully",
            user
        });
    }catch(err){
        res.status(500).json({
            message :"Error fetching user",
            error: err.message      
        })
    }
}

const updateUser = async (req,res)=>{
    try{
        const {name , email ,role} = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id , 
            {name , email , role},
            {new:true , runValidators:true}
        ).select('-password');
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }
        res.status(200).json({
            message:"User updated successfully",
            user
        });

    }catch(err){
        res.status(500).json({
            message :"Error updating user",
            error: err.message      
        })
    }
}

const deleteUser = async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        delete user.password;
        res.status(200).json({
            message:"User deleted successfully",
            user
        }); 

    }catch(err){
        res.status(500).json({
            message :"Error deleting user",
            error: err.message      
        })
    }
}

const getAllTasks = async (req, res) => {
    try {

        const {
            sortBy,
            order,
            page = 1,
            limit = 5
        } = req.query;

        let sortOption = {
            createdAt: -1
        };

        const allowedSortFields = [
            "createdAt",
            "dueDate",
            "priority",
            "status"
        ];

        if (sortBy && allowedSortFields.includes(sortBy)) {
            sortOption = {
                [sortBy]: order === "asc" ? 1 : -1
            };
        }

        const pageNumber = Math.max(parseInt(page), 1);
        const limitNumber = Math.max(parseInt(limit), 1);

        const skip = (pageNumber - 1) * limitNumber;

        const totalTasks = await Task.countDocuments({});

        const tasks = await Task.find({})
            .populate("userId", "name email")
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        const updatedTasks = tasks.map(task => ({
            ...task.toObject(),
            isOverdue:
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== "Completed"
        }));

        const totalPages = Math.ceil(totalTasks / limitNumber);

        res.status(200).json({
            message: "Tasks fetched successfully",
            tasks: updatedTasks,
            pagination: {
                currentPage: pageNumber,
                totalPages: totalPages,
                totalTasks: totalTasks,
                limit: limitNumber,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1
            }
        });

    } catch (err) {

        res.status(500).json({
            message: "Error fetching tasks",
            error: err.message
        });

    }
};

const getSingleTask = async (req,res)=>{
    try{
        const task = await Task.findById(req.params.id)
            .populate("userId","name email");
        if(!task){
            return res.status(404).json({
                message:"Task not found"
            });
        }
        const updatedTask = {
            ...task.toObject(),
            isOverdue:
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== "Completed"
        };
        res.status(200).json({
            message:"Task fetched successfully",
            task: updatedTask
        });
    }catch(err){
        res.status(500).json({
            message :"Error fetching task",
            error: err.message      
        })
    }
}

const updateTask = async (req,res)=>{
    try{
        const {
            title,
            description,
            status,
            priority,
            category,
            tags,
            dueDate
        } = req.body;

        if (dueDate && new Date(dueDate) <= new Date()) {
            return res.status(400).json({
                message: "Due date and time must be in the future"
            });
        }

        const oldTask = await Task.findById(req.params.id);

        if(!oldTask){
            return res.status(404).json({
                message:"Task not found"
            });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                status,
                priority,
                category,
                tags,
                dueDate,
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        ).populate("userId", "name email");

        if(!task){
            return res.status(404).json({
                message:"Task not found"
            });
        }

        if (status === "Completed" && oldTask.status !== "Completed") {

            const user = await User.findById(oldTask.userId);

            if (user) {
                await transporter.sendMail({
                    from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
                    to: user.email,
                    subject: "Task Completed 🎉",
                    html: `
                        <div style="
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: auto;
                            padding: 30px;
                            border: 1px solid #e2e8f0;
                            border-radius: 10px;
                        ">

                            <h2 style="color: #16a34a;">
                                Task Completed 🎉
                            </h2>

                            <p>Hello ${user.name},</p>

                            <p>
                                Congratulations! Your task has been completed.
                            </p>

                            <div style="
                                background: #f0fdf4;
                                padding: 20px;
                                border-radius: 8px;
                                margin: 20px 0;
                            ">

                                <h3>${task.title}</h3>

                                <p>
                                    <strong>Description:</strong>
                                    ${task.description}
                                </p>

                                <p>
                                    <strong>Status:</strong> Completed
                                </p>

                                <p>
                                    <strong>Priority:</strong> ${task.priority}
                                </p>

                                <p>
                                    <strong>Category:</strong> ${task.category}
                                </p>

                            </div>

                            <p>
                                Keep up the great work!
                            </p>

                            <p>
                                Regards,<br>
                                <strong>TaskFlow Team</strong>
                            </p>

                        </div>
                    `
                });
            }
        }

        res.status(200).json({
            message:"Task updated successfully",
            task
        });

    }catch(err){
        console.log("Admin Task Update Error:", err);

        res.status(500).json({
            message :"Error updating task",
            error: err.message
        });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            task
        });

    } catch (err) {
        res.status(500).json({
            message: "Error deleting task",
            error: err.message
        });
    }
};

const getDashboardStats = async (req, res) => {
    try{
        const totalUsers = await User.countDocuments();
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: 'Completed' });
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });

        res.status(200).json({
            message: "Dashboard stats fetched successfully",
            stats: {
                totalUsers,
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Error fetching dashboard stats",
            error: err.message
        });
    }
};

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getAllTasks,
    getSingleTask,
    updateTask,
    deleteTask,
    getDashboardStats
};