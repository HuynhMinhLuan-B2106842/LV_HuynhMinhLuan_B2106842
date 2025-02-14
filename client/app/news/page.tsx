"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  tieuDe: string;
  ngay: string;
  moTaNgan: string; // Thêm trường mô tả ngắn
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);  // Chuyển đổi chuỗi thành đối tượng Date

  const day = String(date.getDate()).padStart(2, '0');  // Lấy ngày và đảm bảo có 2 chữ số
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Lấy tháng và đảm bảo có 2 chữ số (tháng bắt đầu từ 0)
  const year = date.getFullYear();  // Lấy năm

  return `${day}/${month}/${year}`;  // Trả về chuỗi theo định dạng dd/mm/yyyy
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/tin-tuc");
        if (!response.ok) {
          throw new Error("Không thể tải danh sách tin tức");
        }
        const data = await response.json();

        // Chuyển đổi `_id` thành `id`
        const formattedData = data.map((item: any) => ({
          id: item._id,
          tieuDe: item.tieuDe,
          ngay: item.ngay,
          moTaNgan: item.moTaNgan,  // Thêm trường mô tả ngắn
        }));

        setNewsList(formattedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p className="loading">Đang tải...</p>;
  if (error) return <p className="error">Lỗi: {error}</p>;

  return (
    <div className="news-page">
      <h1 className="title">Danh sách tin tức</h1>
      <ul className="news-list">
        {newsList.map((news) => (
          <li key={news.id} className="news-item">
            <Link href={`/news/${news.id}`} className="news-link">
              {news.tieuDe}
            </Link>
            <p className="news-date">{formatDate(news.ngay)}</p> {/* Định dạng ngày tại đây */}
            <p className="news-short-description">{news.moTaNgan}</p> {/* Hiển thị mô tả ngắn */}
          </li>
        ))}
      </ul>

      <style jsx>{`
        .news-page {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }

        .title {
          font-size: 2em;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
        }

        .news-list {
          list-style: none;
          padding: 0;
        }

        .news-item {
          margin-bottom: 15px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .news-link {
          font-size: 1.2em;
          font-weight: bold;
          color: #0066cc;
          text-decoration: none;
        }

        .news-link:hover {
          text-decoration: underline;
        }

        .news-date {
          font-size: 1em;
          color: #888;
          margin-top: 5px;
        }

        .news-short-description {
          font-size: 1em;
          color: #555;
          margin-top: 10px;
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