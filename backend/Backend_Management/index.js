const express=require('express');
const cors=require('cors');

const authRoutes=require('./routes/authRoutes/authRoutes.js');
const taskRoutes=require('./routes/taskRoutes/taskRoutes.js');
const adminRoutes=require('./routes/adminRoutes/adminRoutes.js');

const app=express();
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/task',taskRoutes);
app.use('/api/admin',adminRoutes);

module.exports=app;