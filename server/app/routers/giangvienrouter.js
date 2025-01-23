const express = require('express');
const {
  layDanhSachGiangVien,
  layGiangVienTheoId,
  themGiangVien,
  capNhatGiangVien,
  xoaGiangVien,
  layDanhSachGiangVienTheoKhoa // Import thêm controller mới
} = require('../controllers/giangviencontroller');
const upload = require('../config/upload'); // Đường dẫn tới file uploadConfig.js

const router = express.Router();

// Các route
router.get('/', layDanhSachGiangVien); // Lấy danh sách giảng viên
router.get('/:id', layGiangVienTheoId); // Lấy giảng viên theo ID
router.get('/khoa/:khoaId', layDanhSachGiangVienTheoKhoa); // Lấy danh sách giảng viên theo khoa
router.post('/', upload.single('hinhAnh'), themGiangVien); // Thêm mới giảng viên với hình ảnh
router.put('/:id', upload.single('hinhAnh'), capNhatGiangVien); // Cập nhật giảng viên với hình ảnh
router.delete('/:id', xoaGiangVien); // Xóa giảng viên

module.exports = router;
