import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { filterProduct, getAllProducts, getCategoryWiseProducts, getProductCategory, getProductDetails, searchProduct, updateProduct, uploadProduct } from "../controllers/product.controller.js";

const router=Router()


router.route('/upload-product').post(verifyJWT,uploadProduct)
router.route('/update-product').post(verifyJWT,updateProduct)
router.route('/search').get(searchProduct)
router.route('/get-product-details').get(getProductDetails)
router.route('/get-all-products').get(getAllProducts)
router.route('/get-categorywise-products').get(getCategoryWiseProducts)
router.route('/get-product-category').get(getProductCategory)
router.route('/filter-product').get(filterProduct)


export default router