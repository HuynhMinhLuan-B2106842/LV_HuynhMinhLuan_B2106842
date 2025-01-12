import Link from 'next/link'
import Image from 'next/image'

const Header = () => {
  return (
    <header className="w-full">
      {/* Main banner with gradient */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-4">
        <div className="container mx-auto px-4 flex items-center gap-6">
          <Image 
            src="/images/logo.png"
            alt="Logo Công nghệ kỹ thuật"
            width={80}
            height={80}
            className="flex-shrink-0"
          />
          <div className="flex flex-col">
            <h1 className="text-blue-600 text-2xl md:text-3xl font-bold">
              CHƯƠNG TRÌNH TẬP HUẤN NGẮN HẠN
            </h1>
            {/* <h2 className="text-red-600 text-xl md:text-2xl font-bold mt-1">
              CÔNG NGHỆ KỸ THUẬT
            </h2> */}
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-end py-3 gap-6">
            <li><Link href="/" className="hover:text-blue-200">Trang chủ</Link></li>
            <li><Link href="/programs" className="hover:text-blue-200">Chương trình</Link></li>
            <li><Link href="/teachers" className="hover:text-blue-200">Giảng viên</Link></li>
            <li><Link href="/news" className="hover:text-blue-200">Tin tức</Link></li>
            <li><Link href="/contact" className="hover:text-blue-200">Liên hệ</Link></li>
            <li><Link href="/register" className="hover:text-blue-200">Đăng ký</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header

