const express = require('express');
const {
  layTatCaChuongTrinh,
  layChuongTrinhTheoId,
  taoMoiChuongTrinh,
  capNhatChuongTrinh,
  xoaChuongTrinh,
  timKiemChuongTrinh,
} = require('../controllers/chuongtrinhcontroller');

const router = express.Router();

// Định nghĩa các route
router.get('/', layTatCaChuongTrinh); // Lấy danh sách chương trình
router.get('/search', timKiemChuongTrinh);
router.get('/:id', layChuongTrinhTheoId); // Lấy chi tiết chương trình
router.post('/', taoMoiChuongTrinh); // Tạo mới chương trình
router.put('/:id', capNhatChuongTrinh); // Cập nhật chương trình
router.delete('/:id', xoaChuongTrinh); // Xóa chương trình

module.exports = router;
