const express = require('express');
const {
  layDanhSachKhoa,
  layKhoaTheoId,
  taoKhoa,
  capNhatKhoa,
  xoaKhoa,
} = require('../controllers/khoacontroller');

const router = express.Router();

// Định nghĩa các route
router.get('/', layDanhSachKhoa); // Lấy danh sách khoa
router.get('/:id', layKhoaTheoId); // Lấy thông tin khoa theo ID
router.post('/', taoKhoa); // Tạo mới khoa
router.put('/:id', capNhatKhoa); // Cập nhật khoa theo ID
router.delete('/:id', xoaKhoa); // Xóa khoa theo ID

module.exports = router;
