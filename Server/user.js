import mongoose from "mongoose";
const user = mongoose.Schema({
  Firstname: { type: "string" },
  Lastname: { type: "string" },
  CfId: { type: "string", unique: true },
  codeCoins: { type: Number },
  email: { type: "string", unique: true },
  password: { type: "string" },
  lastClaimTIme: { type: Date },
});

// //

const User = mongoose.model("user", user);
export default User;
