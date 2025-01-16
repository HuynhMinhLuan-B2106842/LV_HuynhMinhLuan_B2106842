const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  chuyenNganh: { type: String, required: true }, // Chuyên ngành sẽ là một trong các giá trị trong mảng chuyenNganh của khoa
  kinhNghiem: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        return /^\d+$/.test(value); // Kiểm tra xem giá trị có phải là số không
      },
      message: 'Kinh nghiệm phải là một số'
    }
  },
  hinhAnh: { type: String, required: true },
  lienHe: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value); // Kiểm tra email hợp lệ
      },
      message: 'Địa chỉ email không hợp lệ'
    }
  },
  khoa: { type: mongoose.Schema.Types.ObjectId, ref: 'khoa', required: true } // Tham chiếu đến model khoa
});

module.exports = mongoose.model('GiangVien', teacherSchema);
