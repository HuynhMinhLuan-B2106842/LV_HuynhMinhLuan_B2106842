"use client"
import React, { useState } from 'react';

const TraCuuDangKy = () => {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Hàm tra cứu đăng ký
  const handleSearch = async () => {
    if (!keyword.trim()) {
      alert('Vui lòng nhập email hoặc số điện thoại để tra cứu!');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`http://localhost:9000/api/dang-ky/tra-cuu?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
      } else {
        alert(data.message || 'Không tìm thấy thông tin đăng ký');
      }
    } catch (error) {
      alert('Lỗi khi tra cứu, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Tra cứu đăng ký</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Nhập email hoặc số điện thoại"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Đang tìm...' : 'Tra cứu'}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', borderRadius: '4px', padding: '20px' }}>
          <h2>Thông tin đăng ký:</h2>
          <p><strong>Tên:</strong> {result.ten}</p>
          <p><strong>Email:</strong> {result.email}</p>
          <p><strong>Số điện thoại:</strong> {result.soDienThoai}</p>
          <p><strong>Chương trình:</strong> {result.chuongTrinh?.tenChuongTrinh || 'Không xác định'}</p>
          <p><strong>Trạng thái duyệt:</strong> {result.trangThaiDuyet}</p>
        </div>
      )}
    </div>
  );
};

export default TraCuuDangKy;
