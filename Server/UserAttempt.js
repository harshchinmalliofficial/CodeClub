import mongoose from "mongoose";

const userAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  userAnswers: [
    {
      questionIndex: {
        type: Number,
        required: true,
      },
      selectedAnswer: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  attemptDate: {
    type: Date,
    default: Date.now,
  },
});

const UserAttempt = mongoose.model("UserAttempt", userAttemptSchema);

export default UserAttempt;
