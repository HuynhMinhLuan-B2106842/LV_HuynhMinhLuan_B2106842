'use client'

import { useState } from 'react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: '',
    paymentMethod: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ở đây bạn thường sẽ gửi dữ liệu form đến backend
    console.log('Đã gửi form:', formData)
    // Reset form sau khi gửi
    setFormData({ name: '', email: '', program: '', paymentMethod: '' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Đăng ký Chương trình</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Họ và tên:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
          <label htmlFor="program" className="block mb-2">Chương trình:</label>
          <select
            id="program"
            name="program"
            value={formData.program}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Chọn một chương trình</option>
            <option value="web-development">Khóa học Lập trình Web Chuyên sâu</option>
            <option value="data-science">Cơ bản về Khoa học Dữ liệu</option>
            <option value="digital-marketing">Marketing Kỹ thuật số Cơ bản</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Phương thức thanh toán:</label>
          <div>
            <label className="inline-flex items-center mr-4">
              <input
                type="radio"
                name="paymentMethod"
                value="credit-card"
                checked={formData.paymentMethod === 'credit-card'}
                onChange={handleChange}
                className="mr-2"
              />
              Thẻ tín dụng
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="bank-transfer"
                checked={formData.paymentMethod === 'bank-transfer'}
                onChange={handleChange}
                className="mr-2"
              />
              Chuyển khoản ngân hàng
            </label>
          </div>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Đăng ký
        </button>
      </form>
    </div>
  )
}

