const Register = require('../models/dangkymodel');

// Tạo mới một bản đăng ký

exports.taoDangKy = async (req, res) => {
    try {
        let { ten, email, soDienThoai, chuongTrinh, trangThaiDuyet } = req.body;

        // Chuẩn hóa email để tránh trùng lặp do chữ in hoa/thường
        email = email.toLowerCase().trim();

        // Kiểm tra xem đã có bản đăng ký nào với cùng email, số điện thoại và chương trình này chưa
        const existingRegistration = await Register.findOne({
            email,
            soDienThoai,
            chuongTrinh, // Chỉ kiểm tra trùng trong cùng một chương trình
        }).lean();

        if (existingRegistration) {
            return res.status(400).json({
                message: 'Email và số điện thoại này đã được đăng ký cho chương trình này'
            });
        }

        // Tạo một bản đăng ký mới
        const newRegistration = new Register({ ten, email, soDienThoai, chuongTrinh, trangThaiDuyet });
        await newRegistration.save();

        return res.status(201).json({ message: 'Đăng ký thành công', data: newRegistration });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi khi tạo đăng ký', error: error.message });
    }
};

  

// Lấy danh sách các bản đăng ký
exports.layDanhSachDangKy = async (req, res) => {
  try {
    const registrations = await Register.find()
      .populate('chuongTrinh', 'tenChuongTrinh') // Lấy thông tin chương trình từ model ChuongTrinh
      .exec();

    res.status(200).json({ message: 'Lấy danh sách đăng ký thành công', data: registrations });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đăng ký', error: error.message });
  }
};

// Lấy thông tin chi tiết của một bản đăng ký theo ID
exports.layDangKyTheoId = async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Register.findById(id).populate('chuongTrinh');

    if (!registration) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
    }

    res.status(200).json({ message: 'Lấy thông tin đăng ký thành công', data: registration });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin đăng ký', error: error.message });
  }
};

// Cập nhật thông tin đăng ký theo ID (bao gồm cả trạng thái duyệt)
exports.capNhatDangKy = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedRegistration = await Register.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedRegistration) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
    }

    res.status(200).json({ message: 'Cập nhật đăng ký thành công', data: updatedRegistration });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật đăng ký', error: error.message });
  }
};

// Xóa một bản đăng ký theo ID
exports.xoaDangKy = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRegistration = await Register.findByIdAndDelete(id);

    if (!deletedRegistration) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
    }

    res.status(200).json({ message: 'Xóa đăng ký thành công', data: deletedRegistration });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa đăng ký', error: error.message });
  }
};

// Cập nhật trạng thái duyệt
exports.capNhatTrangThaiDuyet = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThaiDuyet } = req.body; // Nhận trạng thái duyệt từ body (Đã duyệt / Chưa duyệt)

    if (!['Đã duyệt', 'Chưa duyệt'].includes(trangThaiDuyet)) {
      return res.status(400).json({ message: 'Trạng thái duyệt không hợp lệ' });
    }

    const updatedRegistration = await Register.findByIdAndUpdate(id, { trangThaiDuyet }, { new: true });

    if (!updatedRegistration) {
      return res.status(404).json({ message: 'Không tìm thấy đăng ký' });
    }

    res.status(200).json({ message: 'Cập nhật trạng thái duyệt thành công', data: updatedRegistration });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái duyệt', error: error.message });
  }
};
// Tra cứu thông tin đăng ký bằng email hoặc số điện thoại
// API tra cứu tất cả đăng ký
exports.traCuuDangKy = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa để tra cứu!' });
    }

    // Tìm tất cả các đăng ký có email hoặc số điện thoại khớp
    const registrations = await Register.find({
      $or: [{ email: keyword }, { soDienThoai: keyword }],
    }).populate('chuongTrinh', 'tenChuongTrinh');

    if (registrations.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin đăng ký!' });
    }

    res.status(200).json({ message: 'Tra cứu thành công', data: registrations });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin đăng ký', error: error.message });
  }
};

