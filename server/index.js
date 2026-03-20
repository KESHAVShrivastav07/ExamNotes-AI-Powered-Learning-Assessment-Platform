import express from "express"
import dotenv from "dotenv"
import connectDb from "./utils/connectDb.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import notesRouter from "./routes/genrate.route.js"
import pdfRouter from "./routes/pdf.route.js"
import creditRouter from "./routes/credits.route.js"
import adminRoutes from "./routes/admin.routes.js"
import teacherRoutes from "./routes/teacher.routes.js"
import testRouter from "./routes/test.routes.js"
import { stripeWebhook } from "./controllers/credits.controller.js"


dotenv.config()




const app = express()

// Add COOP header to allow popup window
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.post(
  "/api/credits/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(cors(
    {origin:["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:8000"],
        credentials:true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
))



app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5000
app.get("/",(req,res)=>{
    res.json({message:"ExamNotes AI Backend Running 🚀"})

})
app.use("/api/teacher", teacherRoutes) // Unified teacher-admin APIs
app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/notes", notesRouter) // Legacy generation routes
app.use("/api/pdf", pdfRouter)
app.use("/api/credit",creditRouter)
app.use("/api/admin", adminRoutes)
app.use("/api/tests", testRouter)


app.listen(PORT,()=>{
    console.log(`✅ Server running on port ${PORT}`)
    connectDb()
})
