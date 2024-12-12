// /* The above code is a React component called `UploadTest` that serves as a quiz creation tool for
// teachers. Here is a summary of what the code does: */
// //
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import AdminNavbar from "./Admin_components/AdminNavbar";
// import Unauthorized from "./UnAuthorised";
// import axios from "axios";

// export default function UploadTest() {
//   const [quizType, setQuizType] = useState("ai");
//   const [subject, setSubject] = useState("");
//   const [topic, setTopic] = useState("");
//   const [customQuestion, setCustomQuestion] = useState("");
//   const [customOptions, setCustomOptions] = useState(["", "", "", ""]);
//   const [customCorrectAnswer, setCustomCorrectAnswer] = useState(null);
//   const [quiz, setQuiz] = useState([]);
//   const token = localStorage.getItem("authToken");

//   const subjects = [
//     "Advanced Java",
//     "Cyber Security",
//     "Mobile Application Development",
//     "Big Data Analytics",
//     "Cloud Computing",
//     "Architecture",
//   ];

//   const addCustomQuestion = () => {
//     if (
//       customQuestion &&
//       customOptions.every((option) => option) &&
//       customCorrectAnswer !== null
//     ) {
//       const correctAnswerText = customOptions[customCorrectAnswer];

//       setQuiz([
//         ...quiz,
//         {
//           question: customQuestion,
//           options: customOptions,
//           correctAnswer: correctAnswerText,
//           subject: subject,
//           topic: topic,
//         },
//       ]);
//       setCustomQuestion("");
//       setCustomOptions(["", "", "", ""]);
//       setCustomCorrectAnswer(null);
//     }
//   };

//   const handleCustomOptionChange = (index, value) => {
//     const newOptions = [...customOptions];
//     newOptions[index] = value;
//     setCustomOptions(newOptions);
//   };

//   const handleSubmitQuiz = async () => {
//     if (quizType === "ai") {
//       try {
//         const response = await axios.post(
//           "http://localhost:9090/generate-questions",
//           { subject, topic }
//         );
//         const aiQuestions = response.data.questions.map((q) => ({
//           ...q,
//           subject: subject,
//           topic: topic,
//         }));

//         // Update the quiz state with AI-generated questions
//         setQuiz(aiQuestions);
//         console.log(aiQuestions);
//       } catch (error) {
//         console.error("Error generating AI quiz:", error);
//       }
//     }

//     try {
//       const response = await axios.post("http://localhost:9090/upload/test", {
//         subject,
//         topic,
//         quiz,
//       });
//       console.log("Quiz submitted successfully:", response.data);
//     } catch (error) {
//       console.error("Error submitting quiz:", error);
//     }
//   };

//   if (!token) {
//     return (
//       <div>
//         <Unauthorized />
//       </div>
//     );
//   }

//   return (
//     <>
//       <AdminNavbar />
//       <div className="min-h-screen flex flex-col bg-white pb-20">
//         <h1 className="text-3xl font-bold mb-6 text-center pt-8 text-[#A94442]">
//           Teacher Quiz Creator
//         </h1>
//         <div className="flex flex-1 gap-4 p-4">
//           <div className="w-1/2 flex flex-col gap-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-[#A94442]">
//                   Quiz Creation Method
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Select onValueChange={(value) => setQuizType(value)}>
//                   <SelectTrigger className="focus:border-[#A94442] focus:ring-0 focus:ring-offset-0 text-[#A94442]">
//                     <SelectValue
//                       placeholder="Select quiz creation method"
//                       className="text-[#A94442]"
//                     />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ai">Generate Quiz by AI</SelectItem>
//                     <SelectItem value="custom">Create Custom Quiz</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </CardContent>
//             </Card>
//             <Card className="flex-1 flex flex-col">
//               <CardHeader>
//                 <CardTitle className="text-[#A94442]">
//                   {quizType === "ai"
//                     ? "AI Quiz Generation"
//                     : "Custom Quiz Creation"}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="flex-1 overflow-hidden">
//                 {quizType === "ai" ? (
//                   <div className="space-y-4">
//                     <Select value={subject} onValueChange={setSubject}>
//                       <SelectTrigger className="focus:border-[#A94442] focus:ring-0 focus:ring-offset-0 text-[#A94442]">
//                         <SelectValue placeholder="Select subject" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {subjects.map((subjectOption, index) => (
//                           <SelectItem key={index} value={subjectOption}>
//                             {subjectOption}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <Input
//                       type="text"
//                       value={topic}
//                       onChange={(e) => setTopic(e.target.value)}
//                       placeholder="Enter topic name"
//                       className="focus:outline-none focus:ring-0 focus:ring-offset-0"
//                     />
//                     <Button
//                       onClick={handleSubmitQuiz}
//                       disabled={!subject || !topic}
//                       className="w-full bg-[#A94442] hover:bg-[#923A38] text-white"
//                     >
//                       Generate AI Quiz
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 gap-4">
//                     <div className="space-y-4">
//                       <Select value={subject} onValueChange={setSubject}>
//                         <SelectTrigger className="focus:border-[#A94442] focus:ring-0 focus:ring-offset-0 text-[#A94442]">
//                           <SelectValue placeholder="Select subject" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {subjects.map((subjectOption, index) => (
//                             <SelectItem key={index} value={subjectOption}>
//                               {subjectOption}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <Input
//                         type="text"
//                         value={topic}
//                         onChange={(e) => setTopic(e.target.value)}
//                         placeholder="Enter topic name"
//                         className="focus:outline-none focus:ring-0 focus:ring-offset-0"
//                       />
//                     </div>
//                     <div className="space-y-4 pr-2">
//                       <Textarea
//                         value={customQuestion}
//                         onChange={(e) => setCustomQuestion(e.target.value)}
//                         placeholder="Enter question"
//                         className="min-h-[100px] focus:outline-none focus:ring-0 focus:ring-offset-0"
//                       />
//                       {customOptions.map((option, index) => (
//                         <Input
//                           key={index}
//                           type="text"
//                           value={option}
//                           onChange={(e) =>
//                             handleCustomOptionChange(index, e.target.value)
//                           }
//                           placeholder={`Option ${index + 1}`}
//                           className="focus:outline-none focus:ring-0 focus:ring-offset-0"
//                         />
//                       ))}
//                       <RadioGroup
//                         value={customCorrectAnswer?.toString()}
//                         onValueChange={(value) =>
//                           setCustomCorrectAnswer(parseInt(value))
//                         }
//                         className="space-y-2"
//                       >
//                         {customOptions.map((_, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center space-x-3"
//                           >
//                             <RadioGroupItem
//                               value={index.toString()}
//                               id={`option-${index}`}
//                             />
//                             <Label htmlFor={`option-${index}`}>
//                               Correct Answer: Option {index + 1}
//                             </Label>
//                           </div>
//                         ))}
//                       </RadioGroup>
//                     </div>
//                     <Button
//                       onClick={addCustomQuestion}
//                       disabled={
//                         !customQuestion ||
//                         !customOptions.every((option) => option) ||
//                         customCorrectAnswer === null ||
//                         !subject ||
//                         !topic
//                       }
//                       className="w-full bg-[#A94442] hover:bg-[#923A38] text-white"
//                     >
//                       Add Custom Question
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//           <Card className="w-1/2 flex flex-col">
//             <CardHeader>
//               <CardTitle className="text-[#A94442]">Quiz Preview</CardTitle>
//             </CardHeader>
//             <CardContent className="flex-grow overflow-y-auto max-h-[calc(100vh-300px)] h-full">
//               <div className="overflow-y-auto max-h-full pr-2">
//                 {quiz.length === 0 ? (
//                   <p className="text-gray-500">No questions added yet.</p>
//                 ) : (
//                   <div className="space-y-4">
//                     {quiz.map((q, index) => (
//                       <Card key={index} className="border-l-4 border-[#A94442]">
//                         <CardContent className="pt-4">
//                           <p className="font-bold mb-2">
//                             Question {index + 1}: {q.question}
//                           </p>
//                           <p className="text-gray-600 mb-2">
//                             Subject: {q.subject}
//                           </p>
//                           <p className="text-gray-600 mb-2">Topic: {q.topic}</p>
//                           <ul className="space-y-1">
//                             {q.options.map((option, optionIndex) => (
//                               <li
//                                 key={optionIndex}
//                                 className={`p-1 rounded ${
//                                   option === q.correctAnswer
//                                     ? "bg-green-100 text-green-900 font-semibold"
//                                     : "bg-gray-100"
//                                 }`}
//                               >
//                                 {option}
//                               </li>
//                             ))}
//                           </ul>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//             <div className="p-4 flex justify-end">
//               <Button
//                 onClick={handleSubmitQuiz}
//                 disabled={quiz.length < 10}
//                 className="bg-[#A94442] hover:bg-[#923A38] text-white px-4 py-2 text-sm"
//               >
//                 Submit Quiz
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminNavbar from "./Admin_components/AdminNavbar";
import Unauthorized from "./UnAuthorised";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function UploadTest() {
  const [quizType, setQuizType] = useState("ai");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [customOptions, setCustomOptions] = useState(["", "", "", ""]);
  const [customCorrectAnswer, setCustomCorrectAnswer] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const token = localStorage.getItem("authToken");

  const subjects = [
    "Advanced Java",
    "Cyber Security",
    "Mobile Application Development",
    "Big Data Analytics",
    "Cloud Computing",
    "Architecture",
  ];

  const addCustomQuestion = () => {
    if (
      customQuestion &&
      customOptions.every((option) => option) &&
      customCorrectAnswer !== null
    ) {
      const correctAnswerText = customOptions[customCorrectAnswer];

      setQuiz([
        ...quiz,
        {
          question: customQuestion,
          options: customOptions,
          correctAnswer: correctAnswerText,
          subject: subject,
          topic: topic,
        },
      ]);
      setCustomQuestion("");
      setCustomOptions(["", "", "", ""]);
      setCustomCorrectAnswer(null);
    }
  };

  const handleCustomOptionChange = (index, value) => {
    const newOptions = [...customOptions];
    newOptions[index] = value;
    setCustomOptions(newOptions);
  };

  const handleGenerateAIQuiz = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(
        "http://localhost:9090/generate-questions",
        { subject, topic }
      );
      const aiQuestions = response.data.questions.map((q) => ({
        ...q,
        subject: subject,
        topic: topic,
      }));

      setQuiz(aiQuestions);
      console.log(aiQuestions);
    } catch (error) {
      console.error("Error generating AI quiz:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:9090/upload/test", {
        subject,
        topic,
        quiz,
      });
      console.log("Quiz submitted successfully:", response.data);
      setSubmitSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div>
        <Unauthorized />
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h1 className="text-3xl font-bold text-[#A94442]">
          Quiz submitted successfully!
        </h1>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen flex flex-col bg-white pb-20">
        <h1 className="text-3xl font-bold mb-6 text-center pt-8 text-[#A94442]">
          Teacher Quiz Creator
        </h1>
        <div className="flex flex-1 gap-4 p-4">
          <div className="w-1/2 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#A94442]">
                  Quiz Creation Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={(value) => setQuizType(value)}>
                  <SelectTrigger className="focus:border-[#A94442] focus:ring-0 focus:ring-offset-0 text-[#A94442]">
                    <SelectValue
                      placeholder="Select quiz creation method"
                      className="text-[#A94442]"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">Generate Quiz by AI</SelectItem>
                    <SelectItem value="custom">Create Custom Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-[#A94442]">
                  {quizType === "ai"
                    ? "AI Quiz Generation"
                    : "Custom Quiz Creation"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                {quizType === "ai" ? (
                  <div className="space-y-4">
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="focus:border-[#A94442] focus:ring-0 focus:ring-offset-0 text-[#A94442]">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subjectOption, index) => (
                          <SelectItem key={index} value={subjectOption}>
                            {subjectOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter topic name"
                      className="focus:outline-none focus:ring-0 focus:ring-offset-0"
                    />
                    <Button
                      onClick={handleGenerateAIQuiz}
                      disabled={!subject || !topic || isGenerating}
                      className="w-full bg-[#A94442] hover:bg-[#923A38] text-white"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate AI Quiz"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-4">
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="focus:border-[#A94442] focus:ring-0 focus:ring-offset-0 text-[#A94442]">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subjectOption, index) => (
                            <SelectItem key={index} value={subjectOption}>
                              {subjectOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter topic name"
                        className="focus:outline-none focus:ring-0 focus:ring-offset-0"
                      />
                    </div>
                    <div className="space-y-4 pr-2">
                      <Textarea
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        placeholder="Enter question"
                        className="min-h-[100px] focus:outline-none focus:ring-0 focus:ring-offset-0"
                      />
                      {customOptions.map((option, index) => (
                        <Input
                          key={index}
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleCustomOptionChange(index, e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                          className="focus:outline-none focus:ring-0 focus:ring-offset-0"
                        />
                      ))}
                      <RadioGroup
                        value={customCorrectAnswer?.toString()}
                        onValueChange={(value) =>
                          setCustomCorrectAnswer(parseInt(value))
                        }
                        className="space-y-2"
                      >
                        {customOptions.map((_, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <RadioGroupItem
                              value={index.toString()}
                              id={`option-${index}`}
                            />
                            <Label htmlFor={`option-${index}`}>
                              Correct Answer: Option {index + 1}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <Button
                      onClick={addCustomQuestion}
                      disabled={
                        !customQuestion ||
                        !customOptions.every((option) => option) ||
                        customCorrectAnswer === null ||
                        !subject ||
                        !topic
                      }
                      className="w-full bg-[#A94442] hover:bg-[#923A38] text-white"
                    >
                      Add Custom Question
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <Card className="w-1/2 flex flex-col">
            <CardHeader>
              <CardTitle className="text-[#A94442]">Quiz Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto max-h-[calc(100vh-300px)] h-full">
              <div className="overflow-y-auto max-h-full pr-2">
                {quiz.length === 0 ? (
                  <p className="text-gray-500">No questions added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {quiz.map((q, index) => (
                      <Card key={index} className="border-l-4 border-[#A94442]">
                        <CardContent className="pt-4">
                          <p className="font-bold mb-2">
                            Question {index + 1}: {q.question}
                          </p>
                          <p className="text-gray-600 mb-2">
                            Subject: {q.subject}
                          </p>
                          <p className="text-gray-600 mb-2">Topic: {q.topic}</p>
                          <ul className="space-y-1">
                            {q.options.map((option, optionIndex) => (
                              <li
                                key={optionIndex}
                                className={`p-1 rounded ${
                                  option === q.correctAnswer
                                    ? "bg-green-100 text-green-900 font-semibold"
                                    : "bg-gray-100"
                                }`}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <div className="p-4 flex justify-end">
              <Button
                onClick={handleSubmitQuiz}
                disabled={quiz.length < 10 || isSubmitting}
                className="bg-[#A94442] hover:bg-[#923A38] text-white px-4 py-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Quiz"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
