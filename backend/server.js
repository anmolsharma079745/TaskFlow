require('dotenv').config();

const app=require('./Backend_Management/index.js');
const connectDB=require('./Backend_Management/config/db.js');

const port=process.env.PORT || 3000;
connectDB();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});