"use client";

import { useState, useEffect } from "react";

const API_URL = "http://localhost:9000/api/thong-ke";

async function fetchStatistics() {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Lỗi khi lấy dữ liệu thống kê");
  }
  return res.json();
}

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStatistics();
        setStats(data);
      } catch (error) {
        setErrorMessage("Lỗi khi tải dữ liệu");
      }
    };
    loadStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Thống kê</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Chương trình</h2>
            <p className="text-2xl">{stats.soChuongTrinh}</p>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Tin tức</h2>
            <p className="text-2xl">{stats.soTinTuc}</p>
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Giảng viên</h2>
            <p className="text-2xl">{stats.soGiangVien}</p>
          </div>

          <div className="bg-red-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Đăng ký</h2>
            <p className="text-2xl">{stats.soDangKy}</p>
          </div>
        </div>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
