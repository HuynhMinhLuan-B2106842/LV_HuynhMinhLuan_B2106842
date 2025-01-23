// const mongoose = require('mongoose');

// const chuongTrinhTapHuanSchema = new mongoose.Schema({
//   tenChuongTrinh: {
//     type: String,
//     required: true, // Tên chương trình
//   },
//   thoiGianTapHuan: {
//     type: String,
//     required: true, // Thời gian tập huấn
//   },
//   thoiDiemToChuc: {
//     type: String,
//     required: true, // Thời điểm tổ chức
//   },
//   doiTuongVaSoLuong: {
//     type: String,
//     required: true, // Đối tượng tập huấn và số lượng
//   },
//   noiDungTapHuan: {
//     type: String,
//     required: true, // Nội dung tập huấn
//   },
//   chiuTrachNhiemChinh: {
//     type: String,
//     required: true, // Chịu trách nhiệm chính
//   },
//   khoa: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'khoa', // Tên của model `Khoa`
//     required: true, // Tên của khoa
//   },
// });

// module.exports = mongoose.model('ChuongTrinhTapHuan', chuongTrinhTapHuanSchema);
const mongoose = require('mongoose');

const chuongTrinhTapHuanSchema = new mongoose.Schema({
  tenChuongTrinh: {
    type: String,
    required: true, // Tên chương trình
  },
  thoiGianTapHuan: {
    type: String,
    required: true, // Thời gian tập huấn
  },
  thoiDiemToChuc: {
    type: String,
    required: true, // Thời điểm tổ chức
  },
  doiTuongVaSoLuong: {
    type: String,
    required: true, // Đối tượng tập huấn và số lượng
  },
  noiDungTapHuan: {
    type: String,
    required: true, // Nội dung tập huấn
  },
  chiuTrachNhiemChinh: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GiangVien', // Tham chiếu tới model Giảng viên
    required: true, // Chịu trách nhiệm chính (nhiều giảng viên)
  }],
  khoa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'khoa', // Tên của model `Khoa`
    required: true, // Tên của khoa
  },
});

module.exports = mongoose.model('ChuongTrinhTapHuan', chuongTrinhTapHuanSchema);
