import Link from 'next/link'

const newsItems = [
  {
    id: 1,
    title: 'Ra mắt Khóa học Lập trình Web mới',
    excerpt: 'Chúng tôi vui mừng thông báo về khóa học lập trình web nâng cao mới...',
    date: '2023-06-01'
  },
  {
    id: 2,
    title: 'Hội thảo Khoa học Dữ liệu sắp tới',
    excerpt: 'Tham gia cùng chúng tôi trong hội thảo thực hành về các kỹ thuật khoa học dữ liệu mới nhất...',
    date: '2023-06-15'
  },
  // Thêm các mục tin tức khác ở đây...
]

export default function News() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Tin tức mới nhất</h1>
      <div className="space-y-6">
        {newsItems.map(item => (
          <div key={item.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600 mb-2">{item.date}</p>
            <p className="mb-4">{item.excerpt}</p>
            <Link href={`/news/${item.id}`} className="text-blue-600 hover:underline">
              Đọc thêm
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

