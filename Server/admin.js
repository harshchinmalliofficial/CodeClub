import mongoose from "mongoose";
const Admin = mongoose.Schema({
  username: { type: "string" },
  password: { type: "string" },
});

const admin = mongoose.model("admin", Admin);
export default admin;
