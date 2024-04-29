import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";

const userSignUp = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw new Error("User Already Exists");
  }

  if (!email) {
    throw new Error("Please Provide Email");
  }

  if (!password) {
    throw new Error("Please Provide Password");
  }

  if (!name) {
    throw new Error("Please Provide Name");
  }

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hashSync(password, salt);

  if (!hashPassword) {
    throw new Error("Something went Wrong while hashing password");
  }

  const payload = {
    ...req.body,
    role: "GENERAL",
    password: hashPassword,
  };

  const userData = new User(payload);
  const saveUser = await userData.save();

  res.status(201).json({
    data: saveUser,
    success: true,
    error: false,
    message: "User Created Successfully",
  });
});

const userSignIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new Error("Please Provide EMail");
  }

  if (!password) {
    throw new Error("Please Provide Password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User Not Found");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (checkPassword) {
    const tokenData = {
      _id: user._id,
      email: user.email,
    };

    const token = await jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 60 * 60 * 8,
    });

    const tokenOption = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.cookie("token", token, tokenOption).status(200).json({
      message: "Login Successfully",
      data: token,
      success: true,
      error: false,
    });
  } else {
    throw new Error("Please Check Password");
  }
});

const userLogout = asyncHandler(async (req, res) => {
  res.clearCookie("token").status(200);

  res.json({
    message: "User Logged Out Successfully",
    error: false,
    success: true,
    data: [],
  });
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new Error("User Not Found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "User Details Fetched Successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  const sessionUser = req.user._id;

  if (!sessionUser) {
    throw new Error("Unable to get user token");
  }

  const { userId, email, name, role } = req.body;

  // const payload = {
  //     ...( email && { email : email}),
  //     ...( name && { name : name}),
  //     ...( role && { role : role}),
  // }

  const updateUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        role: role,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (!updateUser) {
    throw new Error("User Not Found");
  }

  res.status(200).json(new ApiResponse(200, updateUser, "User Updated"));
});

const updateAddToCartProduct = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const addToCartProductId = req?.body?._id;
  const qty = req.body.quantity;

  const updateProduct = await Cart.updateOne(
    { _id: addToCartProductId },
    { ...(qty && { quantity: qty }) }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updateProduct, "Product Updated Successfully"));
});

const deleteAddToCartProduct = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const addToCartProductId = req?.body._id;

  const deleteProduct = await Cart.deleteOne({ _id: addToCartProductId });

  res
    .status(200)
    .json(new ApiResponse(200, deleteProduct, "Product Deleted Form Cart"));
});

const countAddToCartProduct = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const count = await Cart.countDocuments({
    userId: userId,
  });

  res.status(200).json(new ApiResponse(200, count, "Counted Successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find();

  res
    .status(200)
    .json(new ApiResponse(200, allUsers, "All Users Fetched Successfully"));
});

const addToCartViewProduct = asyncHandler(async (req, res) => {
  const currentUser = req.user._id;

  const allProduct = await Cart.find({
    userId: currentUser,
  }).populate("productId");

  res
    .status(200)
    .json(
      new ApiResponse(200, allProduct, "Add to cart view products fetched")
    );
});

const addToCartController = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const currentUser = req.user._id;

  const isProductAvailable = await Cart.findOne({ productId });

  if (isProductAvailable) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Already Exists in Cart"));
  }

  const payload = {
    productId: productId,
    quantity: 1,
    userId: currentUser,
  };

  const newAddToCart = new Cart(payload);
  const saveProduct = await newAddToCart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, saveProduct, "Product added in cart"));
});

export {
  userSignUp,
  userSignIn,
  userLogout,
  getUserDetails,
  updateUser,
  updateAddToCartProduct,
  deleteAddToCartProduct,
  countAddToCartProduct,
  getAllUsers,
  addToCartViewProduct,
  addToCartController,
};
