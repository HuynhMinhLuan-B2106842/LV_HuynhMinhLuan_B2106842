"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [gioiThieu, setGioiThieu] = useState(null);
  const [chuongTrinhList, setChuongTrinhList] = useState([]); // Thêm state cho danh sách chương trình
  const [featuredPrograms, setFeaturedPrograms] = useState([]); // Lưu chương trình nổi bật

  // Lấy dữ liệu giới thiệu từ API
  useEffect(() => {
    const fetchGioiThieu = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/gioi-thieu");
        const data = await response.json();
        console.log("Dữ liệu giới thiệu nhận được:", data);
        if (Array.isArray(data) && data.length > 0) {
          setGioiThieu(data[0]);
          setFeaturedPrograms(data[0].chuongtrinh); // Lưu các chương trình trong giới thiệu
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giới thiệu:", error);
      }
    };

    fetchGioiThieu();
  }, []);

  // Lấy danh sách tất cả chương trình từ API
  useEffect(() => {
    const fetchChuongTrinh = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/chuong-trinh");
        const data = await response.json();
        console.log("Dữ liệu chương trình nhận được:", data);
        setChuongTrinhList(data); // Lưu danh sách chương trình vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chương trình:", error);
      }
    };

    fetchChuongTrinh();
  }, []);

  if (!gioiThieu) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        Chào mừng đến với Trang Web Đào Tạo của chúng tôi
      </h1>

      {/* Hiển thị nội dung hiện tại */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tổng quan</h2>
        <p className="mb-4">{gioiThieu.tongquan}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Mục tiêu</h2>
        <ul className="mb-4">
          {gioiThieu.muctieu.split("\n").map((line, index) => (
            <li key={index} className="mb-2">- {line}</li>
          ))}
        </ul>
      </section>

      {/* Các chương trình nổi bật */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Chương trình nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredPrograms && featuredPrograms.length > 0 ? (
            featuredPrograms.map((chuong, index) => (
              <div key={index} className="bg-blue-100 p-4 rounded">
                <h3 className="text-xl font-semibold mb-2">{chuong.tenChuongTrinh}</h3>
                <p>{chuong.noiDungTapHuan}</p>
                <Link
                  href={`/programs/${chuong._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            ))
          ) : (
            <p>Không có chương trình nổi bật nào.</p>
          )}
        </div>
      </section>

      {/* Ưu đãi đặc biệt */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Ưu đãi đặc biệt</h2>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Giảm giá mùa hè</h3>
          <p className="mb-4">{gioiThieu.giamgia}</p>
          <Link href="/programs" className="text-blue-600 hover:underline">
            Xem các chương trình
          </Link>
        </div>
      </section>
    </div>
  );
}
