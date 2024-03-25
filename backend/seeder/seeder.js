import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async () => {
  try {
    let DB_URI =
      "mongodb+srv://manishsandadi11:kRuJJpTGMdpMP0c4@cluster0.vhuow4s.mongodb.net/ecommerce?retryWrites=true&w=majority";
    await mongoose.connect(DB_URI);

    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("Products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
