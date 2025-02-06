"use client";
import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/dang-ky");
        const data = await response.json();

        if (response.ok) {
          setRegistrations(data.data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Lỗi khi tải danh sách đăng ký");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleChangeTrangThaiDuyet = async (id, value) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/dang-ky/${id}/trang-thai-duyet`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trangThaiDuyet: value }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRegistrations((prevRegistrations) =>
          prevRegistrations.map((reg) =>
            reg._id === id ? { ...reg, trangThaiDuyet: value } : reg
          )
        );
        alert("Cập nhật trạng thái duyệt thành công");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái duyệt");
    }
  };

  const handleDeleteRegistration = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa không?")) return;

    try {
      const response = await fetch(`http://localhost:9000/api/dang-ky/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRegistrations((prevRegistrations) =>
          prevRegistrations.filter((reg) => reg._id !== id)
        );
        alert("Xóa thành công");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      alert("Lỗi khi xóa đăng ký");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách đăng ký</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}>Tên</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}>Email</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}>Số điện thoại</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}>Chương trình</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}>Ngày đăng ký</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}>Trạng thái duyệt</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#f4f4f4" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration._id}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{registration.ten}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{registration.email}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{registration.soDienThoai}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{registration.chuongTrinh.tenChuongTrinh}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {registration.ngayDangKy
                    ? new Date(registration.ngayDangKy).toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" })
                    : "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <select
                    style={{ padding: "5px", fontSize: "14px" }}
                    value={registration.trangThaiDuyet}
                    onChange={(e) => handleChangeTrangThaiDuyet(registration._id, e.target.value)}
                  >
                    <option value="Đã duyệt">Đã duyệt</option>
                    <option value="Chưa duyệt">Chưa duyệt</option>
                  </select>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
                  <button
                    style={{
                      padding: "5px 10px",
                      fontSize: "14px",
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                    onClick={() => handleDeleteRegistration(registration._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
