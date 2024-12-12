"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { Loader2, User, Bot } from "lucide-react";
import AdminNavbar from "./Admin_components/AdminNavbar";

export default function Qna() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setChatHistory((prev) => [...prev, { type: "user", text: question }]);
    setQuestion("");

    try {
      const response = await axios.post(
        "http://localhost:9090/generate-response",
        {
          prompt: question,
        }
      );

      setChatHistory((prev) => [
        ...prev,
        { type: "bot", text: response.data.response },
      ]);
    } catch (error) {
      setError("Error fetching data from the server");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex justify-center h-[calc(100vh-64px)]">
        <Card className="w-full h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            {chatHistory.map((entry, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${
                  entry.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {entry.type === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-[#A94442] flex items-center justify-center mr-2">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    entry.type === "user"
                      ? "bg-[#A94442] text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {entry.text}
                </div>
                {entry.type === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center ml-2">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <CardContent className="border-t p-4 bg-white sticky bottom-0 flex items-center">
            <div className="relative w-full">
              <TextareaAutosize
                placeholder="Ask a question..."
                value={question}
                onChange={handleQuestionChange}
                className="w-full pr-12 pl-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#A94442]"
                minRows={3}
                maxRows={6}
              />
              <Button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="absolute bottom-2 right-2 bg-[#A94442] hover:bg-[#923A38] text-white py-1 px-3 rounded-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
