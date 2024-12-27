const mongoose = require("mongoose")

const facultySchema = new mongoose.Schema({
    email:{ type: String , required: true},
    password:{type :String , required:true},
})

const facultyModel = mongoose.model("faculty_authentications" , facultySchema)

module.exports=facultyModel;