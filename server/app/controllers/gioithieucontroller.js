const GioiThieu = require('../models/gioithieumodel');

// Lấy danh sách giới thiệu
exports.layDanhSachGioiThieu = async (req, res) => {
  try {
    const danhSachGioiThieu = await GioiThieu.find().populate('chuongtrinh');  // Dùng populate để lấy thông tin chương trình
    res.json(danhSachGioiThieu);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Lấy thông tin một giới thiệu theo ID
exports.layGioiThieuTheoId = async (req, res) => {
  try {
    const gioiThieu = await GioiThieu.findById(req.params.id).populate('chuongtrinh');  // Dùng populate cho trường chuongtrinh
    if (!gioiThieu) {
      return res.status(404).json({ message: 'Không tìm thấy giới thiệu' });
    }
    res.json(gioiThieu);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Thêm mới giới thiệu
exports.themGioiThieu = async (req, res) => {
  try {
    const { tongquan, muctieu, lienket, giamgia, chuongtrinh } = req.body;  // Thêm chuongtrinh vào
    const gioiThieuMoi = new GioiThieu({ tongquan, muctieu, lienket, giamgia, chuongtrinh });
    await gioiThieuMoi.save();
    res.status(201).json(gioiThieuMoi);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Cập nhật giới thiệu theo ID
exports.capNhatGioiThieu = async (req, res) => {
  try {
    const { tongquan, muctieu, lienket, giamgia, chuongtrinh } = req.body;  // Thêm chuongtrinh vào
    const gioiThieuCapNhat = await GioiThieu.findByIdAndUpdate(
      req.params.id,
      { tongquan, muctieu, lienket, giamgia, chuongtrinh },  // Cập nhật chuongtrinh
      { new: true }
    );
    if (!gioiThieuCapNhat) {
      return res.status(404).json({ message: 'Không tìm thấy giới thiệu' });
    }
    res.json(gioiThieuCapNhat);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};

// Xóa giới thiệu theo ID
exports.xoaGioiThieu = async (req, res) => {
  try {
    const gioiThieuDaXoa = await GioiThieu.findByIdAndDelete(req.params.id);
    if (!gioiThieuDaXoa) {
      return res.status(404).json({ message: 'Không tìm thấy giới thiệu' });
    }
    res.json({ message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error });
  }
};
