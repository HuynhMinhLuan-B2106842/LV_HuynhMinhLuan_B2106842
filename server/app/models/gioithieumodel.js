const mongoose = require('mongoose');

const GioiThieuSchema = new mongoose.Schema({
  tongquan: { type: String, required: true },
  muctieu: { type: String, required: true },
  giamgia: { type: String, default: "0" },
  chuongtrinh: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChuongTrinhTapHuan',  // Tham chiếu tới model Chương Trình Tập Huấn
    required: true,
  }]
});

module.exports = mongoose.model('GioiThieu', GioiThieuSchema);
