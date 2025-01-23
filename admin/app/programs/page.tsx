"use client"

import { useState, useEffect } from "react"

const API_URL = "http://localhost:9000/api/chuong-trinh"
const KHOA_API_URL = "http://localhost:9000/api/khoa"
const GIANGVIEN_API_URL = "http://localhost:9000/api/giang-vien/khoa"

async function fetchPrograms() {
  const res = await fetch(API_URL, { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Lỗi khi lấy danh sách chương trình")
  }
  return res.json()
}

async function fetchDepartments() {
  const res = await fetch(KHOA_API_URL, { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Lỗi khi lấy danh sách khoa")
  }
  return res.json()
}

async function fetchLecturersByDepartment(khoaId) {
  const res = await fetch(`${GIANGVIEN_API_URL}/${khoaId}`)
  if (!res.ok) {
    throw new Error("Lỗi khi lấy danh sách giảng viên")
  }
  return res.json()
}

export default function Programs() {
  const [programs, setPrograms] = useState([])
  const [departments, setDepartments] = useState([])
  const [lecturers, setLecturers] = useState([])
  const [form, setForm] = useState({
    _id: "",
    tenChuongTrinh: "",
    thoiGianTapHuan: "",
    thoiDiemToChuc: "",
    doiTuongVaSoLuong: "",
    noiDungTapHuan: "",
    chiuTrachNhiemChinh: [],
    khoa: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const loadProgramsAndDepartments = async () => {
      try {
        const [programData, departmentData] = await Promise.all([fetchPrograms(), fetchDepartments()])
        setPrograms(programData)
        setDepartments(departmentData)
      } catch (error) {
        setErrorMessage("Lỗi khi tải dữ liệu")
      }
    }
    loadProgramsAndDepartments()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleDepartmentChange = async (e) => {
    const khoaId = e.target.value
    setForm({ ...form, khoa: khoaId, chiuTrachNhiemChinh: [] })

    if (khoaId) {
      try {
        const lecturersData = await fetchLecturersByDepartment(khoaId)
        setLecturers(lecturersData)
      } catch (error) {
        setErrorMessage("Lỗi khi lấy giảng viên")
      }
    } else {
      setLecturers([])
    }
  }

  const handleLecturerChange = (e) => {
    const selectedLecturers = Array.from(e.target.selectedOptions, option => option.value)
    setForm({ ...form, chiuTrachNhiemChinh: selectedLecturers })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submissionData = {
        ...form,
        chiuTrachNhiemChinh: form.chiuTrachNhiemChinh,
      }

      const res = isEditing
        ? await fetch(`${API_URL}/${form._id}`, {
            method: "PUT",
            body: JSON.stringify(submissionData),
            headers: { "Content-Type": "application/json" },
          })
        : await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(submissionData),
            headers: { "Content-Type": "application/json" },
          })

      if (!res.ok) throw new Error("Lỗi khi thêm/cập nhật chương trình")

      const updatedPrograms = await fetchPrograms()
      setPrograms(updatedPrograms)
      setForm({
        _id: "",
        tenChuongTrinh: "",
        thoiGianTapHuan: "",
        thoiDiemToChuc: "",
        doiTuongVaSoLuong: "",
        noiDungTapHuan: "",
        chiuTrachNhiemChinh: [],
        khoa: "",
      })
      setIsEditing(false)
      setShowForm(false)
      setErrorMessage("")
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleEdit = async (program) => {
    setForm(program)
    setIsEditing(true)
    setShowForm(true)

    if (program.khoa) {
      try {
        const lecturersData = await fetchLecturersByDepartment(program.khoa)
        setLecturers(lecturersData)
        const selectedLecturers = program.chiuTrachNhiemChinh
        setForm((prev) => ({ ...prev, chiuTrachNhiemChinh: selectedLecturers }))
      } catch (error) {
        setErrorMessage("Lỗi khi lấy giảng viên")
      }
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Lỗi khi xóa chương trình")
      setPrograms(programs.filter((program) => program._id !== id))
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  const handleViewDetails = (program) => {
    setSelectedProgram(program)
    setShowDetails(true)
  }

  const filteredPrograms = programs.filter((program) =>
    program.tenChuongTrinh?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Quản lý Chương trình Tập huấn</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm chương trình..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setForm({
              _id: "",
              tenChuongTrinh: "",
              thoiGianTapHuan: "",
              thoiDiemToChuc: "",
              doiTuongVaSoLuong: "",
              noiDungTapHuan: "",
              chiuTrachNhiemChinh: [],
              khoa: "",
            })
            setIsEditing(false)
            setShowForm(true)
          }}
        >
          Thêm Chương trình
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{isEditing ? "Sửa Chương trình" : "Thêm Chương trình"}</h2>
              <button className="text-gray-500" onClick={() => setShowForm(false)}>
                X
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="tenChuongTrinh"
                placeholder="Tên chương trình"
                className="w-full p-2 border rounded mb-2"
                value={form.tenChuongTrinh}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="thoiGianTapHuan"
                placeholder="Thời gian tập huấn"
                className="w-full p-2 border rounded mb-2"
                value={form.thoiGianTapHuan}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="thoiDiemToChuc"
                placeholder="Thời điểm tổ chức"
                className="w-full p-2 border rounded mb-2"
                value={form.thoiDiemToChuc}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="doiTuongVaSoLuong"
                placeholder="Đối tượng và số lượng"
                className="w-full p-2 border rounded mb-2"
                value={form.doiTuongVaSoLuong}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="noiDungTapHuan"
                placeholder="Nội dung tập huấn"
                className="w-full p-2 border rounded mb-2"
                value={form.noiDungTapHuan}
                onChange={handleInputChange}
                required
              ></textarea>
              <select
                name="khoa"
                className="w-full p-2 border rounded mb-2"
                value={form.khoa}
                onChange={handleDepartmentChange}
                required
              >
                <option value="">Chọn khoa</option>
                {departments.map((khoa) => (
                  <option key={khoa._id} value={khoa._id}>
                    {khoa.ten}
                  </option>
                ))}
              </select>
              {form.khoa && (
                <select
                  name="chiuTrachNhiemChinh"
                  className="w-full p-2 border rounded mb-2"
                  multiple
                  value={form.chiuTrachNhiemChinh}
                  onChange={handleLecturerChange}
                  required
                >
                  {lecturers.map((lecturer) => (
                    <option key={lecturer._id} value={lecturer._id}>
                      {lecturer.ten}
                    </option>
                  ))}
                </select>
              )}
              <div className="flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? "Cập nhật" : "Thêm"}
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowForm(false)}
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetails && selectedProgram && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chi Tiết Chương Trình</h2>
              <button className="text-gray-500" onClick={() => setShowDetails(false)}>
                X
              </button>
            </div>
            <div>
              <p><strong>Tên Chương Trình:</strong> {selectedProgram.tenChuongTrinh}</p>
              <p><strong>Thời Gian Tập Huấn:</strong> {selectedProgram.thoiGianTapHuan}</p>
              <p><strong>Thời Điểm Tổ Chức:</strong> {selectedProgram.thoiDiemToChuc}</p>
              <p><strong>Đối Tượng Và Số Lượng:</strong> {selectedProgram.doiTuongVaSoLuong}</p>
              <p><strong>Nội Dung Tập Huấn:</strong> {selectedProgram.noiDungTapHuan}</p>
              <p><strong>Khoa:</strong> {selectedProgram.khoa ? selectedProgram.khoa.ten : "Chưa có"}</p>
              <p><strong>Giảng Viên Chịu Trách Nhiệm:</strong> 
                {selectedProgram.chiuTrachNhiemChinh.length > 0 ? 
                  selectedProgram.chiuTrachNhiemChinh.map((lecturer) => lecturer.ten).join(", ") : "Chưa có"}
              </p>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowDetails(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full table-auto mt-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Tên Chương Trình</th>
            <th className="px-4 py-2">Thời Gian Tập Huấn</th>
            <th className="px-4 py-2">Thời Điểm Tổ Chức</th>
            <th className="px-4 py-2">Đối Tượng</th>
            <th className="px-4 py-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrograms.map((program) => (
            <tr key={program._id}>
              <td className="px-4 py-2">{program.tenChuongTrinh}</td>
              <td className="px-4 py-2">{program.thoiGianTapHuan}</td>
              <td className="px-4 py-2">{program.thoiDiemToChuc}</td>
              <td className="px-4 py-2">{program.doiTuongVaSoLuong}</td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                  onClick={() => handleViewDetails(program)}
                >
                  Xem Chi Tiết
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleEdit(program)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(program._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
