const mongoose=require("mongoose");

const taskSchema=new mongoose.Schema({
    title:{type: String , required:true},
    description:{type: String , required:true},
    status:{type: String , enum:['Pending','In Progress','Completed'], default:'Pending'},
    priority:{type: String , enum:['Low','Medium','High'], default:'Medium'},
    category: { type: String,enum:["Development", "Design", "Testing", "Documentation", "Meeting", "Research", "Marketing", "Personal", "General", "Others"], default: "General" },
    tags: { type: [String], default: [] },
    dueDate:{type: Date },
    userId:{type: mongoose.Schema.Types.ObjectId , ref:'User', required:true},      
},{timestamps:true})

const task = mongoose.model('Task',taskSchema);

module.exports=task;