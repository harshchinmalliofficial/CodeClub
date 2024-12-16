// "use client";

// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { AuthContext } from "./AuthContext.jsx";
// import Navbar from "@/components/Navbar";
// import { Link } from "react-router-dom";
// import {
//   Wallet,
//   Mail,
//   User,
//   Key,
//   Edit,
//   Lock,
//   Award,
//   BookOpen,
//   Code,
//   Calendar,
//   Trophy,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";

// export default function ProfilePage() {
//   const { authToken } = useContext(AuthContext);
//   const [userProfile, setUserProfile] = useState(null);
//   const [leaderboard, setLeaderboard] = useState([]);

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

//     const fetchLeaderboard = async () => {
//       try {
//         const response = await axios.get("http://localhost:9090/leaderboard");
//         if (response.status === 200) {
//           setLeaderboard(response.data.leaderboard);
//         } else {
//           console.log("Error fetching leaderboard: " + response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching leaderboard data:", error);
//       }
//     };

//     fetchProfileData();
//     fetchLeaderboard();
//   }, [authToken]);

//   const handleResetPassword = () => {
//     alert("Password reset email sent!");
//   };

//   const handleEditProfile = () => {
//     alert("Edit profile functionality not implemented yet.");
//   };

//   if (!userProfile) {
//     return (
//       <div className="min-h-screen bg-[#FAEBD7]">
//         <Navbar />
//         <div className="container mx-auto px-4 py-8 text-center">
//           <h1 className="text-2xl font-bold text-[#5C4033] mb-4">
//             `Oops! Profile couldn`t be fetched, please log in again
//           </h1>
//           <Link
//             to="/login"
//             className="text-[#A0522D] font-bold hover:underline"
//           >
//             Click To Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#FAEBD7]">
//       <Navbar />
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <Card className="md:col-span-1">
//             <CardHeader className="text-center">
//               <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-[#A0522D]">
//                 <AvatarImage src="/placeholder.svg" alt={userProfile.name} />
//                 <AvatarFallback className="bg-[#A0522D] text-white text-3xl">
//                   {userProfile.Firstname
//                     ? userProfile.Firstname.charAt(0).toUpperCase()
//                     : "U"}
//                 </AvatarFallback>
//               </Avatar>
//               <CardTitle className="text-2xl font-bold text-[#5C4033]">
//                 {userProfile.Firstname + " " + userProfile.Lastname || "User"}
//               </CardTitle>
//               <p className="text-[#8B4513]">{userProfile.email}</p>
//               <p className="text-[#8B4513]">CFID: {userProfile.CfId}</p>
//             </CardHeader>
//             <CardContent>
//               <div className="bg-[#FAEBD7] p-4 rounded-lg flex items-center justify-center mb-6">
//                 <Wallet className="text-[#8B4513] mr-2" />
//                 <span className="text-xl font-bold text-[#5C4033]">
//                   {userProfile.codeCoins} CodeCoins
//                 </span>
//               </div>
//               <div className="space-y-4 text-[#5C4033]">
//                 <div className="flex items-center">
//                   <User className="mr-2" />
//                   <span className="font-semibold mr-2">Name:</span>
//                   <span>
//                     {userProfile.Firstname + " " + userProfile.Lastname}
//                   </span>
//                 </div>
//                 <Separator />
//                 <div className="flex items-center">
//                   <Mail className="mr-2" />
//                   <span className="font-semibold mr-2">Email:</span>
//                   <span>{userProfile.email}</span>
//                 </div>
//                 <Separator />
//                 <div className="flex items-center">
//                   <Key className="mr-2" />
//                   <span className="font-semibold mr-2">CFID:</span>
//                   <span>{userProfile.CfId}</span>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-2">
//               <Button
//                 onClick={handleResetPassword}
//                 className="w-full bg-[#A0522D] hover:bg-[#8B4513]"
//               >
//                 <Lock className="mr-2" /> Reset Password
//               </Button>
//               <Button
//                 onClick={handleEditProfile}
//                 className="w-full bg-[#A0522D] hover:bg-[#8B4513]"
//               >
//                 <Edit className="mr-2" /> Edit Profile
//               </Button>
//             </CardFooter>
//           </Card>

//           <Card className="md:col-span-2">
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold text-[#5C4033]">
//                 Activity Overview
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <h3 className="text-lg font-semibold text-[#5C4033] mb-2">
//                   Recent Achievements
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-center p-3 bg-[#FAEBD7] rounded-lg">
//                     <Award className="text-[#A0522D] mr-2" />
//                     <span>Completed 5 challenges</span>
//                   </div>
//                   <div className="flex items-center p-3 bg-[#FAEBD7] rounded-lg">
//                     <BookOpen className="text-[#A0522D] mr-2" />
//                     <span>Finished Python course</span>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-[#5C4033] mb-2">
//                   Current Progress
//                 </h3>
//                 <div className="space-y-2">
//                   <div>
//                     <div className="flex justify-between mb-1">
//                       <span>JavaScript Mastery</span>
//                       <span>60%</span>
//                     </div>
//                     <Progress
//                       value={60}
//                       className="h-2 bg-[#D2B48C]"
//                       indicatorClassName="bg-[#A0522D]"
//                     />
//                   </div>
//                   <div>
//                     <div className="flex justify-between mb-1">
//                       <span>Data Structures</span>
//                       <span>75%</span>
//                     </div>
//                     <Progress
//                       value={75}
//                       className="h-2 bg-[#D2B48C]"
//                       indicatorClassName="bg-[#A0522D]"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-[#5C4033] mb-2">
//                   Upcoming Events
//                 </h3>
//                 <div className="space-y-2">
//                   <div className="flex items-center">
//                     <Calendar className="text-[#A0522D] mr-2" />
//                     <span>Coding Challenge - Next Saturday</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Code className="text-[#A0522D] mr-2" />
//                     <span>Hackathon - In 2 weeks</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="md:col-span-1">
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold text-[#5C4033] flex items-center">
//                 <Trophy className="text-[#A0522D] mr-2" />
//                 Leaderboard
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {leaderboard.map((student, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between"
//                   >
//                     <div className="flex items-center">
//                       <span className="font-bold text-[#5C4033] mr-2">
//                         {index + 1}.
//                       </span>
//                       <Avatar className="w-8 h-8 mr-2">
//                         <AvatarImage
//                           src="/placeholder.svg"
//                           alt={student.name}
//                         />
//                         <AvatarFallback className="bg-[#A0522D] text-white">
//                           {student.name.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span className="text-[#5C4033]">{student.name}</span>
//                     </div>
//                     <span className="font-bold text-[#A0522D]">
//                       {student.score}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

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
  Trophy,
  Loader2,
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
  // const { authToken } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
  const authToken = localStorage.getItem("authToken");
  console.log(authToken);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch Profile Data
        const profileResponse = await axios
          .get("http://localhost:9090/profile", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
          .then((response) => {
            console.log(response.data.user);
            setUserProfile(response.data.user);
          });

        // Fetch Leaderboard Data
        const leaderboardResponse = await axios.get(
          "http://localhost:9090/leaderboard"
        );

        if (
          profileResponse.status === 200 &&
          leaderboardResponse.status === 200
        ) {
          setUserProfile(profileResponse.data.user);
          setLeaderboard(leaderboardResponse.data.leaderboard);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  const handleResetPassword = () => {
    alert("Password reset email sent!");
  };

  const handleEditProfile = () => {
    alert("Edit profile functionality not implemented yet.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAEBD7] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#A0522D]" size={48} />
      </div>
    );
  }

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile Card */}
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

          {/* Activity Overview Card */}
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

          {/* Leaderboard Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#5C4033] flex items-center">
                <Trophy className="text-[#A0522D] mr-2" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="text-center text-[#5C4033]">
                  No leaderboard data available
                </div>
              ) : (
                <div className="space-y-4">
                  {leaderboard.slice(0, 5).map((student, index) => (
                    <div
                      key={student.name}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        index === 0
                          ? "bg-yellow-100"
                          : index === 1
                          ? "bg-gray-100"
                          : index === 2
                          ? "bg-orange-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="font-bold text-[#5C4033] mr-2">
                          {index + 1}.
                        </span>
                        <Avatar className="w-8 h-8 mr-2">
                          <AvatarImage
                            src="/placeholder.svg"
                            alt={student.name}
                          />
                          <AvatarFallback className="bg-[#A0522D] text-white">
                            {student.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[#5C4033]">{student.name}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-[#A0522D]">
                          {student.totalScore}
                        </span>
                        <span className="text-xs text-gray-500">
                          {student.totalTestsTaken} tests
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
