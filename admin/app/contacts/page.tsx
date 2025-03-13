'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';

async function fetchKhoa() {
  const res = await fetch('http://localhost:9000/api/khoa', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Lỗi khi lấy danh sách khoa');
  }

  return res.json();
}

function extractIframeUrl(iframeString) {
  const regex = /<iframe.*?src="([^"]+)"/;
  const match = iframeString.match(regex);

  if (match && match[1]) {
    return match[1]; // Trả về URL nếu tìm thấy
  } else {
    return iframeString; // Giữ nguyên giá trị nếu không tìm thấy URL
  }
}


export default function KhoaList() {
  const [khoaList, setKhoaList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingKhoa, setEditingKhoa] = useState(null);

  useEffect(() => {
    fetchKhoa()
      .then(setKhoaList)
      .catch(() => message.error('Lỗi khi tải danh sách khoa'));
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (values.linkBanDo) {
        values.linkBanDo = extractIframeUrl(values.linkBanDo);
      }

      // Chuyển đổi chuyên ngành thành một mảng từ khóa
      if (values.chuyenNganh) {
        values.chuyenNganh = values.chuyenNganh.split(',').map((item) => item.trim());
      }

      if (editingKhoa) {
        const res = await fetch(`http://localhost:9000/api/khoa/${editingKhoa._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error('Lỗi khi cập nhật khoa');

        const updatedKhoa = await res.json();
        setKhoaList((prev) =>
          prev.map((khoa) => (khoa._id === updatedKhoa._id ? updatedKhoa : khoa))
        );
        message.success('Cập nhật khoa thành công');
      } else {
        const res = await fetch('http://localhost:9000/api/khoa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error('Lỗi khi thêm khoa');

        const newKhoa = await res.json();
        setKhoaList((prev) => [...prev, newKhoa]);
        message.success('Thêm khoa thành công');
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:9000/api/khoa/${id}`, {
        method: 'DELETE',
      });
      setKhoaList((prev) => prev.filter((khoa) => khoa._id !== id));
      message.success('Xóa khoa thành công');
    } catch (error) {
      message.error('Lỗi khi xóa khoa');
    }
  };

  const openModal = (khoa = null) => {
    setEditingKhoa(khoa);
    if (khoa) {
      // Chuyển mảng chuyên ngành thành chuỗi phân tách bằng dấu phẩy
      form.setFieldsValue({
        ...khoa,
        chuyenNganh: khoa.chuyenNganh.join(', '),
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Danh sách các khoa</h1>
      <Button type="primary" onClick={() => openModal()} className="mb-4">
        Thêm khoa
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {khoaList.map((khoa) => (
          <div key={khoa._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{khoa.ten}</h2>
              <p><strong>Địa chỉ:</strong> {khoa.diaChi}</p>
              <p><strong>Số điện thoại:</strong> {khoa.soDienThoai}</p>
              <p><strong>Email:</strong> {khoa.email}</p>
              <p><strong>Chuyên ngành:</strong> {khoa.chuyenNganh.join(', ')}</p>
              {khoa.linkBanDo && (
                <iframe
                  width="100%"
                  height="200"
                  src={khoa.linkBanDo}
                  frameBorder="0"
                  allowFullScreen
                  title={`Bản đồ ${khoa.ten}`}
                ></iframe>
              )}
              <div className="mt-4 flex justify-end">
                <Button onClick={() => openModal(khoa)} className="mr-2">
                  Sửa
                </Button>
                <Button danger onClick={() => handleDelete(khoa._id)}>
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={editingKhoa ? 'Cập nhật khoa' : 'Thêm khoa'}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="ten"
            label="Tên khoa"
            rules={[{ required: true, message: 'Vui lòng nhập tên khoa' }]} >
            <Input />
          </Form.Item>
          <Form.Item
            name="diaChi"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]} >
            <Input />
          </Form.Item>
          <Form.Item name="linkBanDo" label="Link bản đồ">
            <Input />
          </Form.Item>
          <Form.Item
            name="soDienThoai"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="chuyenNganh"
            label="Chuyên ngành"
            rules={[{ required: true, message: 'Vui lòng nhập chuyên ngành' }]} >
            <Input placeholder="Nhập chuyên ngành, phân tách bằng dấu phẩy" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
