"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [gioiThieu, setGioiThieu] = useState(null);
  const [chuongTrinhList, setChuongTrinhList] = useState([]);
  const [featuredPrograms, setFeaturedPrograms] = useState([]);

  useEffect(() => {
    const fetchGioiThieu = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/gioi-thieu");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setGioiThieu(data[0]);
          setFeaturedPrograms(data[0].chuongtrinh);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giới thiệu:", error);
      }
    };
    fetchGioiThieu();
  }, []);

  useEffect(() => {
    const fetchChuongTrinh = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/chuong-trinh");
        const data = await response.json();
        setChuongTrinhList(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chương trình:", error);
      }
    };
    fetchChuongTrinh();
  }, []);

  if (!gioiThieu) {
    return <div className="text-center text-lg font-semibold">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-6">Chào mừng đến với Trang Web Đào Tạo</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tổng quan</h2>
        <p className="mb-4 whitespace-pre-line max-w-2xl mx-auto text-justify">{gioiThieu.tongquan}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Mục tiêu</h2>
        <ul className="mb-4 max-w-2xl mx-auto text-justify">
          {gioiThieu.muctieu.split("\n").map((line, index) => (
            <li key={index} className="mb-2"> {line}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Chương trình nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
          {featuredPrograms.length > 0 ? (
            featuredPrograms.map((chuong, index) => (
              <div key={index} className="bg-blue-100 p-4 rounded shadow-md mx-auto w-full max-w-md text-center">
                <h1 className="text-xl font-semibold mb-2">{chuong.tenChuongTrinh}</h1>
                <p><strong>Thời gian tập huấn:</strong> {chuong.thoiGianTapHuan}</p>
                <Link href={`/programs/${chuong._id}`} className="text-blue-600 hover:underline">
                  Tìm hiểu thêm
                </Link>
              </div>
            ))
          ) : (
            <p>Không có chương trình nổi bật nào.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Ưu đãi đặc biệt</h2>
        <div className="bg-yellow-100 p-4 rounded shadow-md mx-auto w-full max-w-md text-center">
          <h3 className="text-xl font-semibold mb-2">Giảm giá</h3>
          <p className="mb-4">{gioiThieu.giamgia}</p>
          <Link href="/programs" className="text-blue-600 hover:underline">
            Xem các chương trình
          </Link>
        </div>
      </section>
    </div>
  );
}
