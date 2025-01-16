const Khoa = require('../models/khoamodel');

// Lấy danh sách khoa
exports.layDanhSachKhoa = async (req, res) => {
  try {
    const khoas = await Khoa.find();
    res.status(200).json(khoas);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách khoa.' });
  }
};

// Lấy thông tin khoa theo ID
exports.layKhoaTheoId = async (req, res) => {
  try {
    const khoa = await Khoa.findById(req.params.id);
    if (!khoa) {
      return res.status(404).json({ error: 'Không tìm thấy khoa.' });
    }
    res.status(200).json(khoa);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy thông tin khoa.' });
  }
};

// Tạo mới khoa
exports.taoKhoa = async (req, res) => {
  try {
    const { ten, diaChi, linkBanDo, soDienThoai, email, chuyenNganh } = req.body;

    const newKhoa = new Khoa({
      ten,
      diaChi,
      linkBanDo,
      soDienThoai,
      email,
      chuyenNganh, // Thêm danh sách chuyên ngành
    });

    const savedKhoa = await newKhoa.save();
    res.status(201).json(savedKhoa);
  } catch (error) {
    res.status(400).json({ error: 'Lỗi khi tạo khoa.', details: error.message });
  }
};

// Cập nhật khoa theo ID
exports.capNhatKhoa = async (req, res) => {
  try {
    const { ten, diaChi, linkBanDo, soDienThoai, email, chuyenNganh } = req.body;

    const updatedKhoa = await Khoa.findByIdAndUpdate(
      req.params.id,
      { ten, diaChi, linkBanDo, soDienThoai, email, chuyenNganh }, // Cập nhật cả danh sách chuyên ngành
      { new: true, runValidators: true }
    );

    if (!updatedKhoa) {
      return res.status(404).json({ error: 'Không tìm thấy khoa.' });
    }

    res.status(200).json(updatedKhoa);
  } catch (error) {
    res.status(400).json({ error: 'Lỗi khi cập nhật khoa.', details: error.message });
  }
};

// Xóa khoa theo ID
exports.xoaKhoa = async (req, res) => {
  try {
    const deletedKhoa = await Khoa.findByIdAndDelete(req.params.id);

    if (!deletedKhoa) {
      return res.status(404).json({ error: 'Không tìm thấy khoa.' });
    }

    res.status(200).json({ message: 'Xóa khoa thành công.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa khoa.' });
  }
};
