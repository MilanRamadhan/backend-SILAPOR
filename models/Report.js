import mongoose from "mongoose";

const Reports = new mongoose.Schema(
  {
    reporterID: {
      type: String,
      required: true,
    },
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
    images: {
      type: [String],
      default: [],
      required: true,
    },
    response: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      required: true,
      default: "Menunggu konfirmasi",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Report", Reports);
