const GiangVien = require('../models/giangvienmodel');
const Khoa = require('../models/khoamodel');

// Thêm giảng viên mới
exports.themGiangVien = async (req, res) => {
  try {
    const { ten, chuyenNganh, kinhNghiem, lienHe, khoa } = req.body;
    const hinhAnh = req.file ? req.file.path.replace('uploads\\', '') : null;

    if (!ten || !chuyenNganh || !kinhNghiem || !lienHe || !khoa) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    }

    // Kiểm tra xem chuyên ngành có thuộc mảng chuyên ngành của khoa không
    const khoaInfo = await Khoa.findById(khoa);
    if (!khoaInfo || !khoaInfo.chuyenNganh.includes(chuyenNganh)) {
      return res.status(400).json({ error: 'Chuyên ngành không hợp lệ trong khoa.' });
    }

    const giangVien = new GiangVien({ ten, chuyenNganh, kinhNghiem, hinhAnh, lienHe, khoa });
    await giangVien.save();

    res.status(201).json(giangVien);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi thêm giảng viên.' });
  }
};

// Lấy danh sách giảng viên
exports.layDanhSachGiangVien = async (req, res) => {
  try {
    const giangVien = await GiangVien.find().populate('khoa', 'ten'); // Lấy tên khoa
    res.status(200).json(giangVien);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách giảng viên.' });
  }
};

// Lấy thông tin giảng viên theo ID
exports.layGiangVienTheoId = async (req, res) => {
  try {
    const giangVien = await GiangVien.findById(req.params.id).populate('khoa', 'ten diaChi');
    if (!giangVien) {
      return res.status(404).json({ error: 'Không tìm thấy giảng viên.' });
    }
    res.status(200).json(giangVien);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin giảng viên.' });
  }
};

// Cập nhật thông tin giảng viên
exports.capNhatGiangVien = async (req, res) => {
  try {
    const { ten, chuyenNganh, kinhNghiem, lienHe, khoa } = req.body;
    const hinhAnh = req.file ? req.file.path.replace('uploads\\', '') : undefined;

    // Kiểm tra xem chuyên ngành có thuộc mảng chuyên ngành của khoa không
    const khoaInfo = await Khoa.findById(khoa);
    if (!khoaInfo || !khoaInfo.chuyenNganh.includes(chuyenNganh)) {
      return res.status(400).json({ error: 'Chuyên ngành không hợp lệ trong khoa.' });
    }

    const updatedFields = { ten, chuyenNganh, kinhNghiem, lienHe, khoa };
    if (hinhAnh) updatedFields.hinhAnh = hinhAnh;

    const giangVien = await GiangVien.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    ).populate('khoa', 'ten');

    if (!giangVien) {
      return res.status(404).json({ error: 'Không tìm thấy giảng viên.' });
    }

    res.status(200).json(giangVien);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi cập nhật giảng viên.' });
  }
};

// Xóa giảng viên
exports.xoaGiangVien = async (req, res) => {
  try {
    const giangVien = await GiangVien.findByIdAndDelete(req.params.id);

    if (!giangVien) {
      return res.status(404).json({ error: 'Không tìm thấy giảng viên.' });
    }

    res.status(200).json({ message: 'Đã xóa giảng viên thành công.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi xóa giảng viên.' });
  }
};
