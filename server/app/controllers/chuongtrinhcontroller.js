const ChuongTrinh = require('../models/chuongtrinhmodel');

// Lấy danh sách tất cả các chương trình
exports.layTatCaChuongTrinh = async (req, res) => {
  try {
    const chuongTrinhs = await ChuongTrinh.find();
    res.json(chuongTrinhs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết chương trình theo ID
exports.layChuongTrinhTheoId = async (req, res) => {
  try {
    const chuongTrinh = await ChuongTrinh.findById(req.params.id);
    if (!chuongTrinh) return res.status(404).json({ message: 'Không tìm thấy chương trình!' });
    res.json(chuongTrinh);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm mới một chương trình
exports.taoMoiChuongTrinh = async (req, res) => {
  const { ten, moTa, giangVien, thoiLuong, diaDiem, gia, dangKy } = req.body;
  try {
    const chuongTrinhMoi = new ChuongTrinh({ ten, moTa, giangVien, thoiLuong, diaDiem, gia, dangKy });
    const luuChuongTrinh = await chuongTrinhMoi.save();
    res.status(201).json(luuChuongTrinh);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật chương trình
exports.capNhatChuongTrinh = async (req, res) => {
  try {
    const capNhat = await ChuongTrinh.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!capNhat) return res.status(404).json({ message: 'Không tìm thấy chương trình!' });
    res.json(capNhat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa một chương trình
exports.xoaChuongTrinh = async (req, res) => {
  try {
    const xoa = await ChuongTrinh.findByIdAndDelete(req.params.id);
    if (!xoa) return res.status(404).json({ message: 'Không tìm thấy chương trình!' });
    res.json({ message: 'Xóa chương trình thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
