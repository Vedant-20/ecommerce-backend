import mongoose from "mongoose";

const addToCart = new mongoose.Schema(
  {
    productId: {
      ref: "Product",
      type: String,
    },
    quantity: Number,
    userId: String,
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model("Cart", addToCart);
