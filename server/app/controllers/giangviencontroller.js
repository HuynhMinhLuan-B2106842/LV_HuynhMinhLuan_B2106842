const GiangVien = require('../models/giangvienmodel');

// Thêm giảng viên mới
exports.themGiangVien = async (req, res) => {
  try {
    const { ten, chuyenMon, kinhNghiem, lienHe, khoa } = req.body;
    const hinhAnh = req.file ? req.file.path.replace('uploads\\', '') : null;

    if (!ten || !chuyenMon || !kinhNghiem || !lienHe || !khoa) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    }

    const giangVien = new GiangVien({ ten, chuyenMon, kinhNghiem, hinhAnh, lienHe, khoa });
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
    const { ten, chuyenMon, kinhNghiem, lienHe, khoa } = req.body;
    const hinhAnh = req.file ? req.file.path.replace('uploads\\', '') : undefined;

    const updatedFields = { ten, chuyenMon, kinhNghiem, lienHe, khoa };
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
