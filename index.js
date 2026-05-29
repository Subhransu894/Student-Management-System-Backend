const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const app = express()

dotenv.config()
const {initializeDatabase} = require("./db/db.connection")
const {Student} = require("./models/students.models")

app.use(express.json())
app.use(cors())

initializeDatabase()

app.get("/",(req,res)=>{
    res.send("Hello Students, Express is here !")
})

app.get("/students",async(req,res)=>{
    try {
        const students = await Student.find()
        res.json(students)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });   
    }
})
app.post("/students",async(req,res)=>{
    const {name,age,gender,marks,attendance,grade} = req.body
    try {
        const student = new Student({
            name,age,gender,marks,attendance,grade
        })
        await student.save()
        res.status(200).json(student)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });   
    }
})
//update std
app.post("/students/:id",async(req,res)=>{
    const studentId = req.params.id
    const updateStdData = req.body
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            updateStdData,
            {new:true},
        )
        if(!updatedStudent){
            return res.status(404).json({message: "Student Not found"})
        }
        res.status(200).json(updatedStudent)
    } catch (error) {
        res.status(500).json({message:"Server Error"})   
    }
})
//delete std
app.delete("/students/:id",async(req,res)=>{
    const id = req.params.id;
    try {
        const deletedStudent = await Student.findByIdAndDelete(id)
        if(!deletedStudent){
            res.status(404).json({error: "Student not found" })
        }
        res.status(200).json({
            message:"Student deleted successfully",
            student: deletedStudent,
        })
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})