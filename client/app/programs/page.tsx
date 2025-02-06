"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:9000/api/chuong-trinh";
const KHOA_API_URL = "http://localhost:9000/api/khoa"; // API lấy danh sách khoa

async function fetchPrograms() {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Lỗi khi lấy danh sách chương trình");
  }
  return res.json();
}

async function fetchKhoaList() {
  const res = await fetch(KHOA_API_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Lỗi khi lấy danh sách khoa");
  }
  return res.json();
}

export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKhoa, setSelectedKhoa] = useState(""); // Lưu trữ khoa được chọn
  const [khoaList, setKhoaList] = useState([]); // Danh sách khoa
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const programData = await fetchPrograms();
        setPrograms(programData);
      } catch (error) {
        setErrorMessage("Lỗi khi tải dữ liệu");
      }
    };

    const loadKhoaList = async () => {
      try {
        const khoaData = await fetchKhoaList();
        setKhoaList(khoaData);
      } catch (error) {
        setErrorMessage("Lỗi khi tải danh sách khoa");
      }
    };

    loadPrograms();
    loadKhoaList();
  }, []);

  const handleViewDetails = (id) => {
    router.push(`/programs/${id}`);
  };

  const handleAddProgram = () => {
    router.push("/programs/new");
  };

  // Lọc chương trình theo tên và khoa
  const filteredPrograms = programs.filter((program) => {
    return (
      program.tenChuongTrinh?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedKhoa === "" || program.khoa?._id === selectedKhoa)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Quản lý Chương trình Tập huấn</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm chương trình..."
          className="w-1/2 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Dropdown chọn khoa */}
        <select
          className="w-1/3 p-2 border rounded"
          value={selectedKhoa}
          onChange={(e) => setSelectedKhoa(e.target.value)}
        >
          <option value="">Tất cả khoa</option>
          {khoaList.map((khoa) => (
            <option key={khoa._id} value={khoa._id}>
              {khoa.ten}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddProgram}>
          Thêm Chương trình
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {filteredPrograms.map((program) => (
          <div
            key={program._id}
            className="bg-white shadow-md rounded-lg p-4 w-1/4 cursor-pointer"
            onClick={() => handleViewDetails(program._id)}
          >
            <span className="text-lg font-semibold">{program.tenChuongTrinh}</span>

            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Thời gian tập huấn:</strong> {program.thoiGianTapHuan}</p>
              <p><strong>Thời điểm tổ chức:</strong> {program.thoiDiemToChuc}</p>
              <p><strong>Đối tượng và số lượng:</strong> {program.doiTuongVaSoLuong}</p>
              {/* <p><strong>Khoa:</strong> {program.khoa?.ten || "Không xác định"}</p> */}
            </div>

            <div className="mt-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded">Chi tiết</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
