const TinTuc = require('../models/tintucmodel');

// Lấy danh sách tất cả tin tức
exports.layTatCaTinTuc = async (req, res) => {
  try {
    const danhSachTinTuc = await TinTuc.find();
    res.status(200).json(danhSachTinTuc);
  } catch (err) {
    res.status(500).json({ error: 'Không thể lấy danh sách tin tức' });
  }
};

// Lấy chi tiết tin tức theo ID
exports.layTinTucTheoId = async (req, res) => {
  try {
    const tinTuc = await TinTuc.findById(req.params.id);
    if (!tinTuc) {
      return res.status(404).json({ error: 'Không tìm thấy tin tức' });
    }
    res.status(200).json(tinTuc);
  } catch (err) {
    res.status(500).json({ error: 'Không thể lấy thông tin tin tức' });
  }
};

// Tạo mới tin tức
exports.taoTinTucMoi = async (req, res) => {
  try {
    const { tieuDe, moTaNgan, ngay, noiDung } = req.body;
    const tinTucMoi = new TinTuc({ tieuDe, moTaNgan, ngay, noiDung });
    const tinTucDaLuu = await tinTucMoi.save();
    res.status(201).json(tinTucDaLuu);
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo tin tức mới' });
  }
};

// Xóa tin tức
exports.xoaTinTuc = async (req, res) => {
  try {
    const tinTucDaXoa = await TinTuc.findByIdAndDelete(req.params.id);
    if (!tinTucDaXoa) {
      return res.status(404).json({ error: 'Không tìm thấy tin tức để xóa' });
    }
    res.status(200).json({ message: 'Xóa tin tức thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Không thể xóa tin tức' });
  }
};
// Cập nhật tin tức theo ID
exports.capNhatTinTuc = async (req, res) => {
  try {
    const { tieuDe, moTaNgan, ngay, noiDung } = req.body;
    const tinTucDaCapNhat = await TinTuc.findByIdAndUpdate(
      req.params.id,
      { tieuDe, moTaNgan, ngay, noiDung },
      { new: true, runValidators: true }
    );

    if (!tinTucDaCapNhat) {
      return res.status(404).json({ error: 'Không tìm thấy tin tức để cập nhật' });
    }

    res.status(200).json(tinTucDaCapNhat);
  } catch (err) {
    res.status(500).json({ error: 'Không thể cập nhật tin tức' });
  }
};
