'use client'

import { useState, useEffect } from 'react'

export default function Register() {
  const [formData, setFormData] = useState({
    ten: '',
    email: '',
    soDienThoai: '',
    chuongTrinh: ''
  })

  const [chuongTrinhList, setChuongTrinhList] = useState([]) // Danh sách các chương trình
  const [message, setMessage] = useState('') // Thông báo đăng ký thành công hoặc lỗi

  useEffect(() => {
    // Lấy danh sách chương trình từ backend
    fetch('http://localhost:9000/api/chuong-trinh')
      .then(response => {
        if (!response.ok) {
          throw new Error('Lỗi khi tải danh sách chương trình')
        }
        return response.json()
      })
      .then(data => setChuongTrinhList(data))
      .catch(error => console.error(error))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:9000/api/dang-ky', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        // Nếu lỗi từ backend, hiển thị thông báo cụ thể
        setMessage(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
        return
      }

      console.log('Đăng ký thành công:', data)
      setMessage('Đăng ký thành công!') // Hiển thị thông báo
      // Reset form sau khi gửi thành công
      setFormData({ ten: '', email: '', soDienThoai: '', chuongTrinh: '' })
    } catch (error) {
      console.error(error)
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.') // Hiển thị thông báo lỗi
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Đăng ký Chương trình</h1>

      {/* Hiển thị thông báo nếu có */}
      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.includes('thành công')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="ten" className="block mb-2">Họ và tên:</label>
          <input
            type="text"
            id="ten"
            name="ten"
            value={formData.ten}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="soDienThoai" className="block mb-2">Số điện thoại:</label>
          <input
            type="text"
            id="soDienThoai"
            name="soDienThoai"
            value={formData.soDienThoai}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="chuongTrinh" className="block mb-2">Chương trình:</label>
          <select
            id="chuongTrinh"
            name="chuongTrinh"
            value={formData.chuongTrinh}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn một chương trình</option>
            {chuongTrinhList.map(program => (
              <option key={program._id} value={program._id}>
                {program.tenChuongTrinh}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Đăng ký
        </button>
      </form>
    </div>
  )
}
