import LeafletMap from "./Map";

const Footer = () => {
  return (
    <footer className="bg-gray-200 p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2025 Trang Web Đào Tạo. Bảo lưu mọi quyền.</p>
        <div className="mt-4">
          <LeafletMap />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
