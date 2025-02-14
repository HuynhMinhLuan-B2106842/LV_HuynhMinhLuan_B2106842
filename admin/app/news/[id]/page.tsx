"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface NewsDetail {
  id: string;
  tieuDe: string;
  ngay: string;
  moTaChiTiet: string;
  noiDung: string; // Thêm trường noiDung
}

export default function NewsDetailPage() {
  const { id } = useParams(); // Lấy id từ URL
  const [newsDetail, setNewsDetail] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/tin-tuc/${id}`);
        if (!response.ok) {
          throw new Error("Không thể tải chi tiết tin tức");
        }
        const data = await response.json();
        setNewsDetail(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  // Hàm chuyển đổi ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) return <p className="loading">Đang tải...</p>;
  if (error) return <p className="error">Lỗi: {error}</p>;
  if (!newsDetail) return <p>Không tìm thấy tin tức</p>;

  return (
    <div className="news-detail">
      <h1 className="title">{newsDetail.tieuDe}</h1>
      <p className="date">{formatDate(newsDetail.ngay)}</p>
      <p className="short-description">{newsDetail.moTaChiTiet}</p> {/* Hiển thị mô tả ngắn */}
      <div className="content">
        <p className="mb-4 whitespace-pre-line">{newsDetail.noiDung}</p> {/* Hiển thị nội dung chi tiết */}
      </div>

      <style jsx>{`
        .news-detail {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }

        .title {
          font-size: 2em;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
          text-align: justify;
        }

        .date {
          font-size: 1.1em;
          color: #888;
          margin-bottom: 20px;
          text-align: justify;
        }

        .short-description {
          font-size: 1.1em;
          color: #666;
          margin-bottom: 20px;
          text-align: justify;
        }

        .content {
          font-size: 1.2em;
          line-height: 1.6;
          color: #444;
          text-align: justify;
        }

        .loading,
        .error {
          text-align: center;
          font-size: 1.5em;
          margin-top: 20px;
          color: #ff5722;
        }

        .error {
          color: #e53935;
        }
      `}</style>
    </div>
  );
}
