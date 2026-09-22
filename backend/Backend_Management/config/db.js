const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log('MongoDB connected Successfully!');
    }catch(error){
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports=connectDB;