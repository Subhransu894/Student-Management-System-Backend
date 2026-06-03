const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const app = express()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {userStudent} = require("./models/users.models")
const {authMiddleware} = require("./middleware/auth.middleware")

dotenv.config()
const {initializeDatabase} = require("./db/db.connection")
const {Student} = require("./models/students.models")

app.use(express.json())
app.use(cors())

initializeDatabase()

app.get("/",(req,res)=>{
    res.send("Hello Students, Express is here !")
})

app.get("/students",authMiddleware,async(req,res)=>{
    try {
        const students = await Student.find()
        res.json(students)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });   
    }
})
app.post("/students",authMiddleware,async(req,res)=>{
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
app.post("/students/:id",authMiddleware,async(req,res)=>{
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
app.delete("/students/:id",authMiddleware,async(req,res)=>{
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
//Register
app.post("/register",async(req,res)=>{
    const {username,password} = req.body
    try {
        const existingUser = await userStudent.findOne({username})

        if(existingUser){
            return res.status(400).json({message:"Username already existed"})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = new userStudent({username,password:hashedPassword})
        await user.save()
        res.status(200).json({message:"User registered successfully"})
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
})
//Login
app.post("/login",async(req,res)=>{
    const {username,password} = req.body
    try {
        const user = await userStudent.findOne({username})

        if(!user){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"})
        }
        const token = jwt.sign(
            {userId:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"},
        )
        res.json({
            token,username: user.username
        })
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})

