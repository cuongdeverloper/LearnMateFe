import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Profile.scss';
import UpdateProfile from './UpdateProfile';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const access_token = useSelector(state => state.user.account?.access_token);

  useEffect(() => {
    if (!access_token) {
      navigate('/signin');
      return;
    }
    axios.get('http://localhost:6060/profile', {
      headers: { Authorization: `Bearer ${access_token}` }
    })
      .then(res => {
        setProfile(res.data);
      })
      .catch(() => {
        navigate('/signin');
      });
  }, [access_token, navigate]);

  if (!profile) return <div>Đang tải profile...</div>;

  if (editMode) {
    return <UpdateProfile profile={profile} onUpdate={user => { setProfile(user); setEditMode(false); }} onCancel={() => setEditMode(false)} />;
  }

  return (
    <div className="profile-container">
      <h2>Thông tin cá nhân</h2>
      <div className="profile-avatar">
        <img
          src={profile.image || '/default-avatar.png'}
          alt="avatar"
        />
      </div>
      <form>
        <div className="form-group">
          <label>Tên đăng nhập:</label>
          <div>{profile.username}</div>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <div>{profile.email}</div>
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <div>{profile.phoneNumber}</div>
        </div>
        <div className="form-group">
          <label>Giới tính:</label>
          <div>{profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}</div>
        </div>
        <div className="profile-role">
          <label>Vai trò:</label>
          <div>{profile.role}</div>
        </div>
        <div className="profile-password">
          <label>Mật khẩu:</label>
          <div>*********</div>
        </div>
        <div className="profile-actions">
          <button type="button" className="btn-warning" onClick={() => setEditMode(true)}>Chỉnh sửa</button>
        </div>
      </form>
    </div>
  );
};

export default Profile; 