import mongoose from "mongoose";
import Product from "../models/product.js";

export const searchProducts = async (queryPassed) => {
  try {
    // Extract query parameters from the request
    const queryParams = queryPassed;
    const page = parseInt(queryPassed.page) || 1;
    const pageSize = 4;
    const skip = (page - 1) * pageSize;
    // Initialize an empty object to hold the MongoDB query
    let query = {};
    Object.keys(queryParams).forEach((param) => {
      if (param === "minPrice" || param === "maxPrice") {
        query.price = query.price || {};
        query.price[`$${param === "minPrice" ? "gte" : "lte"}`] = parseFloat(
          queryParams[param]
        );
      } else if (param === "minRatings" || param === "maxRatings") {
        query.ratings = query.ratings || {};
        query.ratings[`$${param === "minRatings" ? "gte" : "lte"}`] =
          parseFloat(queryParams[param]);
      } else if (param === "category") {
        const regex = new RegExp(queryParams[param], "i");
        query.$or = [
          { [param]: { $regex: regex } },
          // Add more conditions if needed
        ];
      } else if (param === "keyword") {
        const regex = new RegExp(queryParams[param], "i");
        query.$or = [
          { name: { $regex: regex } },
          // Add more conditions if needed
        ];
      }
    });

    // Find products based on the constructed query
    //console.log(query);
    const totalproducts = await Product.find(query);
    const totalProductsCount = totalproducts.length;
    const products = await Product.find(query).skip(skip).limit(pageSize);
    return {
      products,
      totalProductsCount,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
// export const pagination = async (query, product) => {
//   const page = parseInt(query.page) || 1;
//   const pageSize = 4;
//   const skip = (page - 1) * pageSize;
//   const products = await product.skip(skip).limit(pageSize);
//   return products;
// };
