const express = require('express');
const router = express.Router();
const tinTucController = require('../controllers/tintuccontroller');

// Lấy tất cả tin tức
router.get('/', tinTucController.layTatCaTinTuc);

// Lấy tin tức theo ID
router.get('/:id', tinTucController.layTinTucTheoId);

// Tạo mới tin tức
router.post('/', tinTucController.taoTinTucMoi);

// Xóa tin tức
router.delete('/:id', tinTucController.xoaTinTuc);

// Cập nhật tin tức
router.put('/:id', tinTucController.capNhatTinTuc);
module.exports = router;
