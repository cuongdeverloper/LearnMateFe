import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './UpdateProfile.scss';

const UpdateProfile = ({ profile, onUpdate, onCancel }) => {
  const [form, setForm] = useState({
    username: profile.username,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
    gender: profile.gender,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(profile.image);
  const fileInputRef = useRef();
  const access_token = useSelector(state => state.user.account?.access_token);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });
    try {
      const res = await axios.put('http://localhost:6060/update-profile', formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (onUpdate) onUpdate(res.data.user);
      alert('Cập nhật thành công!');
    } catch (err) {
      alert('Cập nhật thất bại!');
    }
  };

  return (
    <form className="update-profile-form" onSubmit={handleSubmit}>
      <div className="profile-avatar">
        <img src={imagePreview || '/default-avatar.png'} alt="avatar" />
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} />
      </div>
      <div className="form-group">
        <label>Tên đăng nhập:</label>
        <input name="username" value={form.username || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input name="email" value={form.email || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Số điện thoại:</label>
        <input name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label>Giới tính:</label>
        <select name="gender" value={form.gender || ''} onChange={handleChange}>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </div>
      <div className="profile-actions">
        <button type="submit" className="btn-primary">Lưu</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
};

export default UpdateProfile; 