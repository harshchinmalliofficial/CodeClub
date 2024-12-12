"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import {
  Wallet,
  Mail,
  User,
  Key,
  Edit,
  Lock,
  Award,
  BookOpen,
  Code,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function ProfilePage() {
  const { authToken } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);

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

    fetchProfileData();
  }, [authToken]);

  const handleResetPassword = () => {
    alert("Password reset email sent!");
  };

  const handleEditProfile = () => {
    alert("Edit profile functionality not implemented yet.");
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#FAEBD7]">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-[#5C4033] mb-4">
            Oops! Profile couldn't be fetched, please log in again.
          </h1>
          <Link
            to="/login"
            className="text-[#A0522D] font-bold hover:underline"
          >
            Click To Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAEBD7]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-[#A0522D]">
                <AvatarImage src="/placeholder.svg" alt={userProfile.name} />
                <AvatarFallback className="bg-[#A0522D] text-white text-3xl">
                  {userProfile.Firstname
                    ? userProfile.Firstname.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold text-[#5C4033]">
                {userProfile.Firstname + " " + userProfile.Lastname || "User"}
              </CardTitle>
              <p className="text-[#8B4513]">{userProfile.email}</p>
              <p className="text-[#8B4513]">CFID: {userProfile.CfId}</p>
            </CardHeader>
            <CardContent>
              <div className="bg-[#FAEBD7] p-4 rounded-lg flex items-center justify-center mb-6">
                <Wallet className="text-[#8B4513] mr-2" />
                <span className="text-xl font-bold text-[#5C4033]">
                  {userProfile.codeCoins} CodeCoins
                </span>
              </div>
              <div className="space-y-4 text-[#5C4033]">
                <div className="flex items-center">
                  <User className="mr-2" />
                  <span className="font-semibold mr-2">Name:</span>
                  <span>
                    {userProfile.Firstname + " " + userProfile.Lastname}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center">
                  <Mail className="mr-2" />
                  <span className="font-semibold mr-2">Email:</span>
                  <span>{userProfile.email}</span>
                </div>
                <Separator />
                <div className="flex items-center">
                  <Key className="mr-2" />
                  <span className="font-semibold mr-2">CFID:</span>
                  <span>{userProfile.CfId}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                onClick={handleResetPassword}
                className="w-full bg-[#A0522D] hover:bg-[#8B4513]"
              >
                <Lock className="mr-2" /> Reset Password
              </Button>
              <Button
                onClick={handleEditProfile}
                className="w-full bg-[#A0522D] hover:bg-[#8B4513]"
              >
                <Edit className="mr-2" /> Edit Profile
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#5C4033]">
                Activity Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#5C4033] mb-2">
                  Recent Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-[#FAEBD7] rounded-lg">
                    <Award className="text-[#A0522D] mr-2" />
                    <span>Completed 5 challenges</span>
                  </div>
                  <div className="flex items-center p-3 bg-[#FAEBD7] rounded-lg">
                    <BookOpen className="text-[#A0522D] mr-2" />
                    <span>Finished Python course</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#5C4033] mb-2">
                  Current Progress
                </h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>JavaScript Mastery</span>
                      <span>60%</span>
                    </div>
                    <Progress
                      value={60}
                      className="h-2 bg-[#D2B48C]"
                      indicatorClassName="bg-[#A0522D]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Data Structures</span>
                      <span>75%</span>
                    </div>
                    <Progress
                      value={75}
                      className="h-2 bg-[#D2B48C]"
                      indicatorClassName="bg-[#A0522D]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#5C4033] mb-2">
                  Upcoming Events
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="text-[#A0522D] mr-2" />
                    <span>Coding Challenge - Next Saturday</span>
                  </div>
                  <div className="flex items-center">
                    <Code className="text-[#A0522D] mr-2" />
                    <span>Hackathon - In 2 weeks</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
