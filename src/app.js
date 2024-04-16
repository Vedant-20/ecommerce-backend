import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app= express()

app.use(cors())

app.use(express.json({limit:'16kb'}))

app.use(express.urlencoded({extended:true, limit:'16kb'}))

app.use(cookieParser())

//import routes
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js'




//routes declaration
app.use('/api/v1/users',userRouter)
app.use('/api/v1/products',productRouter)

export {app}
