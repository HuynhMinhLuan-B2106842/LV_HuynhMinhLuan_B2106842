import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatWidget from "./components/ChatWidget";
export const metadata = {
  title: 'Trang Web Đào Tạo',
  description: 'Các chương trình đào tạo toàn diện cho nhiều lĩnh vực',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <ChatWidget />
        <Footer />
      </body>
    </html>
  )
}

