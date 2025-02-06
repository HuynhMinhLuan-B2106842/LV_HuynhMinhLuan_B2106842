const express = require("express");
const router = express.Router();
const ChuongTrinhTapHuan = require("../models/chuongtrinhmodel");
const TinTuc = require("../models/tintucmodel"); // Thêm model tin tức
const GiangVien = require("../models/giangvienmodel");
const DangKy = require("../models/dangkymodel"); // Thêm model đăng ký

router.get("/", async (req, res) => {
  try {
    const soChuongTrinh = await ChuongTrinhTapHuan.countDocuments();
    const soTinTuc = await TinTuc.countDocuments();
    const soGiangVien = await GiangVien.countDocuments();
    const soDangKy = await DangKy.countDocuments();

    res.json({
      soChuongTrinh,
      soTinTuc,
      soGiangVien,
      soDangKy,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu thống kê" });
  }
});

module.exports = router;
