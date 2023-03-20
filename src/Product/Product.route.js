const mongoose = require('mongoose');
const express = require('express');
const productRouter = express.Router();
const ProductSchema = require('./Product.model');


productRouter.post('/products', async function (req, res){
    const {name,description,brand,category,price,images,rating,createdAt,updatedAt} = req.body;

    try{
          const product = await ProductSchema.find({name})
          if(!product){
            return res.status(404).json({
                message: "Product not found!"
            })
          }

          const newProduct = new ProductSchema(req.body);
          await newProduct.save();
          res.status(201).json({
            message: "Product created successfully",newProduct: newProduct
          })


    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "bad server error !",err
        })
    }

})
productRouter.get("/products",async function (req, res){
      try{
        const allProducts = await ProductSchema.find(); 
        res.status(200).json(allProducts);

      }catch(err){
        console.log(err);
        return res.status(500).json({message: "bad server error"});
      }
})

//delete
productRouter.delete('/products/:id', async function (req, res) {
  const productId = req.params.id;

  try {
    const product = await ProductSchema.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found!"
      });
    }
    
    await product.deleteOne();
    res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "bad server error !",
      err
    });
  }
});

// update
productRouter.patch('/products/:id', async function (req, res) {
  const productId = req.params.id;
  const updateFields = req.body;

  try {
    const product = await ProductSchema.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found!"
      });
    }

    Object.keys(updateFields).forEach((field) => {
      product[field] = updateFields[field];
    });

    await product.save();
    res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

productRouter.put('/products/:id', async function (req, res) {
  const productId = req.params.id;
  const updateFields = req.body;

  try {
    const product = await ProductSchema.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found!"
      });
    }

    Object.assign(product, updateFields);

    await product.save();
    res.status(200).json({
      message: "Product updated successfully",
      product
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});


// Filter API:

productRouter.get("/products", async function (req, res) {
const { category, brand } = req.query;
const filter = {};

if (category) {
filter.category = category;
}

if (brand) {
filter.brand = brand;
}

try {
const products = await ProductSchema.find(filter);
res.status(200).json(products);

} catch (err) {
console.log(err);
res.status(500).json({
message: "bad server error",
err
});
}
});

// Search API:

productRouter.get("/products", async function (req, res) {
const searchQuery = req.query.q;
const filter = {};

if (searchQuery) {
filter.$or = [
{ name: { $regex: searchQuery, $options: 'i' } },
{ description: { $regex: searchQuery, $options: 'i' } },
{ brand: { $regex: searchQuery, $options: 'i' } },
{ category: { $regex: searchQuery, $options: 'i' } }
];
}

try {
const products = await ProductSchema.find(filter);
res.status(200).json(products);

} catch (err) {
console.log(err);
res.status(500).json({
message: "bad server error",
err
});
}
});

module.exports =productRouter;
