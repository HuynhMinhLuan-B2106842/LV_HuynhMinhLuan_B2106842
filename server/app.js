const express = require('express');
const chuongTrinhRouter = require('./app/routers/chuongtrinhrouter'); // Import router cho chương trình đào tạo
const giangvienrouter = require('./app/routers/giangvienrouter');
const khoaRouter = require('./app/routers/khoarouter');
const dangkyRouter = require('./app/routers/dangkyrouter');
const tintucRouter = require('./app/routers/tintucrouter');
const gioithieuRouter = require('./app/routers/gioithieurouter');
const thongkeRouter = require('./app/routers/thongkerouter');
const path = require('path');  // Để xử lý đường dẫn
const app = express();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Thêm middleware để phục vụ tệp tin hình ảnh
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sử dụng router
app.use('/api/chuong-trinh', chuongTrinhRouter); // Sử dụng route cho chương trình đào tạo
app.use('/api/giang-vien', giangvienrouter);
app.use('/api/khoa', khoaRouter);
app.use('/api/dang-ky', dangkyRouter);
app.use('/api/tin-tuc', tintucRouter);
app.use('/api/gioi-thieu',gioithieuRouter)
app.use('/api/thong-ke',thongkeRouter)

module.exports = app;
