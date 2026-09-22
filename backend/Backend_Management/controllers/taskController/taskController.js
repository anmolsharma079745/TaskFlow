const Task = require('../../models/taskModel/taskModel');
const User = require('../../models/userModel/userModel');
const sendEmail = require('../../config/email.js');

const createTask = async (req, res) => {
    try {

        const {
            title,
            description,
            priority,
            category,
            tags,
            dueDate
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        if (dueDate && new Date(dueDate) <= new Date()) {
            return res.status(400).json({
                message: "Due date and time must be in the future"
            });
        }

        const task = new Task({
            title,
            description,
            priority,
            category,
            tags,
            dueDate,
            userId: req.user.userId
        });

        await task.save();

        // Send task creation email
        try {

            const user = await User.findById(req.user.userId);

            if (user && user.email) {

                await sendEmail({
                    to: user.email,
                    subject: "Task Created Successfully",
                    html: `
                        <div style="
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: auto;
                            padding: 30px;
                            border: 1px solid #e2e8f0;
                            border-radius: 10px;
                        ">

                            <h2 style="color: #2563eb;">
                                Task Created Successfully
                            </h2>

                            <p>Hello ${user.name},</p>

                            <p>
                                Your task has been created successfully in TaskFlow.
                            </p>

                            <div style="
                                background: #f8fafc;
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
                                    <strong>Priority:</strong>
                                    ${task.priority}
                                </p>

                                <p>
                                    <strong>Status:</strong>
                                    ${task.status}
                                </p>

                                ${
                                    task.dueDate
                                        ? `
                                            <p>
                                                <strong>Due Date:</strong>
                                                ${new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                        `
                                        : ""
                                }

                            </div>

                            <p>
                                Regards,<br>
                                <strong>TaskFlow Team</strong>
                            </p>

                        </div>
                    `
                });

                console.log(
                    "Task creation email sent successfully to:",
                    user.email
                );

            } else {

                console.log(
                    "Task created, but user email was not found."
                );

            }

        } catch (emailError) {

            console.error(
                "Task creation email failed:",
                emailError
            );

        }

        return res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {

        console.log("Create Task Error:", error);

        return res.status(500).json({
            message: "Error creating task",
            error: error.message
        });
    }
};


const getMyTasks = async (req, res) => {
    try {

        const {
            search,
            status,
            priority,
            category,
            tags,
            sortBy,
            order,
            page = 1,
            limit = 5
        } = req.query;

        console.log("page:", page, "limit:", limit);
        console.log("sortBy:", sortBy, "order:", order);

        let query = {
            userId: req.user.userId
        };

        // Search
        if (search) {

            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    category: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    tags: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        // Priority filter
        if (priority) {
            query.priority = priority;
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Tags filter
        if (tags) {
            query.tags = tags;
        }

        // Sorting
        let sortOption = {
            createdAt: -1
        };

        const allowedSortFields = [
            "createdAt",
            "dueDate",
            "priority",
            "status"
        ];

        if (
            sortBy &&
            allowedSortFields.includes(sortBy)
        ) {
            sortOption = {
                [sortBy]: order === "asc" ? 1 : -1
            };
        }

        // Pagination
        const pageNumber = Math.max(
            parseInt(page) || 1,
            1
        );

        const limitNumber = Math.max(
            parseInt(limit) || 5,
            1
        );

        const skip = (pageNumber - 1) * limitNumber;

        const totalTasks = await Task.countDocuments(query);

        const tasks = await Task.find(query)
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

        const totalPages = Math.ceil(
            totalTasks / limitNumber
        );

        return res.status(200).json({
            message: "Tasks fetched successfully",

            tasks: updatedTasks,

            pagination: {
                currentPage: pageNumber,
                totalPages: totalPages,
                totalTasks: totalTasks,
                limit: limitNumber,

                hasNextPage:
                    pageNumber < totalPages,

                hasPreviousPage:
                    pageNumber > 1
            }
        });

    } catch (err) {

        console.error(
            "Get My Tasks Error:",
            err
        );

        return res.status(500).json({
            message: "Error fetching tasks",
            error: err.message
        });
    }
};


const getSingleTask = async (req, res) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        const updatedTask = {
            ...task.toObject(),

            isOverdue:
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== "Completed"
        };

        return res.status(200).json({
            message: "Task fetched successfully",
            task: updatedTask
        });

    } catch (err) {

        console.error(
            "Get Single Task Error:",
            err
        );

        return res.status(500).json({
            message: "Error fetching task",
            error: err.message
        });
    }
};


const updateTask = async (req, res) => {
    try {

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

        // Get old task before updating
        const oldTask = await Task.findOne({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!oldTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Update task
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId
            },
            {
                title,
                description,
                status,
                priority,
                category,
                tags,
                dueDate
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Send email only when task becomes Completed
        if (
            status === "Completed" &&
            oldTask.status !== "Completed"
        ) {

            try {

                const user = await User.findById(
                    req.user.userId
                );

                if (user && user.email) {

                    await sendEmail({
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

                                <p>
                                    Hello ${user.name},
                                </p>

                                <p>
                                    Congratulations! You have successfully
                                    completed your task.
                                </p>

                                <div style="
                                    background: #f0fdf4;
                                    padding: 20px;
                                    border-radius: 8px;
                                    margin: 20px 0;
                                ">

                                    <h3>
                                        ${task.title}
                                    </h3>

                                    <p>
                                        <strong>Description:</strong>
                                        ${task.description}
                                    </p>

                                    <p>
                                        <strong>Status:</strong>
                                        Completed
                                    </p>

                                    <p>
                                        <strong>Priority:</strong>
                                        ${task.priority}
                                    </p>

                                    <p>
                                        <strong>Category:</strong>
                                        ${task.category}
                                    </p>

                                    ${
                                        task.dueDate
                                            ? `
                                                <p>
                                                    <strong>Due Date:</strong>
                                                    ${new Date(
                                                        task.dueDate
                                                    ).toLocaleDateString()}
                                                </p>
                                            `
                                            : ""
                                    }

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

                    console.log(
                        "Task completion email sent successfully to:",
                        user.email
                    );

                } else {

                    console.log(
                        "Task completed, but user email was not found."
                    );

                }

            } catch (emailError) {

                console.error(
                    "Task completion email failed:",
                    emailError
                );

            }
        }

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (err) {

        console.error(
            "Update Task Error:",
            err
        );

        return res.status(500).json({
            message: "Error updating task",
            error: err.message
        });
    }
};


const deleteTask = async (req, res) => {
    try {

        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (err) {

        console.error(
            "Delete Task Error:",
            err
        );

        return res.status(500).json({
            message: "Failed to delete task",
            error: err.message
        });
    }
};


const getDashboardStats = async (req, res) => {
    try {

        const TotalTasks = await Task.countDocuments({
            userId: req.user.userId
        });

        const CompletedTasks = await Task.countDocuments({
            userId: req.user.userId,
            status: "Completed"
        });

        const PendingTasks = await Task.countDocuments({
            userId: req.user.userId,
            status: "Pending"
        });

        const InProgressTasks = await Task.countDocuments({
            userId: req.user.userId,
            status: "In Progress"
        });

        return res.status(200).json({

            message: "Dashboard stats fetched successfully",

            stats: {
                TotalTasks,
                CompletedTasks,
                PendingTasks,
                InProgressTasks
            }
        });

    } catch (err) {

        console.error(
            "Dashboard Stats Error:",
            err
        );

        return res.status(500).json({
            message: "Error fetching dashboard stats",
            error: err.message
        });
    }
};


module.exports = {
    createTask,
    getMyTasks,
    getSingleTask,
    updateTask,
    deleteTask,
    getDashboardStats
};