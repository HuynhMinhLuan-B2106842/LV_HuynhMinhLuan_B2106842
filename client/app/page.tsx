import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Chào mừng đến với Trang Web Đào Tạo của chúng tôi</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Về chúng tôi</h2>
        <p className="mb-4">Chúng tôi cung cấp các chương trình đào tạo toàn diện trong nhiều lĩnh vực cho các chuyên gia, sinh viên và những người đam mê.</p>
        <h3 className="text-xl font-semibold mb-2">Đối tượng mục tiêu của chúng tôi:</h3>
        <ul className="list-disc list-inside mb-4">
          <li>Chuyên gia muốn nâng cao kỹ năng</li>
          <li>Sinh viên chuẩn bị cho sự nghiệp</li>
          <li>Người đam mê khám phá lĩnh vực mới</li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Chương trình nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Khóa học Lập trình Web Chuyên sâu</h3>
            <p>Học các công nghệ web mới nhất trong khóa học chuyên sâu của chúng tôi.</p>
            <Link href="/programs/web-development" className="text-blue-600 hover:underline">Tìm hiểu thêm</Link>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Cơ bản về Khoa học Dữ liệu</h3>
            <p>Làm chủ các kiến thức cơ bản về khoa học dữ liệu và phân tích.</p>
            <Link href="/programs/data-science" className="text-blue-600 hover:underline">Tìm hiểu thêm</Link>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Ưu đãi đặc biệt</h2>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Giảm giá mùa hè</h3>
          <p>Giảm 20% cho tất cả các chương trình trong mùa hè này! Sử dụng mã: HE20</p>
          <Link href="/programs" className="text-blue-600 hover:underline">Xem các chương trình</Link>
        </div>
      </section>
    </div>
  )
}

