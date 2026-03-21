# 📚 ExamNotes: AI-Powered Learning & Assessment Platform

 ExamNotes is an AI-powered learning and assessment platform that helps students generate notes, practice questions, and evaluate performance efficiently.
It integrates AI APIs, secure authentication, database storage, and REST APIs to provide a smart learning environment.

🚀 Features
🤖 AI-based Notes Generation
📝 Practice Questions & Assessment
🔐 Authentication & User Management
💳 Payment Integration (Stripe)
📂 File Upload Support
🌐 REST API Architecture
🧠 AI API Integration (Gemini/OpenAI etc.)
📊 MongoDB Database Storage
⚡ Fast frontend using Vite
🏗️ Project Structure
ExamNotes
│
├── package.json
├── vite.config.js
├── README.md
│
├── server
│   ├── controllers      # Business logic
│   ├── middleware       # Auth & validation middleware
│   ├── models           # Database schemas (MongoDB)
│   ├── routes           # API routes
│   ├── services         # AI & external API services
│   ├── seeder           # Sample data insertion
│   ├── uploads          # Uploaded files storage
│   ├── utils            # Helper functions
│   ├── .env             # Environment variables
│   ├── index.js         # Entry point of server
│   ├── db_dump.json     # Database backup
│   ├── deleteUsers.js   # Utility script
│   ├── updateCredits.js # Credit update script
│   ├── testAxios.js     # API testing
│   ├── testDb.js        # Database testing
│   ├── testGemini.js    # AI API testing
│   ├── testMongoose.js  # Mongoose testing
│   ├── testNetwork.js   # Network testing
│   ├── testRawDb.js     # Raw DB testing
│   └── rawDbOutput.txt  # DB output logs
🛠️ Tech Stack
Frontend
HTML
CSS
JavaScript
Vite
Backend
Node.js
Express.js
MongoDB
Mongoose
AI Integration
Google Gemini API / OpenAI API
Payment
Stripe API
Deployment
Render / Cloud server
⚙️ Installation
1️⃣ Clone repository
git clone https://github.com/yourusername/examnotes.git
cd examnotes
2️⃣ Install dependencies
npm install
cd server
npm install
3️⃣ Setup Environment Variables

Create .env file inside server folder

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_ai_api_key

STRIPE_SECRET_KEY=your_stripe_secret
4️⃣ Run project

Backend:

cd server
npm start

Frontend:

npm run dev
📡 API Modules
Module	Description
Auth API	Login & Signup
Notes API	Generate AI Notes
Test API	Practice Questions
Payment API	Stripe integration
Upload API	File upload
User API	Manage users
🧪 Testing Files

These files are used for testing different services:

testGemini.js → AI API testing
testDb.js → Database testing
testAxios.js → API request testing
testNetwork.js → Network testing
testMongoose.js → Mongoose connection test
💳 Payment Integration

Stripe is used for handling payments securely.

Example features:

Subscription
Credits system
Payment verification
🌍 Deployment

Project can be deployed using:

Render
Railway
Vercel (frontend)
MongoDB Atlas
📌 Future Improvements
Dashboard analytics
More AI models support
PDF export notes
Performance tracking
Admin panel
👨‍💻 Author

Developed for learning purpose and internship preparation.

📄 License

This project is open-source and available for educational use.
<img width="610" height="905" alt="image" src="https://github.com/user-attachments/assets/fd971d97-aecd-4c50-8832-664877842a2e" />

