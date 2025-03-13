"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

const API_URL = "http://localhost:9000/api/chuong-trinh";  // API lấy chi tiết chương trình
const RECOMMEND_API_URL = "http://localhost:8001/recommend"; // API gợi ý chương trình

// Fetch chương trình theo _id
async function fetchProgram(id) {
  const res = await fetch(`${API_URL}/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Lỗi khi lấy dữ liệu chương trình");
  }
  return res.json();
}

// Fetch gợi ý chương trình theo _id
async function fetchRecommendations(programId) {
  const res = await fetch(`${RECOMMEND_API_URL}/${programId}`, { mode: 'cors' });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export default function ProgramDetails() {
  const [program, setProgram] = useState(null);
  const [recommendedPrograms, setRecommendedPrograms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id && id !== "new") {
          const programData = await fetchProgram(id);
          setProgram(programData);

          // Lấy danh sách chương trình gợi ý
          const recData = await fetchRecommendations(programData._id);
          if (recData && recData.recommendations) {
            // Fetch chi tiết từng chương trình từ API chính
            const recommendedDetails = await Promise.all(
              recData.recommendations.map(async (rec) => {
                try {
                  return await fetchProgram(rec.id);
                } catch {
                  return null;
                }
              })
            );

            // Lọc ra những chương trình hợp lệ
            setRecommendedPrograms(recommendedDetails.filter((item) => item !== null));
          }
        } else {
          setErrorMessage("ID không hợp lệ.");
        }
      } catch (error) {
        setErrorMessage("Lỗi khi tải dữ liệu");
      }
    };
    if (id) loadData();
  }, [id]);

  if (!program) {
    return <p>Đang tải...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Chi tiết chương trình */}
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

      {/* Chương trình gợi ý dưới dạng thẻ */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Chương trình gợi ý</h2>
        {recommendedPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedPrograms.map((rec) => (
              <div key={rec._id} className="bg-white p-4 shadow-md rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold">{rec.tenChuongTrinh}</h3>
                <p className="text-gray-700 mt-2"><strong>Thời gian:</strong> {rec.thoiGianTapHuan}</p>
                <p className="text-gray-700 mt-2"><strong>Thời điểm:</strong> {rec.thoiDiemToChuc}</p>
                <p className="text-gray-600 mt-2 text-sm">
                  <strong>Nội dung:</strong> {rec.noiDungTapHuan.length > 100 ? rec.noiDungTapHuan.substring(0, 100) + "..." : rec.noiDungTapHuan}
                </p>
                <button
                  onClick={() => router.push(`/programs/${rec._id}`)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Không có chương trình tương tự.</p>
        )}
      </div>
    </div>
  );
}
