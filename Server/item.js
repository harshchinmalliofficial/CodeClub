import mongoose from "mongoose";

const item = mongoose.Schema({
  itemName: {
    type: "string",
    required: true,
  },
  itemImage: {
    type: "string",
  },
  itemDescription: {
    type: "string",
  },
  itemQuantity: {
    type: "number",
    required: true,
  },
  itemPrice: {
    type: "number",
    required: true,
  },
});

const items = mongoose.model("items", item);
export default items;
