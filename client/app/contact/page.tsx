// export default function Contact() {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold mb-6">Liên hệ với chúng tôi</h1>
//         <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//           <p className="mb-4">Hãy liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về các chương trình đào tạo của chúng tôi.</p>
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Địa chỉ của chúng tôi</h2>
//             <p>123 Đường Đào Tạo</p>
//             <p>Thành phố Giáo dục, Việt Nam</p>
//           </div>
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold mb-2">Thông tin liên hệ</h2>
//             <p>Điện thoại: (024) 1234-5678</p>
//             <p>Email: info@trangwebdaotao.com</p>
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold mb-2">Giờ làm việc</h2>
//             <p>Thứ Hai - Thứ Sáu: 9:00 - 17:00</p>
//             <p>Thứ Bảy - Chủ Nhật: Đóng cửa</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

import Image from 'next/image';

async function fetchKhoa() {
  const res = await fetch('http://localhost:9000/api/khoa', {
    cache: 'no-store', // Đảm bảo không sử dụng cache
  });

  if (!res.ok) {
    throw new Error('Lỗi khi lấy danh sách khoa');
  }

  return res.json();
}

export default async function KhoaList() {
  const khoaList = await fetchKhoa();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Danh sách các khoa</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {khoaList.map((khoa) => (
          <div key={khoa._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{khoa.ten}</h2>
              <p><strong>Địa chỉ:</strong> {khoa.diaChi}</p>
              <p><strong>Số điện thoại:</strong> {khoa.soDienThoai}</p>
              <p><strong>Email:</strong> {khoa.email}</p>
              {khoa.linkBanDo && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Bản đồ:</h3>
                  <iframe 
                    width="100%" 
                    height="300" 
                    src={khoa.linkBanDo} 
                    frameBorder="0" 
                    style={{ border: 0 }} 
                    allowFullScreen
                    title={`Bản đồ ${khoa.ten}`}
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

