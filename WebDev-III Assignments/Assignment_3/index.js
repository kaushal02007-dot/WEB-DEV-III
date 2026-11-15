
require("dotenv").config()

const express = require("express")
const db = require("./config/db")
const productRoutes = require("./routes/productRoutes")
const errorMiddleware = require("./middleware/errorMiddleware")

const app = express()

app.use(express.json())

db()  //database connection 


app.use("/products", productRoutes)

app.use(errorMiddleware)


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
