const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  chuyenMon: { type: String, required: true },
  kinhNghiem: { type: String, required: true },
  hinhAnh: { type: String, required: true },
  lienHe: { type: String, required: true },
  khoa: { type: mongoose.Schema.Types.ObjectId, ref: 'khoa', required: true } // Tham chiếu đến model khoa
})

module.exports = mongoose.model('GiangVien', teacherSchema);
