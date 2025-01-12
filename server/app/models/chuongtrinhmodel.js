const mongoose = require('mongoose');

const chuongTrinhSchema = new mongoose.Schema({
  ten: {
    type: String,
    required: true, // Tên chương trình
  },
  moTa: {
    type: String,
    required: true, // Mô tả chương trình
  },
  giangVien: {
    type: String,
    required: true, // Tên giảng viên
  },
  thoiLuong: {
    type: String,
    required: true, // Thời lượng
  },
  diaDiem: {
    type: String,
    required: true, // Địa điểm
  },
  gia: {
    type: String,
    required: true, // Giá
  },
  dangKy: {
    type: String,
    required: true, // Trạng thái đăng ký
  },
});

module.exports = mongoose.model('ChuongTrinh', chuongTrinhSchema);
