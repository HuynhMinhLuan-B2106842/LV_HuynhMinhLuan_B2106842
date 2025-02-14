"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const API_URL = "http://localhost:9000/api/chuong-trinh";

async function fetchProgram(id) {
  const res = await fetch(`${API_URL}/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Lỗi khi lấy dữ liệu chương trình");
  }
  return res.json();
}

export default function ProgramDetails() {
  const [program, setProgram] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id !== "new") {
          const programData = await fetchProgram(id);
          setProgram(programData);
        }
      } catch (error) {
        setErrorMessage("Lỗi khi tải dữ liệu");
      }
    };
    loadData();
  }, [id]);

  if (!program) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Chi tiết Chương trình</h1>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <p><strong>Tên chương trình:</strong> {program.tenChuongTrinh}</p>
        <p><strong>Thời gian tập huấn:</strong> {program.thoiGianTapHuan}</p>
        <p><strong>Thời điểm tổ chức:</strong> {program.thoiDiemToChuc}</p>
        <p className="mb-4 whitespace-pre-line">
          <strong>Đối tượng và số lượng:</strong> {"\n" + program.doiTuongVaSoLuong}
        </p>
        <p className="mb-4 whitespace-pre-line">
          <strong>Nội dung tập huấn:</strong> {"\n" + program.noiDungTapHuan}
        </p>
        <p><strong>Khoa:</strong> {program.khoa?.ten || "Không có"}</p>
        <p><strong>Chịu trách nhiệm chính:</strong></p>
        <ul>
          {program.chiuTrachNhiemChinh && program.chiuTrachNhiemChinh.length > 0 ? (
            program.chiuTrachNhiemChinh.map((gv) => (
              <li key={gv._id}>{gv.ten}</li>
            ))
          ) : (
            <p>Không có</p>
          )}
        </ul>
        <div className="flex mt-4">
          <button
            onClick={() => router.push("/programs")}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
