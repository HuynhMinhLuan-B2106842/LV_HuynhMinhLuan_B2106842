const mongoose = require('mongoose');

const khoaSchema = new mongoose.Schema({
  ten: {
    type: String,
    required: true, // Tên chương trình
  },
  diaChi: {
    type: String,
    required: true, // Địa chỉ của khoa
  },
  linkBanDo: {
    type: String, // Link bản đồ đến khoa (Google Maps URL)
    required: false,
  },
  soDienThoai: {
    type: String, // Số điện thoại liên hệ
    required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10,11}$/.test(v); // Kiểm tra số điện thoại chỉ chứa 10-11 chữ số
      },
      message: (props) => `${props.value} không phải là số điện thoại hợp lệ!`,
    },
  },
  email: {
    type: String, // Email liên hệ của khoa
    required: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Kiểm tra email hợp lệ
      },
      message: (props) => `${props.value} không phải là email hợp lệ!`,
    },
  },
});

module.exports = mongoose.model('khoa', khoaSchema);
