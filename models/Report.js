import mongoose from "mongoose";

const Report = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    kategori: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: [String],
      default: null,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    fullName: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", Report);
