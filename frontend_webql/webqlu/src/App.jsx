import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:8000/api/users';

export default function App() {
  const [danhSach, setDanhSach] = useState([]);
  const [hoTen, setHoTen] = useState('');
  const [email, setEmail] = useState('');
  const [vaiTro, setVaiTro] = useState('User');
  const [idDangSua, setIdDangSua] = useState(null);

  const taiDanhSachNguoiDung = async () => {
    try {
      const phanHoi = await fetch(API_URL);
      const duLieu = await phanHoi.json();
      setDanhSach(duLieu);
    } catch (loi) {
      console.error("Lỗi kết nối API:", loi);
    }
  };

  useEffect(() => {
    taiDanhSachNguoiDung();
  }, []);

  const xuLyLuuNguoiDung = async (e) => {
    e.preventDefault();
    if (!hoTen || !email) {
      alert("Hãy nhập đủ thông tin!");
      return;
    }

    const duLieuGuidi = { ho_ten: hoTen, email, vai_tro: vaiTro };

    try {
      if (idDangSua !== null) {
        await fetch(`${API_URL}/${idDangSua}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(duLieuGuidi),
        });
        setIdDangSua(null);
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(duLieuGuidi),
        });
      }
      setHoTen(''); 
      setEmail(''); 
      setVaiTro('User');
      taiDanhSachNguoiDung();
    } catch (loi) {
      console.error("Lỗi lưu dữ liệu:", loi);
    }
  };

  const xuLyXoa = async (id) => {
    if (!id || !window.confirm("Xóa người dùng này?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      taiDanhSachNguoiDung();
    } catch (loi) {
      console.error("Lỗi khi xóa:", loi);
    }
  };

  return (
    <div className="khung-chinh">
      <header className="thanh-tieu-de">
        <h2>Trang Quản Lý Người Dùng</h2>
      </header>

      <div className="bo-cuc-noi-dung">
        <div className="khoi-hop form-nhap">
          <h3>{idDangSua !== null ? 'Cập Nhật Người Dùng' : 'Thêm Người Dùng Mới'}</h3>
          <form onSubmit={xuLyLuuNguoiDung}>
            <div className="nhom-nhap-lieu">
              <label>Họ và Tên</label>
              <input 
                type="text" 
                value={hoTen} 
                onChange={(e) => setHoTen(e.target.value)} 
                placeholder="Nhập họ tên..." 
              />
            </div>
            <div className="nhom-nhap-lieu">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="nhanvien@domain.com" 
              />
            </div>
            <div className="nhom-nhap-lieu">
              <label>Vai trò</label>
              <select value={vaiTro} onChange={(e) => setVaiTro(e.target.value)}>
                <option value="User">User</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="nhom-nut-bam">
              <button type="submit" className="nut-bam nut-luu">
                {idDangSua !== null ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {idDangSua !== null && (
                <button 
                  type="button" 
                  onClick={() => { setIdDangSua(null); setHoTen(''); setEmail(''); setVaiTro('User'); }} 
                  className="nut-bam nut-huy"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="khoi-hop bang-du-lieu">
          <h3>Danh Sách Thành Viên</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th style={{ textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>  
            <tbody>
              {danhSach.map((nd) => (
                <tr key={nd.id}>
                  <td>{nd.id}</td>
                  <td style={{ fontWeight: '500' }}>{nd.ho_ten}</td>
                  <td>{nd.email}</td>
                  <td>
                    <span className={`nhan-vai-tro vai-tro-${nd.vai_tro.toLowerCase()}`}>
                      {nd.vai_tro}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="nhom-hanh-dong">
                      <button 
                        className="nut-icon nut-sua" 
                        onClick={() => {
                          setIdDangSua(nd.id); 
                          setHoTen(nd.ho_ten); 
                          setEmail(nd.email); 
                          setVaiTro(nd.vai_tro);
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </button>
                      <button className="nut-icon nut-xoa" onClick={() => xuLyXoa(nd.id)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}