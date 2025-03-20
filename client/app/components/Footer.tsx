import { Facebook, Youtube, Instagram, Linkedin, MapPin, Phone, Printer, Mail } from "lucide-react";
import Image from 'next/image'
const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto text-center">
        <div className="flex flex-col items-center">
        <Image 
          src="/images/CTU_logo_singlecolor.png" 
          alt="Can Tho University Logo" 
          width={64} 
          height={64} 
          className="mb-2" 
        />
          <h2 className="text-xl font-bold">ĐẠI HỌC CẦN THƠ</h2>
          <p className="text-lg">Can Tho University</p>
        </div>

        <div className="mt-4 text-sm space-y-2">
          <p className="flex items-center justify-center gap-2">
            <MapPin size={18} /> Khu 2, Đ. 3/2, P. Xuân Khánh, Q. Ninh Kiều, TP. CT
          </p>
          <p className="flex items-center justify-center gap-2">
            <Phone size={18} /> ĐT: +84292 3831 530; 3838 237; 3832 663
          </p>
          <p className="flex items-center justify-center gap-2">
            <Printer size={18} /> Fax: +84292 3838 474
          </p>
          <p className="flex items-center justify-center gap-2">
            <Mail size={18} /> Email: <a href="mailto:dhct@ctu.edu.vn" className="underline">dhct@ctu.edu.vn</a>
          </p>
        </div>

        <div className="flex justify-center space-x-4 mt-4 text-xl">
          <a href="#" className="hover:text-gray-400"><Facebook /></a>
          <a href="#" className="hover:text-gray-400"><Youtube /></a>
          <a href="#" className="hover:text-gray-400"><Instagram /></a>
          <a href="#" className="hover:text-gray-400"><Linkedin /></a>
        </div>

        <p className="mt-6 text-sm">&copy; 2025 Đại học Cần Thơ</p>
      </div>
    </footer>
  );
};

export default Footer;
