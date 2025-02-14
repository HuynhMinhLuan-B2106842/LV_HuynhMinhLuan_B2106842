'use client';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:9000/api/giang-vien';
const KHOA_API_URL = 'http://localhost:9000/api/khoa'; // API để lấy danh sách các khoa

async function fetchTeachers() {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Lỗi khi lấy danh sách giảng viên');
  }
  return res.json();
}

async function fetchDepartments() {
  const res = await fetch(KHOA_API_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Lỗi khi lấy danh sách khoa');
  }
  return res.json();
}

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]); // Dữ liệu khoa
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadTeachersAndDepartments = async () => {
      try {
        const [teacherData, departmentData] = await Promise.all([
          fetchTeachers(),
          fetchDepartments(),
        ]);
        setTeachers(teacherData);
        setDepartments(departmentData); // Lưu danh sách khoa
      } catch (error) {
        setErrorMessage('Lỗi khi tải dữ liệu');
      }
    };
    loadTeachersAndDepartments();
  }, []);

  // Sắp xếp giảng viên theo khoa
  const sortedTeachers = teachers.reduce((acc, teacher) => {
    const departmentName = teacher.khoa ? teacher.khoa.ten : 'Chưa có khoa';
    if (!acc[departmentName]) {
      acc[departmentName] = [];
    }
    acc[departmentName].push(teacher);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Đội ngũ Giảng viên</h1>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Hiển thị giảng viên theo khoa */}
      {Object.keys(sortedTeachers).map((departmentName) => (
        <div key={departmentName} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{departmentName}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTeachers[departmentName].map((teacher) => (
              <div key={teacher._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <img
                  src={teacher.hinhAnh ? `http://localhost:9000/uploads/${teacher.hinhAnh}` : '/placeholder.svg'}
                  alt={`Hình ảnh của giảng viên ${teacher.ten}`}
                  className="w-full h-64 object-contain"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{teacher.ten}</h3>
                  <p>
                    <strong>Chuyên môn:</strong> {teacher.chuyenNganh}
                  </p>
                  <p>
                    <strong>Kinh nghiệm:</strong> {teacher.kinhNghiem}
                  </p>
                  <p>
                    <strong>Liên hệ:</strong> {teacher.lienHe}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
