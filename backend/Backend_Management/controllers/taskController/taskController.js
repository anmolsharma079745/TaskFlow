const Task = require('../../models/taskModel/taskModel');
const User = require('../../models/userModel/userModel');
const sendEmail = require('../../config/email.js');


// ==============================
// CREATE TASK
// ==============================

const createTask = async (req, res) => {
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

        // Due date validation
        if (dueDate && new Date(dueDate) <= new Date()) {
            return res.status(400).json({
                message: "Due date and time must be in the future"
            });
        }

        // Create task
        const task = await Task.create({
            title,
            description,
            status: status || "Pending",
            priority,
            category,
            tags,
            dueDate,
            userId: req.user.userId
        });

        // Send email separately
        try {
            const user = await User.findById(req.user.userId);

            if (user && user.email) {
                sendEmail({
                    to: user.email,
                    subject: "Task Created Successfully",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #f8fafc; border-radius: 12px;">
                            
                            <h2 style="color: #2563eb; margin-bottom: 10px;">
                                Task Created Successfully
                            </h2>

                            <p style="font-size: 16px; color: #334155;">
                                Hello ${user.name || "User"},
                            </p>

                            <p style="font-size: 15px; color: #475569;">
                                Your task has been created successfully in TaskFlow.
                            </p>

                            <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
                                
                                <p>
                                    <strong>Task:</strong> ${task.title}
                                </p>

                                <p>
                                    <strong>Status:</strong> ${task.status}
                                </p>

                                <p>
                                    <strong>Priority:</strong> ${task.priority || "Not specified"}
                                </p>

                                <p>
                                    <strong>Category:</strong> ${task.category || "Not specified"}
                                </p>

                                ${
                                    task.dueDate
                                        ? `<p>
                                            <strong>Due Date:</strong> 
                                            ${new Date(task.dueDate).toLocaleString()}
                                           </p>`
                                        : ""
                                }

                            </div>

                            <p style="margin-top: 25px; color: #64748b;">
                                Keep up the great work with TaskFlow!
                            </p>

                        </div>
                    `
                })
                .then(() => {
                    console.log(
                        "Task creation email sent successfully to:",
                        user.email
                    );
                })
                .catch((emailError) => {
                    console.error(
                        "Task creation email failed:",
                        emailError
                    );
                });

            } else {
                console.log(
                    "Task created, but user email was not found."
                );
            }

        } catch (emailError) {
            console.error(
                "Error preparing task creation email:",
                emailError
            );
        }

        // Return response immediately
        return res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (err) {
        console.error(
            "Create Task Error:",
            err
        );

        return res.status(500).json({
            message: "Error creating task",
            error: err.message
        });
    }
};


// ==============================
// GET MY TASKS
// ==============================

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

        // Filters
        if (status) {
            query.status = status;
        }

        if (priority) {
            query.priority = priority;
        }

        if (category) {
            query.category = category;
        }

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

        const skip =
            (pageNumber - 1) * limitNumber;

        const totalTasks =
            await Task.countDocuments(query);

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
                totalPages,
                totalTasks,
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


// ==============================
// GET SINGLE TASK
// ==============================

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


// ==============================
// UPDATE TASK
// ==============================

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

        // Validate due date
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
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // =====================================
        // SEND EMAIL WHEN TASK IS COMPLETED
        // =====================================

        if (
            status === "Completed" &&
            oldTask.status !== "Completed"
        ) {

            try {

                const user = await User.findById(
                    req.user.userId
                );

                if (user && user.email) {

                    sendEmail({
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
                    })
                    .then(() => {

                        console.log(
                            "Task completion email sent successfully to:",
                            user.email
                        );

                    })
                    .catch((emailError) => {

                        console.error(
                            "Task completion email failed:",
                            emailError
                        );

                    });

                } else {

                    console.log(
                        "Task completed, but user email was not found."
                    );

                }

            } catch (emailError) {

                console.error(
                    "Error preparing completion email:",
                    emailError
                );

            }
        }

        // =====================================
        // RETURN UPDATED TASK IMMEDIATELY
        // =====================================

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


// ==============================
// DELETE TASK
// ==============================

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


// ==============================
// DASHBOARD STATS
// ==============================

const getDashboardStats = async (req, res) => {
    try {
        const TotalTasks =
            await Task.countDocuments({
                userId: req.user.userId
            });

        const CompletedTasks =
            await Task.countDocuments({
                userId: req.user.userId,
                status: "Completed"
            });

        const PendingTasks =
            await Task.countDocuments({
                userId: req.user.userId,
                status: "Pending"
            });

        const InProgressTasks =
            await Task.countDocuments({
                userId: req.user.userId,
                status: "In Progress"
            });

        return res.status(200).json({
            message:
                "Dashboard stats fetched successfully",

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
            message:
                "Error fetching dashboard stats",
            error: err.message
        });
    }
};


// ==============================
// EXPORTS
// ==============================

module.exports = {
    createTask,
    getMyTasks,
    getSingleTask,
    updateTask,
    deleteTask,
    getDashboardStats
};