const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.use(authenticate);

router.route('/')
  .post(authorize('admin', 'accountant'), createProduct)
  .get(getProducts);

router.route('/:id')
  .get(getProductById)
  .put(authorize('admin', 'accountant'), updateProduct)
  .delete(authorize('admin'), deleteProduct);

module.exports = router;
