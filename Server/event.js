import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(), // Equivalent to cuid()
    },
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically sets the current date and time
      immutable: true, // Prevent updates to `createdAt`
    },
    eventType: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }, // Automatically handles timestamps
  }
);

const Events = mongoose.model("Event", eventSchema);

export default Events;
