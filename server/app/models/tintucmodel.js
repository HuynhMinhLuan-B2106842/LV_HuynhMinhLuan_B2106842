const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  tieuDe: {
    type: String,
    required: true, // Tiêu đề tin tức
  },
  moTaNgan: {
    type: String,
    required: true, // Mô tả ngắn
  },
  ngay: {
    type: Date,
    required: true, // Ngày đăng tin
  },
  noiDung: {
    type: String,
    required: false, // Nội dung chi tiết của tin tức (nếu cần)
  },
});

module.exports = mongoose.model('TinTuc', newsSchema);
