// y
const ChuongTrinhTapHuan = require('../models/chuongtrinhmodel');
const GiangVien = require('../models/giangvienmodel'); // Thêm model giảng viên nếu cần

// Lấy danh sách tất cả các chương trình (bao gồm thông tin khoa và giảng viên chịu trách nhiệm chính)
exports.layTatCaChuongTrinh = async (req, res) => {
  try {
    const chuongTrinhs = await ChuongTrinhTapHuan.find()
      .populate('khoa', 'ten') // Populate khoa
      .populate('chiuTrachNhiemChinh', 'ten'); // Populate giảng viên chịu trách nhiệm

    res.json(chuongTrinhs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết chương trình theo ID (bao gồm thông tin khoa và giảng viên chịu trách nhiệm chính)
exports.layChuongTrinhTheoId = async (req, res) => {
  try {
    const chuongTrinh = await ChuongTrinhTapHuan.findById(req.params.id)
      .populate('khoa', 'ten') // Populate khoa
      .populate('chiuTrachNhiemChinh', 'ten'); // Populate giảng viên chịu trách nhiệm

    if (!chuongTrinh) return res.status(404).json({ message: 'Không tìm thấy chương trình!' });
    res.json(chuongTrinh);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm chương trình tập huấn mới
exports.taoMoiChuongTrinh = async (req, res) => {
  try {
    const {
      tenChuongTrinh, thoiGianTapHuan, thoiDiemToChuc, doiTuongVaSoLuong, 
      noiDungTapHuan, chiuTrachNhiemChinh, khoa,
    } = req.body;

    if (!tenChuongTrinh || !thoiGianTapHuan || !thoiDiemToChuc || !doiTuongVaSoLuong || !noiDungTapHuan || !chiuTrachNhiemChinh || !khoa) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    }

    // Kiểm tra giảng viên chịu trách nhiệm chính
    const giangVienList = await GiangVien.find({ '_id': { $in: chiuTrachNhiemChinh } });
    const invalidGiangViens = chiuTrachNhiemChinh.filter(id => !giangVienList.some(gv => gv._id.toString() === id));

    if (invalidGiangViens.length > 0) {
      return res.status(400).json({ error: `Giảng viên với ID ${invalidGiangViens.join(', ')} không hợp lệ.` });
    }

    const chuongTrinh = new ChuongTrinhTapHuan({
      tenChuongTrinh,
      thoiGianTapHuan,
      thoiDiemToChuc,
      doiTuongVaSoLuong,
      noiDungTapHuan,
      chiuTrachNhiemChinh,
      khoa,
    });

    await chuongTrinh.save();
    res.status(201).json(chuongTrinh);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi thêm chương trình tập huấn.' });
  }
};

// Cập nhật chương trình tập huấn
exports.capNhatChuongTrinh = async (req, res) => {
  try {
    const {
      tenChuongTrinh, thoiGianTapHuan, thoiDiemToChuc, doiTuongVaSoLuong, 
      noiDungTapHuan, chiuTrachNhiemChinh, khoa,
    } = req.body;

    // Kiểm tra giảng viên chịu trách nhiệm chính
    const giangVienList = await GiangVien.find({ '_id': { $in: chiuTrachNhiemChinh } });
    const invalidGiangViens = chiuTrachNhiemChinh.filter(id => !giangVienList.some(gv => gv._id.toString() === id));

    if (invalidGiangViens.length > 0) {
      return res.status(400).json({ error: `Giảng viên với ID ${invalidGiangViens.join(', ')} không hợp lệ.` });
    }

    const chuongTrinh = await ChuongTrinhTapHuan.findByIdAndUpdate(
      req.params.id,
      {
        tenChuongTrinh,
        thoiGianTapHuan,
        thoiDiemToChuc,
        doiTuongVaSoLuong,
        noiDungTapHuan,
        chiuTrachNhiemChinh,
        khoa,
      },
      { new: true }
    );

    if (!chuongTrinh) {
      return res.status(404).json({ error: 'Không tìm thấy chương trình tập huấn.' });
    }

    res.status(200).json(chuongTrinh);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi cập nhật chương trình tập huấn.' });
  }
};

// Xóa một chương trình
exports.xoaChuongTrinh = async (req, res) => {
  try {
    const xoa = await ChuongTrinhTapHuan.findByIdAndDelete(req.params.id);
    if (!xoa) return res.status(404).json({ message: 'Không tìm thấy chương trình!' });
    res.json({ message: 'Xóa chương trình thành công!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Hàm chuẩn hóa chuỗi tìm kiếm
const normalizeText = (text) => {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

exports.timKiemChuongTrinh = async (req, res) => {
  try {
    const searchTerm = req.query.q || "";
    const normalizedSearch = normalizeText(searchTerm);

    const programs = await ChuongTrinhTapHuan.find({})
      .populate('chiuTrachNhiemChinh', 'ten')
      .populate('khoa', 'ten');

    const filteredPrograms = programs.filter(program => {
      const fieldsToSearch = [
        program.tenChuongTrinh,
        program.thoiGianTapHuan,
        program.thoiDiemToChuc,
        program.doiTuongVaSoLuong,
        program.noiDungTapHuan,
        program.khoa?.ten,
        ...(program.chiuTrachNhiemChinh || []).map(gv => gv.ten)
      ];

      return fieldsToSearch.some(field =>
        field ? normalizeText(field).includes(normalizedSearch) : false
      );
    });

    res.json(filteredPrograms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};