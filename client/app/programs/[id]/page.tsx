import { notFound } from 'next/navigation'
import { programs } from '../../data/programs'

// const programs = [
//   { 
//     id: 1, 
//     name: 'Khóa học Lập trình Web Chuyên sâu', 
//     description: 'Học các công nghệ web mới nhất và xây dựng các ứng dụng web hiện đại.',
//     instructor: 'Nguyễn Văn A',
//     duration: '12 tuần',
//     location: 'Trực tuyến',
//     price: '9.999.000 VNĐ',
//     registration: 'Đang mở đăng ký'
//   },
//   { 
//     id: 2, 
//     name: 'Cơ bản về Khoa học Dữ liệu', 
//     description: 'Làm chủ các kiến thức cơ bản về khoa học dữ liệu và phân tích.',
//     instructor: 'Trần Thị B',
//     duration: '8 tuần',
//     location: 'Trực tuyến',
//     price: '7.999.000 VNĐ',
//     registration: 'Đang mở đăng ký'
//   },
//   // Thêm các chương trình khác ở đây nếu cần
// ]

export default function ProgramDetails({ params }: { params: { id: string } }) {
  const program = programs.find(p => p.id === parseInt(params.id))

  if (!program) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{program.name}</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="mb-4">{program.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Chi tiết Chương trình</h2>
            <p><strong>Giảng viên:</strong> {program.instructor}</p>
            <p><strong>Thời gian:</strong> {program.duration}</p>
            <p><strong>Địa điểm:</strong> {program.location}</p>
            <p><strong>Học phí:</strong> {program.price}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Đăng ký</h2>
            <p>{program.registration}</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

