"use client";

import { useEffect } from "react";

const Map = () => {
  return (
    <div>
      <h2>Đại học Cần Thơ</h2>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.84151844204!2d105.76804037461572!3d10.029933690076973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zxJDhuqFpIGjhu41jIEPhuqduIFRoxqE!5e0!3m2!1svi!2s!4v1736331449864!5m2!1svi!2s"
        width="100%"  // Chiều rộng chiếm toàn bộ không gian có sẵn
        height="500"  // Chiều cao có thể thay đổi theo yêu cầu
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default Map;
