const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    email:{ type: String , required: true},
    password:{type :String , required:true},
})

const studentModel = mongoose.model("student_authentications" , studentSchema)

module.exports = studentModel;