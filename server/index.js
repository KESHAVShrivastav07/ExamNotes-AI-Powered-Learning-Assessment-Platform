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
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


dotenv.config()




const app = express()

// Add COOP header to allow popup window
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  next();
});

app.post(
  "/api/credits/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(cors(
    {origin:"https://examnotes-ai-client.onrender.com",
        credentials:true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
))



app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
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
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
      console.log(`✅ Created uploads directory at: ${uploadsDir}`)
    } else {
      console.log(`✅ Uploads directory exists at: ${uploadsDir}`)
      // Log how many files are in the directory
      const files = fs.readdirSync(uploadsDir)
      console.log(`   Files present: ${files.length}`)
    }
    
    connectDb()
})
