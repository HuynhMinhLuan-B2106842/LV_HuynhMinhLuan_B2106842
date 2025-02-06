const express = require('express');
const {
  taoDangKy,
  layDanhSachDangKy,
  layDangKyTheoId,
  capNhatDangKy,
  capNhatTrangThaiDuyet,
  xoaDangKy,
  traCuuDangKy,
} = require('../controllers/dangkycontroller');

const router = express.Router();

// Định nghĩa các route
router.post('/', taoDangKy); // Tạo mới đăng ký
router.get('/', layDanhSachDangKy); // Lấy danh sách đăng ký
router.get('/tra-cuu', traCuuDangKy);
router.get('/:id', layDangKyTheoId); // Lấy thông tin đăng ký theo ID
router.put('/:id', capNhatDangKy); // Cập nhật đăng ký theo ID
router.put('/:id/trang-thai-duyet', capNhatTrangThaiDuyet); // Cập nhật trạng thái duyệt
router.delete('/:id', xoaDangKy); // Xóa đăng ký theo ID

module.exports = router;
