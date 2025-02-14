'use client';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:9000/api/giang-vien';
const KHOA_API_URL = 'http://localhost:9000/api/khoa';

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
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [form, setForm] = useState({
    _id: '',
    ten: '',
    chuyenNganh: '',
    kinhNghiem: '',
    lienHe: '',
    khoa: '',
    hinhAnh: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadTeachersAndDepartments = async () => {
      try {
        const [teacherData, departmentData] = await Promise.all([
          fetchTeachers(),
          fetchDepartments(),
        ]);
        setTeachers(teacherData);
        setDepartments(departmentData);
      } catch (error) {
        setErrorMessage('Lỗi khi tải dữ liệu');
      }
    };
    loadTeachersAndDepartments();
  }, []);

  useEffect(() => {
    // Khi khoa thay đổi, cập nhật chuyên ngành từ mảng trong khoa
    const department = departments.find(dep => dep._id === form.khoa);
    if (department) {
      setMajors(department.chuyenNganh || []); // Lấy mảng chuyên ngành từ khoa
    } else {
      setMajors([]);
    }
  }, [form.khoa, departments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, hinhAnh: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('ten', form.ten);
      formData.append('chuyenNganh', form.chuyenNganh);
      formData.append('kinhNghiem', form.kinhNghiem);
      formData.append('lienHe', form.lienHe);
      formData.append('khoa', form.khoa);
      if (form.hinhAnh) {
        formData.append('hinhAnh', form.hinhAnh);
      }

      let res;
      if (isEditing) {
        res = await fetch(`${API_URL}/${form._id}`, {
          method: 'PUT',
          body: formData,
        });
        if (!res.ok) throw new Error('Lỗi khi cập nhật giảng viên');
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Lỗi khi thêm giảng viên');
      }

      setForm({ _id: '', ten: '', chuyenNganh: '', kinhNghiem: '', lienHe: '', khoa: '', hinhAnh: null });
      setIsEditing(false);
      const updatedTeachers = await fetchTeachers();
      setTeachers(updatedTeachers);
      setShowForm(false);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleEdit = (teacher) => {
    setForm({ ...teacher, hinhAnh: null });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Lỗi khi xóa giảng viên');
      setTeachers(teachers.filter((teacher) => teacher._id !== id));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Đội ngũ Giảng viên</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Sửa Giảng viên' : 'Thêm Giảng viên'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="ten"
                  placeholder="Tên giảng viên"
                  value={form.ten}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                />
                <select
                  name="khoa"
                  value={form.khoa}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                >
                  <option value="">Chọn khoa</option>
                  {departments.map((khoa) => (
                    <option key={khoa._id} value={khoa._id}>
                      {khoa.ten}
                    </option>
                  ))}
                </select>
                <select
                  name="chuyenNganh"
                  value={form.chuyenNganh}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                  disabled={!form.khoa}
                >
                  <option value="">Chọn chuyên ngành</option>
                  {majors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="kinhNghiem"
                  placeholder="Số năm kinh nghiệm"
                  value={form.kinhNghiem}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  name="lienHe"
                  placeholder="Email liên hệ"
                  value={form.lienHe}
                  onChange={handleInputChange}
                  required
                  className="border p-2 rounded"
                />

                <label htmlFor="avatar" className="cursor-pointer inline-block px-4 py-2 rounded">
                  Thêm avatar
                </label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {form.hinhAnh && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(form.hinhAnh)}
                      alt="Avatar preview"
                      className="w-32 h-32 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                {isEditing ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Thêm Giảng viên
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={teacher.hinhAnh ? `http://localhost:9000/uploads/${teacher.hinhAnh}` : '/placeholder.svg'}
              alt={`Hình ảnh của giảng viên ${teacher.ten}`}
              className="w-full h-64 object-contain"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{teacher.ten}</h2>
              <p>
                <strong>Chuyên ngành:</strong> {teacher.chuyenNganh}
              </p>
              <p>
                <strong>Kinh nghiệm:</strong> {teacher.kinhNghiem}
                 năm
              </p>
              <p>
                <strong>Liên hệ:</strong> {teacher.lienHe}
              </p>
              <p>
                <strong>Khoa:</strong> {teacher.khoa ? teacher.khoa.ten : 'Chưa có khoa'}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(teacher)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(teacher._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
