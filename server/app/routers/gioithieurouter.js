const express = require('express');
const {
  layDanhSachGioiThieu,
  layGioiThieuTheoId,
  themGioiThieu,
  capNhatGioiThieu,
  xoaGioiThieu,
} = require('../controllers/gioithieucontroller');

const router = express.Router();

// Định nghĩa các route
router.get('/', layDanhSachGioiThieu); // Lấy danh sách giới thiệu
router.get('/:id', layGioiThieuTheoId); // Lấy thông tin giới thiệu theo ID
router.post('/', themGioiThieu); // Thêm mới giới thiệu
router.put('/:id', capNhatGioiThieu); // Cập nhật giới thiệu theo ID
router.delete('/:id', xoaGioiThieu); // Xóa giới thiệu theo ID

module.exports = router;
