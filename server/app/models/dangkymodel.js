const mongoose = require('mongoose');

const dangKyChuongTrinhSchema = new mongoose.Schema({
  ten: {
    type: String,
    required: true, // Tên
  },
  email: {
    type: String,
    required: true, // Bắt buộc nhập email
    match: [/\S+@\S+\.\S+/, 'Email không hợp lệ'], // Kiểm tra định dạng email
  },
  soDienThoai: {
    type: String,
    required: true, // Bắt buộc nhập số điện thoại
    match: [/^(0[3|5|7|8|9])([0-9]{8})$/, 'Số điện thoại không hợp lệ'], // Kiểm tra số điện thoại Việt Nam
  },
  chuongTrinh: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChuongTrinhTapHuan', // Tham chiếu tới model ChuongTrinhTapHuan
    required: true, // Khóa ngoại tới chương trình
  },
  trangThaiDuyet: {
    type: String,
    enum: ['Chưa duyệt', 'Đã duyệt'],
    default: 'Chưa duyệt', // Trạng thái duyệt
  },
  ngayDangKy: {
    type: Date,
    default: Date.now, // Lưu thời điểm đăng ký
  },
});

module.exports = mongoose.model('DangKyChuongTrinh', dangKyChuongTrinhSchema);
