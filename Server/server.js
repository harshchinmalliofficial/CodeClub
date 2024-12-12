import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import User from "./user.js";
import admin from "./admin.js";
import Jwt from "jsonwebtoken";
import "dotenv/config.js";
import auth from "./verifyToken.js";
import Questions from "./questions.js";
import axios from "axios";
import items from "./item.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";
import OpenAIApi from "openai";
import Configuration from "openai";
import Test from "./quizdata.js";
import UserAttempt from "./UserAttempt.js";

import pm2 from "pm2"; // Added PM2 library
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
// import UserAttempt from "./UserAttempt.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongourl =
  "mongodb+srv://01fe22bca134:Harsh%404512@cluster0.iawfr.mongodb.net/";

mongoose
  .connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected Successfully");
  })
  .catch((err) => {
    console.log("DB Connection Failed");
    console.log(err);
    process.exit(1);
  });

app.post("/signup", async (req, res) => {
  const { Firstname, Lastname, email, CfId, password } = req.body;
  const Password = await bcrypt.hash(password, 10);
  const newuser = await User.create({
    Firstname: Firstname,
    Lastname: Lastname,
    email: email,
    password: Password,
    CfId: CfId,
    codeCoins: 0,
    lastClaimTIme: null,
  });
  if (newuser) {
    try {
      const token = await Jwt.sign(
        {
          _id: newuser._id,
          email: newuser.email,
          Firstname: newuser.Firstname,
          Lastname: newuser.Lastname,
          CfId: newuser.CfId,
          codeCoins: newuser.codeCoins,
        },
        "codeclub4512",
        {
          expiresIn: "7d",
        }
      );

      if (token) {
        console.log(token);
        res.status(200).json({
          success: true,
          message: "User Sreated Successfully",
          data: { newuser, token },
        });
      } else {
        res.json({ success: false, message: "Unsucessfull" });
      }
    } catch {
      console.log("coudnt generate token");
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user) {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      try {
        const token = await Jwt.sign(
          {
            _id: user._id,
            email: user.email,
            Firstname: user.Firstname,
            Lastname: user.Lastname,
            CfId: user.CfId,
            codeCoins: user.codeCoins,
          },
          "codeclub4512",
          { expiresIn: "7d" }
        );
        res.status(200).json({
          success: true,
          message: "User Exists",
          data: {
            user,
            token,
          },
        });
        console.log(user.codeCoins);
        console.log(user.CfId);
      } catch (err) {
        console.error(err);
        res.status(500).json({
          success: false,
          message: "Error generating token",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } else {
    res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const admins = await admin.findOne({ username: username });
    if (!admins) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the password matches
    const isPasswordMatch = await bcrypt.compare(password, admins.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token //
    const token = await Jwt.sign(
      {
        username: admins.username,
        password: admins.password,
      },
      "codeclub4512",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { admins, token },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.body;
  const Password = await bcrypt.hash(password, 10);
  const admins = await admin.create({ username: username, password: Password });
  if (admins) {
    try {
      const token = await Jwt.sign(
        {
          username: admins.username,
          password: admins.password,
        },
        "codeclub4512",
        {
          expiresIn: "7d",
        }
      );
      if (token) {
        console.log(token);
        res.status(200).json({
          success: true,
          message: "User Created Successfully",
          data: { admins, token },
        });
      } else {
        res.json({ success: false, message: "Unsucessfull" });
      }
    } catch {
      console.log("coudnt generate token");
    }
  }
});

app.get("/profile", auth, (req, res) => {
  const userData = req.user;
  console.log(userData.Firstname + " logged in");
  if (userData) {
    res.status(200).json({
      success: true,
      user: userData,
      message: "User authenticated successfully",
    });
  } else {
    res.status(404).json({ success: false });
  }
});

app.post("/admin/Addqotd", async (req, res) => {
  const { qName, qLink, qSolutionTime, qSolution } = req.body;

  try {
    // Find the count of questions
    const questionCount = await Questions.countDocuments({});
    // console.log(questionCount);
    if (questionCount >= 30) {
      // Find the oldest question(s) and delete them based on _id
      const oldestQuestions = await Questions.find(
        {},
        {},
        { sort: { _id: 1 }, limit: questionCount - 29 }
      );
      for (const question of oldestQuestions) {
        await Questions.findByIdAndDelete(question._id);
      }
    }

    // Add the new question
    const qotd = await Questions.create({
      qName,
      qLink,
      qSolutionTime,
      qSolution,
    });

    res.status(200).json({
      success: true,
      message: "Question added successfully",
      data: { qotd },
    });
    console.log(qotd._id + " added successfully");
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/auth", auth, (req, res) => {
  const userData = req.user;
  // console.log(userData.CfId + " logged in");
  res.status(200).json({
    success: true,
    user: userData,
    message: "User authenticated By dashboard",
  });
});

app.get("/adminauth", auth, (req, res) => {
  const adminData = req.user;
  console.log(adminData.CfId + " logged in");
  res.status(200).json({
    success: true,
    user: userData,
    message: "User authenticated By dashboard",
  });
});

app.put(
  "/updateCodeCoins/:id/:contestId/:problemIndex",
  auth,
  async (req, res) => {
    const cfid = req.params.id;
    const contestId = req.params.contestId;
    const problemIndex = req.params.problemIndex;

    const user = await User.findOne({ CfId: cfid });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    const lastClaimTIme = user.lastClaimTIme;
    console.log(lastClaimTIme);
    axios
      .get(
        `https://codeforces.com/api/user.status?handle=${cfid}&problem.contestId=${contestId}&problem.index=${problemIndex}`
      )
      .then((response) => {
        // console.log(res.data);
        const todayDate = new Date();
        if (todayDate.getDate() === lastClaimTIme.getDate()) {
          res.status(401).json({
            success: false,
            message: "Bass kya bhai kitni bar claim karega",
          });
        }
        const results = response.data.result;
        console.log(cfid);
        // console.log(results);
        console.log(results[0].contestId);
        console.log(contestId);
        let solved = false;
        results.map((data) => {
          if (data.contestId == contestId) {
            if (data.verdict === "OK") {
              updateCodeCoins(cfid);
              solved = true;
            }
          }
        });
        if (!solved) {
          res.status(400).json({
            success: false,
            message: "BKL Question Solve Kar",
          });
        }
      })
      .catch((error) => {
        console.error("Error this:", error);
      });

    const updateCodeCoins = async (cfid) => {
      try {
        const user = await User.findOne({ CfId: cfid });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
        user.codeCoins += 10;
        const date = new Date();
        user.lastClaimTIme = date;
        await user.save();

        res.json({
          message: "Codecoins increased successfully",
          newCodecoins: user.codeCoins,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    };
  }
);

app.get("/GetQuestions", async (req, res) => {
  const questions = await Questions.find();
  let myArr = [];
  if (questions.length > 0) {
    for (let i = 0; i < 10; i++) {
      myArr.push(questions[i]);
    }
    res.status(200).json({
      success: true,
      data: myArr,
    });
  }
});

// pm2.connect(function (err) {
//   if (err) {
//     console.error(err);
//     process.exit(2);
//   }
//   pm2.start(
//     {
//       script: "nodemon server.js", // Replace with the filename of your server script
//       name: "my-backend-server", // Name for your server process
//       autorestart: true, // Enable automatic restart
//     },
//     function (err, apps) {
//       pm2.disconnect(); // Disconnect from PM2 once started
//       if (err) throw err;
//     }
//   );
// });

app.post("/addItem", async (req, res) => {
  const { itemImage, itemName, itemDescription, itemPrice, itemQuantity } =
    req.body;

  const item = await items.create({
    itemImage: itemImage,
    itemName: itemName,
    itemDescription: itemDescription,
    itemPrice: itemPrice,
    itemQuantity: itemQuantity,
  });

  if (item) {
    res.status(200).json({
      message: "item added successfully",
      data: item,
      sucess: true,
    });
  } else {
    res.status(404).json({
      message: "something went wrong while creating item",
    });
  }
});

app.get("/getItems", async (req, res) => {
  try {
    const item = await items.find();
    res.status(200).json({
      sucess: true,
      message: "These are the products",
      data: item,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
console.log(process.env.MAIL_PASS);

app.post("/redeemOtp", (req, res) => {
  const { email } = req.body; // OTP is a number

  function generateOTP(length = 6) {
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  const otp = generateOTP(); // Generate OTP

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    },
  });

  async function main() {
    try {
      // Send mail with defined transport object
      const info = await transporter.sendMail({
        from: process.env.MAIL_ID, // sender address
        to: email, // list of receivers
        subject: "Your OTP Code", // Subject line
        text: `Your OTP is: ${otp}`, // plain text body with OTP
        html: `<b>Your OTP is: ${otp}</b>`, // html body with OTP
      });

      console.log("Message sent: %s", info.messageId);
      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        data: otp, // Include OTP in the response
        infoId: info.messageId,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send OTP, please try again",
      });
    }
  }

  main().catch(console.error);
});

app.put("/deductCoins", async (req, res) => {
  const { email, coinsToDeduct } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.codeCoins < coinsToDeduct) {
      return res.status(400).json({
        success: false,
        message: "Insufficient coins",
      });
    }

    user.codeCoins -= coinsToDeduct;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Coins deducted successfully",
      newCodeCoins: user.codeCoins,
    });
  } catch (error) {
    console.error("Error deducting coins:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.listen(9090, () => {
  console.log("server listening on port 9090");
});

//

const genAI = new GoogleGenerativeAI("AIzaSyANCun7o-uSswwxNT6sJA5XAC3njjb1M3g");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
app.post("/generate-response", async (req, res) => {
  try {
    const { prompt, chatHistory } = req.body;
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const users = await User.find();
    const AlluserAttempts = await UserAttempt.find();
    const Tests = await Test.find();

    // Prepare chat context by converting chat history to a string
    const chatContext = chatHistory
      ? chatHistory
          .map(
            (entry) => `${entry.type === "user" ? "User" : "AI"}: ${entry.text}`
          )
          .join("\n")
      : "";

    const result = await chatSession.sendMessage(
      `You are an AI assistant helping with user and test performance analysis.

Chat Context: 
${chatContext}

 For the prompt: "${prompt}"

 Users Data: ${JSON.stringify(users)}
 All User Attempts Data: ${JSON.stringify(AlluserAttempts)}
 This is the data of tests : ${JSON.stringify(Tests)}

 Instructions:
 1. If the prompt asks about a specific user's score:
    - Find the user by ._id user id is present in users data and check for his/her tests data in the All User Attempts Data
    - Locate their test attempts by test._id and always give the subject name and topic name if asked about the tests
    - Extract the relevant score information
    - Provide the output in a clean, plain text format without any markdown or special formatting
    - Avoid using asterisks or other special characters
    - Make the response easy to read and understand

 2. Provide a direct, precise answer based on the exact data provided with more specific details
 3. If the exact information is not available, explain more specifically what information is missing
 4. Be as helpful as possible by providing the most relevant information from the available data
 5. Use the chat context to understand the conversation history
 6. Analyze the prompt in the context of previous messages
 7. Provide a helpful, contextually relevant response
 8. If asking about user performance, use the provided user and attempt data
 9. Respond in a clear, concise, and friendly manner
 10. Ans the greetings like hello and how are you in friendly manner with only greetings 


 Respond in a clean, easy-to-read format that directly addresses the specific question asked.`
    );

    // Remove any markdown or special characters from the response
    const cleanResponse = result.response.text().replace(/\*+/g, "");

    res.json({ response: cleanResponse });
  } catch (error) {
    console.error("Error generating response:", error);
    res
      .status(500)
      .json({ error: "An error occurred while generating the response." });
  }
});
// app.post("/generate-response", async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [],
//     });

//     const users = await User.find();
//     const AlluserAttempts = await UserAttempt.find();

//     const result = await chatSession.sendMessage(
//       `Carefully analyze the provided user and user attempt data to extract specific information.
//       if asked about you ans you are a ai assistant which helps user analysis and help in knowing students better

// For the prompt: "${prompt}"

// User Data: ${JSON.stringify(users)}
// All User Attempts Data: ${JSON.stringify(AlluserAttempts)}

// Instructions:
// 1. If the prompt asks about a specific user's score:
//    - Find the user by ._id
//    - Locate their test attempts by test._id
//    - Extract the relevant score information
//    - dont show info like user id and test id
//    - ans the user questions like hello genrally

// 2. Provide a direct, precise answer based on the exact data provided with more specific
// 3. If the exact information is not available, explain more specifically what information is missing
//  4. Be as helpful as possible by providing the most relevant information from the available data

// Respond in a clear, concise manner that directly addresses the specific question asked.`
//     );

//     res.json({ response: result.response.text() });
//   } catch (error) {
//     console.error("Error generating response:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while generating the response." });
//   }
// });

app.post("/upload/test", async (req, res) => {
  console.log("Request body:", req.body); // Inspect the request body

  // Check if the body contains 'quiz' as an array
  const { quiz } = req.body;
  if (!Array.isArray(quiz)) {
    return res.status(400).json({ error: "Quiz data is invalid" });
  }

  // Validate each question in the quiz
  quiz.forEach((question, index) => {
    if (
      !question.question ||
      !Array.isArray(question.options) ||
      !question.correctAnswer
    ) {
      return res.status(400).json({
        error: `Question ${index + 1} data is invalid`,
      });
    }

    if (question.options.length < 2) {
      return res.status(400).json({
        error: `Question ${index + 1} must have at least two options`,
      });
    }
  });

  // Create a new quiz document
  const newQuiz = new Test({
    subject: req.body.subject,
    topic: req.body.topic,
    quiz: req.body.quiz,
  });

  try {
    // Save the quiz to the database
    await newQuiz.save();
    res.status(200).json({ message: "Quiz submitted successfully" });
  } catch (error) {
    console.error("Error saving quiz to database:", error);
    res.status(500).json({ error: "Error saving quiz to database" });
  }
});
app.post("/generate-questions", async (req, res) => {
  try {
    const { subject, topic } = req.body;

    // Start a chat session with the Gemini API
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: 'Generate 10 multiple-choice questions for the subject "${subject}" on the topic "${topic}". Each question should include:\n      1. A clear and concise question.\n      2. Four answer options labeled A, B, C, and D.\n      3. One correct answer clearly identified.\n      4.new questions every time when asked\n\n      Respond with a valid JSON array in the following format:\n      [\n        {\n          "question": "Question text",\n          "options": ["Option A", "Option B", "Option C", "Option D"],\n          "correctAnswer": "Option A"\n        },\n        ...\n      ]\n      Ensure your response contains only the JSON array with no additional text or formatting.',
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: '```json\n[\n  {\n    "question": "What is the primary function of the mitochondria?",\n    "options": ["Protein synthesis", "Cellular respiration", "Waste removal", "DNA replication"],\n    "correctAnswer": "Cellular respiration"\n  },\n  {\n    "question": "Which of the following is NOT a type of RNA?",\n    "options": ["mRNA", "tRNA", "rRNA", "dRNA"],\n    "correctAnswer": "dRNA"\n  },\n  {\n    "question": "What is the name of the process by which plants convert light energy into chemical energy?",\n    "options": ["Respiration", "Photosynthesis", "Chemosynthesis", "Transpiration"],\n    "correctAnswer": "Photosynthesis"\n  },\n  {\n    "question": "Which type of cell lacks a nucleus?",\n    "options": ["Eukaryotic cell", "Prokaryotic cell", "Plant cell", "Animal cell"],\n    "correctAnswer": "Prokaryotic cell"\n  },\n  {\n    "question": "What is the basic unit of heredity?",\n    "options": ["Chromosome", "Gene", "Protein", "Nucleus"],\n    "correctAnswer": "Gene"\n  },\n  {\n    "question": "What process creates genetically identical offspring?",\n    "options": ["Meiosis", "Mitosis", "Fertilization", "Mutation"],\n    "correctAnswer": "Mitosis"\n  },\n  {\n    "question": "What is the term for the diffusion of water across a selectively permeable membrane?",\n    "options": ["Osmosis", "Diffusion", "Active transport", "Facilitated diffusion"],\n    "correctAnswer": "Osmosis"\n  },\n  {\n    "question": "Which organelle is responsible for modifying and packaging proteins?",\n    "options": ["Ribosomes", "Endoplasmic reticulum", "Golgi apparatus", "Lysosomes"],\n    "correctAnswer": "Golgi apparatus"\n  },\n  {\n    "question": "What is the name of the process where a cell engulfs a large particle?",\n    "options": ["Exocytosis", "Endocytosis", "Pinocytosis", "Phagocytosis"],\n    "correctAnswer": "Phagocytosis"\n  },\n  {\n    "question": "What are the building blocks of proteins?",\n    "options": ["Nucleotides", "Sugars", "Fatty acids", "Amino acids"],\n    "correctAnswer": "Amino acids"\n  }\n]\n```\n',
            },
          ],
        },
      ],
    });

    // Construct the prompt to generate questions
    const prompt = `
      Generate 10 multiple-choice questions for the subject "${subject}" on the topic "${topic}". Each question should include:
    `;

    // Send the prompt to the Gemini API
    const result = await chatSession.sendMessage(prompt);

    // Log the raw response for debugging
    console.log("Raw API Response:", result.response.text());

    // Extract and sanitize JSON from the response
    const rawText = result.response.text();
    const jsonMatch = rawText.match(/\[.*\]/s); // Match anything between square brackets

    if (!jsonMatch) {
      throw new Error("No JSON array found in the response.");
    }

    const questions = JSON.parse(jsonMatch[0]); // Parse the matched JSON array

    // Return the questions as JSON response
    res.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while generating questions." });
  }
});

app.get("/api/tests", async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tests" });
  }
});
// app.post("/api/userAttempts", async (req, res) => {
//   try {
//     const { userId, testId, score, totalQuestions, userAnswers } = req.body;
//     const newAttempt = new UserAttempt({
//       userId,
//       testId,
//       score,
//       totalQuestions,
//       userAnswers,
//     });
//     await newAttempt.save();
//     res.status(201).send("User attempt saved successfully.");
//   } catch (error) {
//     console.error("Error saving user attempt:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.post("/generate-responses", async (req, res) => {
//   try {
//     const { testId, userAnswers } = req.body;
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [],
//     });

//     console.log("Received testId:", req.body.testId);

//     // Clean testId
//     const testID = req.body.testId?.trim(); // Remove leading/trailing spaces
//     console.log("Cleaned testId:", testID);

//     // Query the database with the cleaned testId
//     const DbTest = await Test.findOne({ _id: testID });
//     if (!DbTest) {
//       return res.status(404).json({ error: "Test not found" });
//     }
//     console.log("Test found:", DbTest);

//     const prompt = `
// topic : ${DbTest.topic}
// NOTE : GIVE ME THE RESPONSE IN JSON FORMAT
// RESPONSE :
// QUESTION : ${DbTest.quiz.question}
// OPTIONS : ${DbTest.quiz.options}
// CORRECTANS : ${DbTest.quiz.correctAnswer}
// USERANS : ${JSON.stringify(userAnswers)}
// DESCRIPTION OR EXPLANATION : // if ${userAnswers} does not match ${
//       DbTest.quiz.correctAnswer
//     } ans
// and if matches say you are correct
// `;

//     const result = await chatSession.sendMessage(prompt);

//     res.json({ response: result.response.text() });
//   } catch (error) {
//     console.error("Error generating response:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while generating the response." });
//   }
// });

// app.post("/generate-responses", async (req, res) => {
//   try {
//     const { testId, userAnswers } = req.body;

//     // Validate input
//     if (!testId || !Array.isArray(userAnswers)) {
//       return res.status(400).json({
//         error: "Invalid input. Provide a valid testId and userAnswers array.",
//       });
//     }

//     console.log("Received testId:", testId);

//     // Clean testId
//     const cleanTestId = testId.trim(); // Remove leading/trailing spaces
//     console.log("Cleaned testId:", cleanTestId);

//     // Query the database
//     const DbTest = await Test.findOne({ _id: cleanTestId });
//     if (!DbTest) {
//       return res.status(404).json({ error: "Test not found" });
//     }
//     console.log("Test found:", DbTest);

//     // Prepare the quiz data with explanation
//     const quizDetails = DbTest.quiz.map((q, index) => {
//       const userAnswer = userAnswers.find(
//         (ua) => ua.questionIndex === index
//       )?.selectedAnswer;
//       const isCorrect = userAnswer === q.correctAnswer;
//       const explanation = isCorrect
//         ? `You are correct! The answer to "${q.question}" is "${q.correctAnswer}".`
//         : `You are incorrect. The correct answer to "${q.question}" is "${q.correctAnswer}".`;

//       return {
//         question: q.question,
//         options: q.options,
//         correctAnswer: q.correctAnswer,
//         userAnswer: userAnswer || "No answer provided",
//         isCorrect,
//         explanation,
//       };
//     });

//     // Generate the prompt
//     const prompt = `
//     topic : ${DbTest.topic}
//     NOTE : GIVE ME THE RESPONSE IN JSON FORMAT
//     RESPONSE :
//     ${JSON.stringify(quizDetails, null, 2)}
//     `;

//     // Initialize chat session and send the message
//     const chatSession = model.startChat({ generationConfig, history: [] });
//     const result = await chatSession.sendMessage(prompt);

//     const rawText = result.response.text();
//     const jsonMatch = rawText.match(/\[.*\]/s);
//     const questions = JSON.parse(jsonMatch[0]);

//     // Return the generated response
//     res.json({ response: questions });
//   } catch (error) {
//     console.error("Error generating response:", error);

//     // Enhanced error handling
//     if (error instanceof mongoose.Error.ValidationError) {
//       res.status(400).json({ error: "Validation error in request data." });
//     } else if (error instanceof mongoose.Error.CastError) {
//       res.status(400).json({ error: "Invalid testId format." });
//     } else {
//       res.status(500).json({ error: "An internal server error occurred." });
//     }
//   }
// });

// Endpoint to check if the user has attempted the quiz
app.post("/check-attempt", async (req, res) => {
  try {
    const { userId, testId } = req.body;

    // Validate input
    if (!userId || !testId) {
      return res.status(400).json({ error: "userId and testId are required." });
    }

    // Query the database
    const userAttempt = await UserAttempt.findOne({ userId, testId });

    if (userAttempt) {
      // User has attempted the quiz
      return res.json({
        attempted: true,
        message: "User has attempted the quiz.",
        attemptDetails: userAttempt,
      });
    }

    // User has not attempted the quiz
    res.json({
      attempted: false,
      message: "User has not attempted the quiz.",
    });
  } catch (error) {
    console.error("Error checking user attempt:", error);

    // Enhanced error handling
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: "Validation error in request data." });
    } else if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ error: "Invalid userId or testId format." });
    } else {
      res.status(500).json({ error: "An internal server error occurred." });
    }
  }
});

app.post("/api/userAttempts", async (req, res) => {
  try {
    const { userId, testId, score, totalQuestions, userAnswers } = req.body;

    // Validate request body
    if (
      !userId ||
      !testId ||
      !score ||
      !totalQuestions ||
      !Array.isArray(userAnswers)
    ) {
      return res.status(400).json({ error: "Invalid input data." });
    }

    // Validate userAnswers structure
    for (const answer of userAnswers) {
      if (
        typeof answer.questionIndex !== "number" ||
        typeof answer.selectedAnswer !== "string" ||
        typeof answer.description !== "string"
      ) {
        return res.status(400).json({ error: "Invalid userAnswers format." });
      }
    }

    // Create a new user attempt instance
    const newAttempt = new UserAttempt({
      userId,
      testId,
      score,
      totalQuestions,
      userAnswers,
    });

    // Save to the database
    await newAttempt.save();

    res.status(201).json({ message: "User attempt saved successfully." });
  } catch (error) {
    console.error("Error saving user attempt:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.post("/generate-responses", async (req, res) => {
  try {
    const { userId, testId, userAnswers } = req.body;
    // console.log(req.body);

    // Input validation
    if (!userId || !testId || !Array.isArray(userAnswers)) {
      return res.status(400).json({
        error:
          "Invalid input. Provide a valid userId, testId, and userAnswers array.",
      });
    }

    console.log("Received request with testId:", testId);

    // Clean and validate testId
    const cleanTestId = testId.trim();
    if (!mongoose.Types.ObjectId.isValid(cleanTestId)) {
      return res.status(400).json({ error: "Invalid testId format." });
    }

    // Fetch the test from the database
    const DbTest = await Test.findOne({ _id: cleanTestId }).lean();
    if (!DbTest) {
      return res.status(404).json({ error: "Test not found." });
    }
    console.log("Test retrieved:", DbTest);

    // Prepare quiz details
    const quizDetails = DbTest.quiz.map((q, index) => {
      const userAnswer = userAnswers.find(
        (ua) => ua.questionIndex === index
      )?.selectedAnswer;
      const isCorrect = userAnswer === q.correctAnswer;
      const explanation = isCorrect
        ? `You are correct! The answer to "${q.question}" is "${q.correctAnswer}".`
        : `You are incorrect. The correct answer to "${q.question}" is "${q.correctAnswer}".`;

      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: userAnswer || "No answer provided",
        isCorrect,
        explanation,
      };
    });

    // Generate the prompt
    const prompt = `
      Topic: ${DbTest.topic}
      NOTE: Respond in JSON format.
      Data: ${JSON.stringify(quizDetails, null, 2)}
    `;

    try {
      // Chat model interaction
      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(prompt);

      // Extract JSON response
      const rawText = result.response.text();
      const jsonMatch = rawText.match(/\[.*\]/s);
      const questions = JSON.parse(jsonMatch?.[0] || "[]");

      console.log("Generated response:", questions);

      // Calculate score
      const score = quizDetails.filter((q) => q.isCorrect).length;
      console.log(score);

      const totalQuestions = quizDetails.length;

      // Add explanations to user answers
      const enhancedUserAnswers = userAnswers.map((ua) => {
        const matchingQuiz = quizDetails[ua.questionIndex];
        return {
          ...ua,
          description: matchingQuiz
            ? matchingQuiz.explanation
            : "No explanation available",
        };
      });

      // Save the user attempt
      const newAttempt = new UserAttempt({
        userId,
        testId,
        score,
        totalQuestions,
        userAnswers: enhancedUserAnswers,
      });
      await newAttempt.save();

      // Respond with success and generated data
      res.status(201).json({
        message: "Response generated and user attempt saved successfully.",
        response: questions,
      });
    } catch (modelError) {
      console.error("Error during chat model interaction:", modelError);
      res
        .status(500)
        .json({ error: "Failed to process the chat model response." });
    }
  } catch (error) {
    console.error("Error generating response and saving attempt:", error);

    // Detailed error responses
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: "Validation error in request data." });
    } else if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ error: "Invalid testId format." });
    } else {
      res.status(500).json({ error: "An internal server error occurred." });
    }
  }
});

// app.post("/generate-responses", async (req, res) => {
//   try {
//     const { userId, testId, userAnswers } = req.body;

//     // Input validation
//     if (!userId || !testId || !Array.isArray(userAnswers)) {
//       return res.status(400).json({
//         error:
//           "Invalid input. Provide a valid userId, testId, and userAnswers array.",
//       });
//     }

//     console.log("Received request with testId:", testId);

//     // Clean and validate testId
//     const cleanTestId = testId.trim();
//     if (!mongoose.Types.ObjectId.isValid(cleanTestId)) {
//       return res.status(400).json({ error: "Invalid testId format." });
//     }

//     // Fetch the test from the database
//     const DbTest = await Test.findOne({ _id: cleanTestId }).lean();
//     if (!DbTest) {
//       return res.status(404).json({ error: "Test not found." });
//     }
//     console.log("Test retrieved:", DbTest);

//     // Prepare quiz details
//     const quizDetails = DbTest.quiz.map((q, index) => {
//       const userAnswer = userAnswers.find(
//         (ua) => ua.questionIndex === index
//       )?.selectedAnswer;
//       const isCorrect = userAnswer === q.correctAnswer;
//       const explanation = isCorrect
//         ? `You are correct! The answer to "${q.question}" is "${q.correctAnswer}".`
//         : `You are incorrect. The correct answer to "${q.question}" is "${q.correctAnswer}".`;

//       return {
//         question: q.question,
//         options: q.options,
//         correctAnswer: q.correctAnswer,
//         userAnswer: userAnswer || "No answer provided",
//         isCorrect,
//         explanation,
//       };
//     });

//     // Generate the prompt
//     const prompt = `
//       Topic: ${DbTest.topic}
//       NOTE: Respond in JSON format with an array of detailed explanations.
//       Data: ${JSON.stringify(quizDetails, null, 2)}

//       For each question, provide:
//       1. A detailed explanation of why the correct answer is right
//       2. Additional context or interesting information related to the question
//       3. Ensure the response is in a parseable JSON format
//     `;

//     try {
//       // Gemini model interaction
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//       const result = await model.generateContent(prompt);
//       const response = await result.response.text();

//       // Parse the JSON response
//       let questions;
//       try {
//         // Extract JSON from the response
//         const jsonMatch = response.match(/\[.*\]/s);
//         questions = JSON.parse(jsonMatch?.[0] || "[]");
//       } catch (parseError) {
//         console.error("Error parsing JSON response:", parseError);
//         return res
//           .status(500)
//           .json({ error: "Failed to parse model response." });
//       }

//       console.log("Generated response:", questions);

//       // Calculate score
//       const score = quizDetails.filter((q) => q.isCorrect).length;
//       const totalQuestions = quizDetails.length;

//       // Add explanations to user answers
//       const enhancedUserAnswers = userAnswers.map((ua) => {
//         const matchingQuiz = quizDetails[ua.questionIndex];
//         return {
//           ...ua,
//           description: matchingQuiz
//             ? matchingQuiz.explanation
//             : "No explanation available",
//           detailedExplanation:
//             questions[ua.questionIndex]?.detailedExplanation ||
//             "No detailed explanation available",
//           additionalContext:
//             questions[ua.questionIndex]?.additionalContext ||
//             "No additional context available",
//         };
//       });

//       // Save the user attempt
//       const newAttempt = new UserAttempt({
//         userId,
//         testId,
//         score,
//         totalQuestions,
//         userAnswers: enhancedUserAnswers,
//         generatedResponses: questions,
//       });

//       // Save the attempt and handle potential errors
//       try {
//         await newAttempt.save();
//         console.log("User attempt saved successfully");
//       } catch (saveError) {
//         console.error("Error saving user attempt:", saveError);
//         // You might want to add more specific error handling here
//         return res.status(500).json({
//           error: "Failed to save user attempt",
//           details: saveError.message,
//         });
//       }

//       // Respond with success and generated data
//       res.status(201).json({
//         message: "Response generated and user attempt saved successfully.",
//         response: questions,
//         score,
//       });
//     } catch (modelError) {
//       console.error("Error during Gemini model interaction:", modelError);
//       res
//         .status(500)
//         .json({ error: "Failed to process the Gemini model response." });
//     }
//   } catch (error) {
//     console.error("Error generating response and saving attempt:", error);

//     // Detailed error responses
//     if (error.name === "ValidationError") {
//       res.status(400).json({ error: "Validation error in request data." });
//     } else if (error.name === "CastError") {
//       res.status(400).json({ error: "Invalid testId format." });
//     } else {
//       res
//         .status(500)
//         .json({
//           error: "An internal server error occurred.",
//           details: error.message,
//         });
//     }
//   }
// });
