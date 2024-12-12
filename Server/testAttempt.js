import mongoose from "mongoose";
// Mongoose Schema for Test Attempt
const TestAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  detailedQuestions: [
    {
      QUESTION: {
        type: String,
        required: true,
      },
      OPTIONS: {
        type: Map,
        of: String,
        required: true,
      },
      CORRECTANS: {
        type: String,
        required: true,
      },
      USERANS: {
        type: String,
        required: true,
      },
      DESCRIPTION_OR_EXPLANATION: {
        type: String,
        default: null,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
  attemptedAt: {
    type: Date,
    default: Date.now,
  },
});

const TestAttempt = mongoose.model("TestAttempt", TestAttemptSchema);
export default TestAttempt;
