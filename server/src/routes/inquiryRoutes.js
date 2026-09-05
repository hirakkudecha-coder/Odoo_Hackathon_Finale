const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries } = require('../controllers/designerInquiryController');

router.post('/designer', createInquiry);
router.get('/designer', getInquiries);

module.exports = router;
