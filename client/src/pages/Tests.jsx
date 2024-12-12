// "use client";

// import { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import Navbar from "@/components/Navbar";
// import { ChevronRightIcon } from "@heroicons/react/24/solid";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Legend,
//   Tooltip,
// } from "recharts";
// import { CheckCircle, XCircle, Calendar } from "lucide-react";
// import {
//   Tooltip as TooltipComponent,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

// const COLORS = ["#A94442", "#FFA07A"];

// const TestResultsDonutChart = ({ score, totalQuestions }) => {
//   const data = [
//     { name: "Correct", value: score },
//     { name: "Incorrect", value: totalQuestions * 10 - score },
//   ];

//   const percentage = Math.round((score / (totalQuestions * 10)) * 100);

//   return (
//     <Card className="w-full max-w-3xl mx-auto mb-8">
//       <CardHeader>
//         <CardTitle className="text-2xl font-semibold text-[#A94442] text-center">
//           Test Results
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col items-center">
//           <div className="text-4xl font-bold text-[#A94442] mb-4">
//             {percentage}%
//           </div>
//           <div className="text-lg text-gray-600 mb-6">
//             Score: {score} out of {totalQuestions * 10}
//           </div>
//           <div className="w-full h-[400px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={data}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius="60%"
//                   outerRadius="80%"
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {data.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend verticalAlign="bottom" height={36} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const DetailedTestResults = ({ results }) => {
//   if (!results || results.length === 0) {
//     return <div>No results available</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <h3 className="text-2xl font-bold text-[#A94442] mb-4">
//         Detailed Results
//       </h3>
//       {results.map((result, index) => (
//         <Card
//           key={index}
//           className={result.isCorrect ? "border-green-500" : "border-red-500"}
//         >
//           <CardHeader>
//             <CardTitle className="flex items-center text-lg">
//               {result.isCorrect ? (
//                 <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
//               ) : (
//                 <XCircle className="w-6 h-6 text-red-500 mr-2" />
//               )}
//               Question {index + 1}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="mb-2">
//               <strong>Question:</strong> {result.question}
//             </p>
//             <p className="mb-2">
//               <strong>Your Answer:</strong> {result.userAnswer}
//             </p>
//             <p className="mb-2">
//               <strong>Correct Answer:</strong> {result.correctAnswer}
//             </p>
//             <p className="mt-4">
//               <strong>Explanation:</strong> {result.explanation}
//             </p>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// const AttemptInfo = ({ attemptDate }) => {
//   return (
//     <Card className="w-full max-w-3xl mx-auto mb-8">
//       <CardContent className="flex items-center justify-center p-4">
//         <Calendar className="w-6 h-6 mr-2 text-[#A94442]" />
//         <span className="text-lg font-semibold">
//           Attempted on: {new Date(attemptDate).toLocaleString()}
//         </span>
//       </CardContent>
//     </Card>
//   );
// };

// const LoadingText = () => {
//   const [dots, setDots] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDots((prevDots) => (prevDots + 1) % 4);
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="text-2xl font-bold text-[#A94442] text-center">
//       {"Evaluating the results".split("").map((char, index) => (
//         <span
//           key={index}
//           className="inline-block transition-opacity duration-1000"
//           style={{
//             opacity: 1 - (index / "Evaluating the results".length) * 0.8,
//           }}
//         >
//           {char}
//         </span>
//       ))}
//       <span className="inline-block w-6">{".".repeat(dots)}</span>
//     </div>
//   );
// };

// const TestPage = () => {
//   const [tests, setTests] = useState([]);
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [testSubmitted, setTestSubmitted] = useState(false);
//   const [score, setScore] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);
//   const [detailedResults, setDetailedResults] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const authToken = localStorage.getItem("authToken");

//   const fetchTests = useCallback(async () => {
//     if (!userProfile) {
//       console.error("User profile is not available");
//       return;
//     }

//     try {
//       const response = await axios.get("http://localhost:9090/api/tests");
//       const testsData = response.data;

//       const testsWithAttempts = await Promise.all(
//         testsData.map(async (test) => {
//           const attemptResponse = await axios.post(
//             "http://localhost:9090/check-attempt",
//             {
//               userId: userProfile._id,
//               testId: test._id,
//             }
//           );
//           console.log(attemptResponse.data);
//           return { ...test, attempt: attemptResponse.data };
//         })
//       );

//       setTests(testsWithAttempts);
//     } catch (error) {
//       console.error("Failed to fetch tests", error);
//     }
//   }, [userProfile]);

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await axios.get("http://localhost:9090/profile", {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         });

//         if (response.status === 200) {
//           setUserProfile(response.data.user);
//         } else {
//           console.log("Error: " + response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       }
//     };

//     if (authToken && !userProfile) {
//       fetchProfileData();
//     }

//     if (userProfile) {
//       fetchTests();
//     }
//   }, [authToken, userProfile, fetchTests]);

//   const handleTestSelect = (test) => {
//     setSelectedTest(test);
//     if (test.attempt && test.attempt.attempted) {
//       setTestSubmitted(true);
//       setScore(test.attempt.attemptDetails.score);
//       setDetailedResults(test.attempt.attemptDetails.detailedResults);
//     } else {
//       setTestSubmitted(false);
//       setScore(null);
//       setDetailedResults(null);
//       const initialAnswers = test.quiz.reduce((acc, _, index) => {
//         acc[index] = null;
//         return acc;
//       }, {});
//       setUserAnswers(initialAnswers);
//     }
//   };

//   const handleAnswerSelect = (questionIndex, answer) => {
//     setUserAnswers({
//       ...userAnswers,
//       [questionIndex]: answer,
//     });
//   };

//   const handleSubmitTest = async () => {
//     if (!selectedTest) {
//       console.error("No test selected");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:9090/generate-responses",
//         {
//           userId: userProfile._id,
//           testId: selectedTest._id,
//           userAnswers: Object.entries(userAnswers).map(
//             ([questionIndex, selectedAnswer]) => ({
//               questionIndex: parseInt(questionIndex),
//               selectedAnswer,
//             })
//           ),
//         }
//       );

//       setScore(response.data.response.filter((q) => q.isCorrect).length * 10);
//       setDetailedResults(response.data.response);
//       setTestSubmitted(true);
//       await fetchTests(); // Refresh the tests after submission
//     } catch (error) {
//       console.error("Error submitting test:", error);
//       // Handle error (e.g., show an error message to the user)
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="flex h-screen bg-white">
//         <div className="w-1/4 bg-gray-100 shadow-lg overflow-y-auto">
//           <div className="p-6">
//             <h2 className="text-2xl font-bold mb-6 text-[#A94442]">
//               Available Tests
//             </h2>
//             <ul className="space-y-4">
//               {tests.map((test) => (
//                 <li
//                   key={test._id}
//                   className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
//                     selectedTest?._id === test._id
//                       ? "bg-[#A94442] text-white"
//                       : "hover:bg-gray-200"
//                   }`}
//                   onClick={() => handleTestSelect(test)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-semibold text-lg">{test.subject}</h3>
//                       <p className="text-sm opacity-75">{test.topic}</p>
//                     </div>
//                     <div className="flex items-center">
//                       {test.attempt && test.attempt.attempted && (
//                         <TooltipProvider>
//                           <TooltipComponent>
//                             <TooltipTrigger>
//                               <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p>Score: {test.attempt.attemptDetails.score}</p>
//                             </TooltipContent>
//                           </TooltipComponent>
//                         </TooltipProvider>
//                       )}
//                       <ChevronRightIcon className="w-5 h-5" />
//                     </div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//         <div className="flex-1 p-8 overflow-y-auto">
//           {selectedTest ? (
//             <div className="max-w-3xl mx-auto">
//               <h2 className="text-3xl font-bold mb-6 text-[#A94442]">
//                 {selectedTest.subject}: {selectedTest.topic}
//               </h2>
//               {isLoading ? (
//                 <div className="flex justify-center items-center h-64">
//                   <LoadingText />
//                 </div>
//               ) : selectedTest.attempt && selectedTest.attempt.attempted ? (
//                 <>
//                   <AttemptInfo
//                     attemptDate={
//                       selectedTest.attempt.attemptDetails.attemptDate
//                     }
//                   />
//                   <TestResultsDonutChart
//                     score={selectedTest.attempt.attemptDetails.score}
//                     totalQuestions={selectedTest.quiz.length}
//                   />
//                   <DetailedTestResults
//                     results={
//                       selectedTest.attempt.attemptDetails.detailedResults
//                     }
//                   />
//                 </>
//               ) : !testSubmitted ? (
//                 <>
//                   {selectedTest.quiz.map((question, questionIndex) => (
//                     <Card key={questionIndex} className="mb-6">
//                       <CardHeader>
//                         <CardTitle className="text-xl font-semibold text-[#A94442]">
//                           Question {questionIndex + 1} of{" "}
//                           {selectedTest.quiz.length}
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <p className="mb-4 text-lg text-gray-700">
//                           {question.question}
//                         </p>
//                         <div className="space-y-3">
//                           {question.options.map((option, optionIndex) => (
//                             <label
//                               key={optionIndex}
//                               className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
//                                 userAnswers[questionIndex] === option
//                                   ? "bg-[#A94442] text-white"
//                                   : "hover:bg-gray-100"
//                               }`}
//                             >
//                               <input
//                                 type="radio"
//                                 name={`question-${questionIndex}`}
//                                 value={option}
//                                 checked={userAnswers[questionIndex] === option}
//                                 onChange={() =>
//                                   handleAnswerSelect(questionIndex, option)
//                                 }
//                                 className="form-radio h-5 w-5 text-[#A94442]"
//                               />
//                               <span className="ml-2">{option}</span>
//                             </label>
//                           ))}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                   <div className="flex justify-end mb-8">
//                     <Button
//                       onClick={handleSubmitTest}
//                       className="px-6 py-2 bg-[#A94442] text-white rounded-lg font-semibold hover:bg-[#923A38] transition-colors duration-200"
//                       disabled={isLoading}
//                     >
//                       Submit Test
//                     </Button>
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <TestResultsDonutChart
//                     score={score}
//                     totalQuestions={selectedTest.quiz.length}
//                   />
//                   {detailedResults && (
//                     <DetailedTestResults results={detailedResults} />
//                   )}
//                 </>
//               )}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <Card className="text-center p-8">
//                 <CardHeader>
//                   <CardTitle className="text-2xl font-semibold text-[#A94442] mb-4">
//                     Welcome to the Test Platform
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-600">
//                     Select a test from the left sidebar to begin.
//                   </p>
//                 </CardContent>
//               </Card>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default TestPage;

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ChevronRightIcon, CheckCircle, XCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";

const COLORS = ["#A94442", "#FFA07A"];

const TestResultsDonutChart = ({ score, totalQuestions }) => {
  const data = [
    { name: "Correct", value: score },
    { name: "Incorrect", value: totalQuestions * 10 - score },
  ];

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <Card className="w-full max-w-3xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-[#A94442] text-center">
          Test Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-[#A94442] mb-4">
            {percentage}%
          </div>
          <div className="text-lg text-gray-600 mb-6">
            Score: {score} out of {totalQuestions}
          </div>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DetailedTestResults = ({ results, questions }) => {
  if (!results || results.length === 0) {
    return <div>No results available</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-[#A94442] mb-4">
        Detailed Results
      </h3>
      {results.map((result, index) => {
        const question = questions[result.questionIndex];
        if (!question) {
          console.error(`Question not found for index ${result.questionIndex}`);
          return null;
        }
        const isCorrect = result.selectedAnswer === question.correctAnswer;
        return (
          <Card
            key={index}
            className={isCorrect ? "border-green-500" : "border-red-500"}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                )}
                Question {result.questionIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                <strong>Question:</strong> {question.question}
              </p>
              <p className="mb-2">
                <strong>Your Answer:</strong> {result.selectedAnswer}
              </p>
              <p className="mb-2">
                <strong>Correct Answer:</strong> {question.correctAnswer}
              </p>
              <p className="mt-4">
                <strong>Explanation:</strong>{" "}
                {isCorrect
                  ? "Your answer is correct!"
                  : `The correct answer is "${question.correctAnswer}". ${
                      question.explanation || ""
                    }`}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const AttemptInfo = ({ attemptDate }) => {
  return (
    <Card className="w-full max-w-3xl mx-auto mb-8">
      <CardContent className="flex items-center justify-center p-4">
        <Calendar className="w-6 h-6 mr-2 text-[#A94442]" />
        <span className="text-lg font-semibold">
          Attempted on: {new Date(attemptDate).toLocaleString()}
        </span>
      </CardContent>
    </Card>
  );
};

const LoadingText = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-2xl font-bold text-[#A94442] text-center">
      {"Evaluating the results".split("").map((char, index) => (
        <span
          key={index}
          className="inline-block transition-opacity duration-1000"
          style={{
            opacity: 1 - (index / "Evaluating the results".length) * 0.8,
          }}
        >
          {char}
        </span>
      ))}
      <span className="inline-block w-6">{".".repeat(dots)}</span>
    </div>
  );
};

const TestPage = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [detailedResults, setDetailedResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attemptDate, setAttemptDate] = useState(null);
  const authToken = localStorage.getItem("authToken");

  const fetchTests = useCallback(async () => {
    if (!userProfile) {
      console.error("User profile is not available");
      return;
    }

    try {
      const response = await axios.get("http://localhost:9090/api/tests");
      const testsData = response.data;

      const testsWithAttempts = await Promise.all(
        testsData.map(async (test) => {
          const attemptResponse = await axios.post(
            "http://localhost:9090/check-attempt",
            {
              userId: userProfile._id,
              testId: test._id,
            }
          );
          return { ...test, attempt: attemptResponse.data };
        })
      );

      setTests(testsWithAttempts);
    } catch (error) {
      console.error("Failed to fetch tests", error);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:9090/profile", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.status === 200) {
          setUserProfile(response.data.user);
        } else {
          console.log("Error: " + response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (authToken && !userProfile) {
      fetchProfileData();
    }

    if (userProfile) {
      fetchTests();
    }
  }, [authToken, userProfile, fetchTests]);

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    if (test.attempt && test.attempt.attempted) {
      setTestSubmitted(true);
      setScore(test.attempt.attemptDetails.score);
      setDetailedResults(test.attempt.attemptDetails.userAnswers);
      setAttemptDate(test.attempt.attemptDetails.attemptDate);
    } else {
      setTestSubmitted(false);
      setScore(null);
      setDetailedResults(null);
      setAttemptDate(null);
      const initialAnswers = test.quiz.reduce((acc, _, index) => {
        acc[index] = null;
        return acc;
      }, {});
      setUserAnswers(initialAnswers);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer,
    });
  };

  const handleSubmitTest = async () => {
    if (!selectedTest) {
      console.error("No test selected");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:9090/generate-responses",
        {
          userId: userProfile._id,
          testId: selectedTest._id,
          userAnswers: Object.entries(userAnswers).map(
            ([questionIndex, selectedAnswer]) => ({
              questionIndex: parseInt(questionIndex),
              selectedAnswer,
            })
          ),
        }
      );

      if (
        !response.data ||
        !response.data.response ||
        !Array.isArray(response.data.response)
      ) {
        throw new Error("Invalid response format from server");
      }

      const correctAnswers = response.data.response.filter((q) => {
        const question = selectedTest.quiz[q.questionIndex];
        return question && question.correctAnswer === q.selectedAnswer;
      }).length;

      setScore(correctAnswers * 10);
      setDetailedResults(response.data.response);
      setTestSubmitted(true);
      setAttemptDate(new Date().toISOString());

      // Update the test attempt in the tests array
      setTests((prevTests) =>
        prevTests.map((test) =>
          test._id === selectedTest._id
            ? {
                ...test,
                attempt: {
                  attempted: true,
                  attemptDetails: {
                    score: correctAnswers * 10,
                    userAnswers: response.data.response,
                    attemptDate: new Date().toISOString(),
                  },
                },
              }
            : test
        )
      );
    } catch (error) {
      console.error("Error submitting test:", error);
      // Handle error (e.g., show an error message to the user)
      setScore(null);
      setDetailedResults(null);
      setTestSubmitted(false);
      setAttemptDate(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-white">
        <div className="w-1/4 bg-gray-100 shadow-lg overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-[#A94442]">
              Available Tests
            </h2>
            <ul className="space-y-4">
              {tests.map((test) => (
                <li
                  key={test._id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTest?._id === test._id
                      ? "bg-[#A94442] text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleTestSelect(test)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{test.subject}</h3>
                      <p className="text-sm opacity-75">{test.topic}</p>
                    </div>
                    <div className="flex items-center">
                      {test.attempt && test.attempt.attempted && (
                        <TooltipProvider>
                          <TooltipComponent>
                            <TooltipTrigger>
                              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Score: {test.attempt.attemptDetails.score}</p>
                            </TooltipContent>
                          </TooltipComponent>
                        </TooltipProvider>
                      )}
                      <ChevronRightIcon className="w-5 h-5" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedTest ? (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-[#A94442]">
                {selectedTest.subject}: {selectedTest.topic}
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingText />
                </div>
              ) : testSubmitted ? (
                <>
                  {attemptDate && <AttemptInfo attemptDate={attemptDate} />}
                  <TestResultsDonutChart
                    score={score}
                    totalQuestions={selectedTest.quiz.length}
                  />
                  {detailedResults && (
                    <DetailedTestResults
                      results={detailedResults}
                      questions={selectedTest.quiz}
                    />
                  )}
                </>
              ) : (
                <>
                  {selectedTest.quiz.map((question, questionIndex) => (
                    <Card key={questionIndex} className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-[#A94442]">
                          Question {questionIndex + 1} of{" "}
                          {selectedTest.quiz.length}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 text-lg text-gray-700">
                          {question.question}
                        </p>
                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <label
                              key={optionIndex}
                              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                userAnswers[questionIndex] === option
                                  ? "bg-[#A94442] text-white"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${questionIndex}`}
                                value={option}
                                checked={userAnswers[questionIndex] === option}
                                onChange={() =>
                                  handleAnswerSelect(questionIndex, option)
                                }
                                className="form-radio h-5 w-5 text-[#A94442]"
                              />
                              <span className="ml-2">{option}</span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex justify-end mb-8">
                    <Button
                      onClick={handleSubmitTest}
                      className="px-6 py-2 bg-[#A94442] text-white rounded-lg font-semibold hover:bg-[#923A38] transition-colors duration-200"
                      disabled={isLoading}
                    >
                      Submit Test
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Card className="text-center p-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-[#A94442] mb-4">
                    Welcome to the Test Platform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Select a test from the left sidebar to begin.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestPage;
