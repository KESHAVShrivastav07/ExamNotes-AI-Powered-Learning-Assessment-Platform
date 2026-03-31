import Notes from "../models/notes.model.js"
import UserModel from "../models/user.model.js"
import Teacher from "../models/teacher.model.js"
import Admin from "../models/admin.model.js"
import { generateGeminiResponse } from "../services/gemini.services.js"
import { buildPrompt } from "../utils/promptBuilder.js"

export const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode = false,
      includeDiagram = false,
      includeChart = false
    } = req.body;

    console.log("--- Generate Notes Start ---");
    console.log("Payload:", { topic, classLevel, examType });

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const { userId, role } = req;
    console.log("Auth Info:", { userId, role });

    let actor;
    if (role === "admin") {
      actor = await Admin.findById(userId);
    } else if (role === "teacher") {
      actor = await Teacher.findById(userId);
    } else {
      actor = await UserModel.findById(userId);
    }

    if (!actor) {
      console.error("Actor not found for ID:", userId);
      return res.status(400).json({ message: "user is not found" });
    }

    console.log("Actor Found:", actor.name, "Credits:", actor.credits);

    // All roles consume credits
    if (actor.credits < 10) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

    const prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart
    });

    console.log("Prompt Built. Calling Gemini...");
    const aiResponse = await generateGeminiResponse(prompt);
    console.log("Gemini Success. Formatting for frontend...");

    // Map JSON to the format existing frontend components (FinalResult.jsx, Sidebar.jsx) expect
    const formattedData = {
      topic: topic,
      classLevel: classLevel || "",
      examType: examType || "",
      revisionMode: revisionMode,
      detailedNotes: aiResponse.notes || "",
      revisionPoints: Array.isArray(aiResponse.revisionPoints) ? aiResponse.revisionPoints.join("\n") : (aiResponse.revisionPoints || ""),
      subTopics: aiResponse.subTopics || { "⭐": [], "⭐⭐": [], "⭐⭐⭐": [] },
      importance: aiResponse.importance || "⭐⭐",
      questions: aiResponse.questions || { short: [], long: [], diagram: "" },
      diagram: aiResponse.diagram?.data || "",
      chartData: Array.isArray(aiResponse.charts) ? aiResponse.charts.map(c => ({
        chartTitle: c.title,
        data: c.data,
        chartType: c.type
      })) : []
    };

    const notes = await Notes.create({
      user: actor._id,
      uploadedBy: actor._id,
      onModel: role === "admin" ? "Admin" : (role === "teacher" ? "Teacher" : "UserModel"),
      topic,
      title: topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
      content: formattedData // Save formatted data for consistency
    });

    console.log("Note Created ID:", notes._id);

    // Deduct credits
    actor.credits -= 10;
    if (actor.credits <= 0) actor.isCreditAvailable = false;

    if (!Array.isArray(actor.notes)) {
      actor.notes = [];
    }

    actor.notes.push(notes._id);
    await actor.save();
    console.log("Actor Saved. Credits Left:", actor.credits);

    return res.status(200).json({
      data: formattedData,
      noteId: notes._id,
      creditsLeft: actor.credits
    });
  } catch (error) {
    console.error("--- Generate Notes FAILED ---");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);
    
    res.status(500).json({
      error: "AI generation failed",
      message: error.message,
      detail: error.name
    });
  }
};
