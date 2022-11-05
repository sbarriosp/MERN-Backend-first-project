const { Router } = require("express");
const express = require ("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct,
    createProductReview, getSingleProductReviews, deleteReview, getAdminProducts, updateProducto, deleteProducto, getSingleProducto,    
} = require("../controllers/productos.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth"); //revisar esto con el main_auth.js
const router = express.Router();


Router.route ("/productos").get(getAllProducts);

router
  .route("/producto/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProducto)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProducto)
  .get(getSingleProducto);

router.route("/producto/review").post(isAuthenticatedUser, createProductoReview);

router
  .route("/reviews")
  .get(getSingleProductoReviews)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

module.exports = router;