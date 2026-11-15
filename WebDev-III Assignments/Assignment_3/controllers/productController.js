
const Product = require("../models/product")

// 1. CREATE PRODUCT
const createProduct = async (req, res, next) => {
    try {
        let {
            name,
            sku,
            category,
            price,
            quantity,
            reorderLevel,
            supplier
        } = req.body

        let product = await Product.create({
            name,
            sku,
            category,
            price,
            quantity,
            reorderLevel,
            supplier
        })

        res.status(201).json({
            message: "Product Created Successfully",
            data: product
        })
    }
    catch(err) {
        next(err)
    }
}


// 2. GET ALL PRODUCTS
// Filtering + Searching + Sorting + Pagination

const getAllProducts = async (req, res, next) => {
    try {

        let {
            category,
            minPrice,
            maxPrice,
            search,
            sortBy,
            order,
            page,
            limit
        } = req.query

        // FILTERING
        let filter = {}

        //category filtering
        if(category) {
            filter.category = category
        }
        
        //price filterig
        if(minPrice || maxPrice) {
            filter.price = {}

            if(minPrice) {
                filter.price.$gte = Number(minPrice)
            }

            if(maxPrice) {
                filter.price.$lte = Number(maxPrice)
            }
        }

        // SEARCHING
        if(search) {
            filter.$text = {
                $search: search
            }
        }

        // SORTING
        let sort = {}

        if(sortBy) {
            sort[sortBy] = order === "desc" ? -1 : 1
        }
        else {
            sort.createdAt = -1
        }

        // PAGINATION
        page = Number(page) || 1
        limit = Number(limit) || 5

        let skip = (page - 1) * limit

        let products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            message: "Products Retrieved Successfully",
            page: page,
            limit: limit,
            data: products
        })

    }
    catch(err) {
        next(err)
    }
}


// 3. GET SINGLE PRODUCT

const getSingleProduct = async (req, res, next) => {
    try {

        let product = await Product.findOne({
            _id: req.params.id
        })

        if(!product) {
            return res.status(404).json({
                message: "Product Not Found"
            })
        }

        res.status(200).json({
            message: "Product Found",
            data: product
        })

    }
    catch(err) {
        next(err)
    }
}


// 4. UPDATE PRODUCT DETAILS

const updateProduct = async (req, res, next) => {
    try {

        let product = await Product.findOne({
            _id: req.params.id
        })

        if(!product) {
            return res.status(404).json({
                message: "Product Not Found"
            })
        }

        let updatedProduct = await Product.updateOne(
            { _id: req.params.id },
            {
                $set: req.body
            }
        )

        res.status(200).json({
            message: "Product Updated Successfully",
            data: updatedProduct
        })

    }
    catch(err) {
        next(err)
    }
}


// 5. DELETE PRODUCT

const deleteProduct = async (req, res, next) => {
    try {

        let product = await Product.findOne({
            _id: req.params.id
        })

        if(!product) {
            return res.status(404).json({
                message: "Product Not Found"
            })
        }

        await Product.deleteOne({
            _id: req.params.id
        })

        res.status(200).json({
            message: "Product Deleted Successfully"
        })

    }
    catch(err) {
        next(err)
    }
}


// 6. RESTOCK PRODUCT

const restockProduct = async (req, res, next) => {
    try {

        let { quantity } = req.body

        if(!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Enter a valid quantity"
            })
        }

        let product = await Product.findOne({
            _id: req.params.id
        })

        if(!product) {
            return res.status(404).json({
                message: "Product Not Found"
            })
        }

        await Product.updateOne(
            { _id: req.params.id },
            {
                $inc: { quantity: quantity }
            }
        )

        res.status(200).json({
            message: "Stock Restocked Successfully"
        })

    }
    catch(err) {
        next(err)
    }
}


// 7. SELL PRODUCT

const sellProduct = async (req, res, next) => {
    try {

        let { quantity } = req.body

        if(!quantity || quantity <= 0) {
            return res.status(400).json({
                message: "Enter a valid quantity"
            })
        }

        let product = await Product.findOne({
            _id: req.params.id
        })

        if(!product) {
            return res.status(404).json({
                message: "Product Not Found"
            })
        }

        // Check whether sufficient stock is available
        let result = await Product.updateOne(
            {
                _id: req.params.id,
                quantity: { $gte: quantity }
            },
            {
                $inc: { quantity: -quantity }
            }
        )

        if(result.modifiedCount === 0) {
            return res.status(400).json({
                message: "Insufficient Stock"
            })
        }

        res.status(200).json({
            message: "Product Sold Successfully"
        })

    }
    catch(err) {
        next(err)
    }
}


// 8. LOW STOCK REPORT

const lowStockProducts = async (req, res, next) => {
    try {

        let products = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $lte: ["$quantity", "$reorderLevel"]
                    }
                }
            }
        ])

        res.status(200).json({
            message: "Low Stock Products",
            data: products
        })

    }
    catch(err) {
        next(err)
    }
}


// 9. CATEGORY-WISE INVENTORY SUMMARY

const categorySummary = async (req, res, next) => {
    try {

        let summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 },
                    totalQuantity: { $sum: "$quantity" },
                    totalValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    }
                }
            }
        ])

        res.status(200).json({
            message: "Category-wise Inventory Summary",
            data: summary
        })

    }
    catch(err) {
        next(err)
    }
}


module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    sellProduct,
    lowStockProducts,
    categorySummary
}
