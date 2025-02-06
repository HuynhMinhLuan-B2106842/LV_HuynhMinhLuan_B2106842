"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

interface NewsItem {
  id: string;
  tieuDe: string;
  ngay: string;
  moTaNgan: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    tieuDe: '',
    moTaNgan: '',
    ngay: dayjs(),
    noiDung: ''
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/tin-tuc");
        if (!response.ok) {
          throw new Error("Không thể tải danh sách tin tức");
        }
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
          id: item._id,
          tieuDe: item.tieuDe,
          ngay: item.ngay,
          moTaNgan: item.moTaNgan,
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

  const handleAddOrUpdateNews = async () => {
    const { tieuDe, moTaNgan, ngay, noiDung } = formData;
    if (!tieuDe || !moTaNgan || !ngay || !noiDung) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const method = currentNews ? 'PUT' : 'POST';
      const url = currentNews
        ? `http://localhost:9000/api/tin-tuc/${currentNews.id}`
        : 'http://localhost:9000/api/tin-tuc';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tieuDe,
          moTaNgan,
          ngay: ngay.toISOString(),
          noiDung
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi thêm/sửa tin tức');
      }

      const updatedNews = await response.json();

      if (method === 'POST') {
        setNewsList([...newsList, updatedNews]);
      } else {
        setNewsList(newsList.map((news) =>
          news.id === updatedNews._id ? updatedNews : news
        ));
      }
      setVisible(false);
      alert('Tin tức đã được lưu!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9000/api/tin-tuc/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa tin tức');
      }

      setNewsList(newsList.filter((news) => news.id !== id));
      alert('Tin tức đã được xóa!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOpenModal = (news?: NewsItem) => {
    if (news) {
      setCurrentNews(news);
      setFormData({
        tieuDe: news.tieuDe,
        moTaNgan: news.moTaNgan,
        ngay: dayjs(news.ngay),
        noiDung: news.noiDung,
      });
    } else {
      setCurrentNews(null);
      setFormData({
        tieuDe: '',
        moTaNgan: '',
        ngay: dayjs(),
        noiDung: ''
      });
    }
    setVisible(true);
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="news-page">
      <h1 className="title">Danh sách tin tức</h1>
      <button onClick={() => handleOpenModal()} className="add-news-btn">Thêm tin tức</button>
      <ul className="news-list">
        {newsList.map((news) => (
          <li key={news.id} className="news-item">
            <Link href={`/news/${news.id}`} className="news-link">{news.tieuDe}</Link>
            <p className="news-date">{formatDate(news.ngay)}</p>
            <p className="news-short-description">{news.moTaNgan}</p>
            <div className="news-actions">
              <button onClick={() => handleOpenModal(news)} className="edit-btn">Sửa</button>
              <button onClick={() => handleDeleteNews(news.id)} className="delete-btn">Xóa</button>
            </div>
          </li>
        ))}
      </ul>

      {visible && (
        <div className="modal">
          <div className="modal-content">
            <h2>{currentNews ? 'Sửa tin tức' : 'Thêm tin tức'}</h2>
            <input
              type="text"
              placeholder="Tiêu đề"
              value={formData.tieuDe}
              onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mô tả ngắn"
              value={formData.moTaNgan}
              onChange={(e) => setFormData({ ...formData, moTaNgan: e.target.value })}
            />
            <input
              type="date"
              value={formData.ngay.format('YYYY-MM-DD')}
              onChange={(e) => setFormData({ ...formData, ngay: dayjs(e.target.value) })}
            />
            <textarea
              placeholder="Nội dung chi tiết"
              value={formData.noiDung}
              onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleAddOrUpdateNews} className="save-btn">Lưu</button>
              <button onClick={() => setVisible(false)} className="cancel-btn">Hủy</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .news-page {
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f4f7fc;
        }

        .title {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 20px;
          color: #333;
        }

        .news-list {
          list-style: none;
          padding: 0;
        }

        .news-item {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .add-news-btn {
          padding: 12px 20px;
          margin-bottom: 20px;
          background-color: #5cb85c;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .add-news-btn:hover {
          background-color: #4cae4c;
        }

        .news-link {
          font-size: 1.5em;
          font-weight: bold;
          color: #007bff;
          text-decoration: none;
        }

        .news-link:hover {
          text-decoration: underline;
        }

        .news-date, .news-short-description {
          font-size: 1.1em;
          color: #666;
        }

        .news-actions {
          margin-top: 10px;
          display: flex;
          gap: 10px;
        }

        .edit-btn, .delete-btn {
          padding: 8px 12px;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          transition: all 0.3s;
        }

        .edit-btn {
          background-color: #ffa500;
        }

        .delete-btn {
          background-color: #dc3545;
        }

        .edit-btn:hover {
          background-color: #ff7f00;
        }

        .delete-btn:hover {
          background-color: #c82333;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background: #fff;
          padding: 30px;
          width: 400px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .save-btn, .cancel-btn {
          padding: 12px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }

        .save-btn {
          background-color: #28a745;
          color: white;
        }

        .cancel-btn {
          background-color: #ffc107;
          color: white;
        }

        .save-btn:hover {
          background-color: #218838;
        }

        .cancel-btn:hover {
          background-color: #e0a800;
        }

        input, textarea {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        input:focus, textarea:focus {
          border-color: #007bff;
          outline: none;
        }
      `}</style>
    </div>
  );
}
