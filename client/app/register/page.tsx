"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Để lấy tham số từ URL

export default function Register() {
  const searchParams = useSearchParams();
  const selectedProgramId = searchParams.get("chuongTrinh"); // Lấy ID chương trình từ URL

  const [formData, setFormData] = useState({
    ten: "",
    email: "",
    soDienThoai: "",
    chuongTrinh: selectedProgramId || "", // Gán ID chương trình từ URL nếu có
  });

  const [chuongTrinhList, setChuongTrinhList] = useState([]); // Danh sách chương trình
  const [message, setMessage] = useState(""); // Thông báo đăng ký thành công hoặc lỗi
  const [errors, setErrors] = useState({}); // Lỗi nhập liệu

  // Lấy danh sách chương trình từ API
  useEffect(() => {
    fetch("http://localhost:9000/api/chuong-trinh")
      .then((response) => response.json())
      .then((data) => setChuongTrinhList(data))
      .catch((error) => console.error(error));
  }, []);

  // Cập nhật chương trình được chọn nếu URL có ID
  useEffect(() => {
    if (selectedProgramId) {
      setFormData((prev) => ({ ...prev, chuongTrinh: selectedProgramId }));
    }
  }, [selectedProgramId]);

  // Kiểm tra lỗi nhập liệu
  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(value)) {
        error = "Email không hợp lệ (VD: example@email.com)";
      }
    }

    if (name === "soDienThoai") {
      const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
      if (!phoneRegex.test(value)) {
        error = "Số điện thoại không hợp lệ (VD: 0987654321)";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    validateField(name, value);
  };

  // Xử lý gửi form đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu có lỗi nhập liệu
    if (Object.values(errors).some((error) => error)) {
      setMessage("Vui lòng kiểm tra lại thông tin nhập vào!");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/api/dang-ky", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        return;
      }

      console.log("Đăng ký thành công:", data);
      setMessage("Đăng ký thành công!");
      setFormData({ ten: "", email: "", soDienThoai: "", chuongTrinh: "" });
      setErrors({});
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Đăng ký Chương trình</h1>

      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.includes("thành công")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Họ và tên */}
        <div className="mb-4">
          <label htmlFor="ten" className="block mb-2">Họ và tên:</label>
          <input
            type="text"
            id="ten"
            name="ten"
            value={formData.ten}
            onChange={handleChange}
            required
            placeholder="Nhập họ và tên"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Nhập email hợp lệ (VD: example@email.com)"
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Số điện thoại */}
        <div className="mb-4">
          <label htmlFor="soDienThoai" className="block mb-2">Số điện thoại:</label>
          <input
            type="text"
            id="soDienThoai"
            name="soDienThoai"
            value={formData.soDienThoai}
            onChange={handleChange}
            required
            placeholder="Nhập số điện thoại (VD: 0987654321)"
            className="w-full p-2 border rounded"
          />
          {errors.soDienThoai && <p className="text-red-500 text-sm">{errors.soDienThoai}</p>}
        </div>

        {/* Chọn chương trình */}
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
            {chuongTrinhList.map((program) => (
              <option key={program._id} value={program._id}>
                {program.tenChuongTrinh}
              </option>
            ))}
          </select>
        </div>

        {/* Nút đăng ký */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
