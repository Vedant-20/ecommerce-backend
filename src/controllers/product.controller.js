import { Product } from "../models/product.model.js";
import { uploadProductPermission } from "../helpers/permission.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const uploadProduct=asyncHandler(async(req,res)=>{
    const sessionUserId=req.user._id 

    if(!uploadProductPermission(sessionUserId)){
        throw new Error('Permission denied')
    }

    const productToUpload=new Product(req.body)

    const saveProduct=await productToUpload.save()

    res.status(201).json(new ApiResponse(201,saveProduct,'Product Uploaded Successfully'))
})


const updateProduct=asyncHandler(async(req,res)=>{
    if(!uploadProductPermission(req.user._id)){
        throw new Error('Permission denied')
    }

    const {_id, ...resBody}=req.body 

    const productToUpdate=await Product.findByIdAndUpdate(_id,resBody)

    res.status(201).json(new ApiResponse(201,productToUpdate,'Product Updated Successfully'))
})


const searchProduct=asyncHandler(async(req,res)=>{
    const query=req.query.q 
    const regex=new RegExp(query,'i','g')

    const product=await Product.find({
        "$or":[
            {
                productName:regex
            },
            {
                category:regex
            }
        ]
    })

    res.status(201).json(new ApiResponse(201,product,'Search Product List Fetched'))
})

const getProductDetails=asyncHandler(async(req,res)=>{
    const {productId}=req.body 

    const product=await Product.findById(productId)

    res.status(200).json(new ApiResponse(200,product,'Product Details Fetched Successfully'))
})

const getAllProducts=asyncHandler(async(req,res)=>{
    const allProducts=await Product.find().sort({createdAt:-1})

    res.status(200).json(new ApiResponse(200,allProducts,'All Products Fetched'))
})

const getCategoryWiseProducts=asyncHandler(async(req,res)=>{
    const {category}=req?.body || req?.query 

    const product=await Product.find({category})


    res.status(201).json(new ApiResponse(201,product,'Category WIse Product Fetched'))
})

const getProductCategory=asyncHandler(async(req,res)=>{
    const productCategory=await Product.distinct('category')

    const productByCatgeory=[]

    for(const category of productCategory){
        const product=await Product.findOne({category})

        if(product){
            productByCatgeory.push(product)
        }
    }

    res.status(201).json(new ApiResponse(201,productByCatgeory,'Catergory Products'))


})

const filterProduct=asyncHandler(async(req,res)=>{
    const categoryList=req?.body?.category || []

    const product=await Product.find({
        category:{
            "$in":categoryList
        }
    })


    res.status(201).json(new ApiResponse(201,product,'Product Filetered Succesfully'))
})

export {uploadProduct, updateProduct,searchProduct, getProductDetails, getAllProducts, getCategoryWiseProducts, getProductCategory,filterProduct}