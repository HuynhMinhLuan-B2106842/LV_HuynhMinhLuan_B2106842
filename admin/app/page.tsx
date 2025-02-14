"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [gioiThieu, setGioiThieu] = useState(null);
  const [formData, setFormData] = useState({ tongquan: "", muctieu: "", giamgia: "", chuongTrinhIds: [] }); // Cập nhật chuongTrinhIds để chứa nhiều giá trị
  const [isEditing, setIsEditing] = useState(false);
  const [chuongTrinhList, setChuongTrinhList] = useState([]); // Thêm state cho danh sách chương trình
  const [featuredPrograms, setFeaturedPrograms] = useState([]); // Lưu chương trình nổi bật

  // Lấy dữ liệu giới thiệu từ API
  useEffect(() => {
    const fetchGioiThieu = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/gioi-thieu");
        const data = await response.json();
        console.log("Dữ liệu giới thiệu nhận được:", data);
        if (Array.isArray(data) && data.length > 0) {
          setGioiThieu(data[0]);
          setFormData({
            tongquan: data[0].tongquan,
            muctieu: data[0].muctieu,
            giamgia: data[0].giamgia,
            chuongTrinhIds: data[0].chuongtrinh.map(chuong => chuong._id), // Lưu các chương trình đã chọn
          });
          setFeaturedPrograms(data[0].chuongtrinh); // Lưu các chương trình trong giới thiệu
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giới thiệu:", error);
      }
    };

    fetchGioiThieu();
  }, []);

  // Lấy danh sách tất cả chương trình từ API
  useEffect(() => {
    const fetchChuongTrinh = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/chuong-trinh");
        const data = await response.json();
        console.log("Dữ liệu chương trình nhận được:", data);
        setChuongTrinhList(data); // Lưu danh sách chương trình vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chương trình:", error);
      }
    };

    fetchChuongTrinh();
  }, []);

  // Xử lý khi người dùng nhập vào form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi chọn nhiều chương trình
  const handleChuongTrinhChange = (e) => {
    const selectedChuongTrinhIds = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, chuongTrinhIds: selectedChuongTrinhIds });
  };

  // Gửi yêu cầu cập nhật dữ liệu lên API
  const handleUpdate = async () => {
    if (!gioiThieu) return;

    const updatedData = {
      ...formData,
      chuongtrinh: formData.chuongTrinhIds,  // Cập nhật các chương trình đã chọn
    };

    try {
      const response = await fetch(
        `http://localhost:9000/api/gioi-thieu/${gioiThieu._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        alert("Cập nhật thành công!");
        setGioiThieu({ ...gioiThieu, ...updatedData });
        setIsEditing(false); // Đóng form khi cập nhật thành công
      } else {
        alert("Lỗi khi cập nhật dữ liệu.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu cập nhật:", error);
    }
  };

  if (!gioiThieu) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-6">
        Chào mừng đến với Trang Web Đào Tạo của chúng tôi
      </h1>

      {/* Form cập nhật */}
      <section className="mb-8">
        <button
        
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
        >
          Chỉnh sửa
        </button>

        {isEditing && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa giới thiệu</h2>
            <div className="mb-4">
              <label className="block font-semibold">Tổng quan:</label>
              <textarea
              name="tongquan"
              value={formData.tongquan}
              onChange={handleChange}
              rows={4} // Số dòng hiển thị ban đầu
              className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Mục tiêu:</label>
              <textarea
                name="muctieu"
                value={formData.muctieu}
                onChange={handleChange}
                rows={4}  // Đặt số dòng hiển thị cho textarea
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Giảm giá:</label>
              <input
                type="text"
                name="giamgia"
                value={formData.giamgia}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Chọn nhiều chương trình bằng checkbox */}
            <div className="mb-4">
              <label className="block font-semibold">Chọn chương trình:</label>
              <div className="space-y-2">
                {chuongTrinhList.map((chuong, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`chuongTrinh-${chuong._id}`}
                      value={chuong._id}
                      checked={formData.chuongTrinhIds.includes(chuong._id)}
                      onChange={(e) => {
                        const newSelected = e.target.checked
                          ? [...formData.chuongTrinhIds, chuong._id]
                          : formData.chuongTrinhIds.filter(id => id !== chuong._id);
                        setFormData({ ...formData, chuongTrinhIds: newSelected });
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`chuongTrinh-${chuong._id}`}>{chuong.tenChuongTrinh}</label>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Cập nhật
            </button>
          </div>
        )}
      </section>

      {/* Hiển thị nội dung hiện tại */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tổng quan</h2>
        <p className="mb-4 whitespace-pre-line max-w-2xl mx-auto text-justify">{gioiThieu.tongquan}</p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Mục tiêu</h2>
        <ul className="mb-4 max-w-2xl mx-auto text-justify">
          {gioiThieu.muctieu.split("\n").map((line, index) => (
            <li key={index} className="mb-2"> {line}</li>
          ))}
        </ul>
      </section>

      {/* Các chương trình nổi bật */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Chương trình nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
          {featuredPrograms && featuredPrograms.length > 0 ? (
            featuredPrograms.map((chuong, index) => (
              <div key={index} className="bg-blue-100 p-4 rounded shadow-md mx-auto w-full max-w-md text-center">
                <h3 className="text-xl font-semibold mb-2">{chuong.tenChuongTrinh}</h3>
                <p><strong>Thời gian tập huấn:</strong> {chuong.thoiGianTapHuan}</p>
                <Link
                  href={`/programs/${chuong._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            ))
          ) : (
            <p>Không có chương trình nổi bật nào.</p>
          )}
        </div>
      </section>

      {/* Ưu đãi đặc biệt */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Ưu đãi đặc biệt</h2>
        <div className="bg-yellow-100 p-4 rounded shadow-md mx-auto w-full max-w-md text-center">
          <h3 className="text-xl font-semibold mb-2">Giảm giá</h3>
          <p className="mb-4">{gioiThieu.giamgia}</p>
          <Link href="/programs" className="text-blue-600 hover:underline">
            Xem các chương trình
          </Link>
        </div>
      </section>
    </div>
  );
}
