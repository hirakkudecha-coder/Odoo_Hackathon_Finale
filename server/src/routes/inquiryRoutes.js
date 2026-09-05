const express = require('express');
const router = express.Router();
const { createInquiry, getInquiries, updateInquiryStatus } = require('../controllers/designerInquiryController');

router.post('/designer', createInquiry);
router.get('/designer', getInquiries);
router.patch('/designer/:id/status', updateInquiryStatus);

module.exports = router;

