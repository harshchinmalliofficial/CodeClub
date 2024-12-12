import mongoose from "mongoose";
const Question = mongoose.Schema({
  qName: { type: "string" },
  qLink: { type: "string" },
  qSolutionTime: { type: Date, unique: true },
  qSolution: { type: "string" },
});

const Questions = mongoose.model("questions", Question);
export default Questions;
