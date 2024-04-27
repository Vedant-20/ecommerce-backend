import { Router } from "express";
import {
  addToCartController,
  addToCartViewProduct,
  countAddToCartProduct,
  deleteAddToCartProduct,
  getAllUsers,
  getUserDetails,
  updateAddToCartProduct,
  updateUser,
  userLogout,
  userSignIn,
  userSignUp,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(userSignUp);
router.route("/signin").post(userSignIn);
router.route("/logout").post(verifyJWT, userLogout);
router.route("/getuserdetails").get(verifyJWT, getUserDetails);

//admin panel
router.route("/update-user").patch(verifyJWT, updateUser);
router.route("/get-all-users").get(verifyJWT, getAllUsers);

//user add to cart
router.route("/update-cart-product").post(verifyJWT, updateAddToCartProduct);
router.route("/delete-cart-product").post(verifyJWT, deleteAddToCartProduct);
router.route("/countAddToCartProduct").get(verifyJWT, countAddToCartProduct);
router.route("/view-cart-product").get(verifyJWT, addToCartViewProduct);
router.route("/addtocart").post(verifyJWT, addToCartController);

export default router;
