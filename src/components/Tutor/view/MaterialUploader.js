import React, { useState } from 'react';
import { uploadMaterial } from '../../../Service/ApiService';
import './MaterialUploader.scss';

const MaterialUploader = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleUpload = async () => {
    try {
      await uploadMaterial(studentId, file, description);
      alert("Tải tài liệu thành công");
      setFile(null);
      setDescription('');
      setStudentId('');
    } catch (err) {
      alert("Tải thất bại");
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="material-uploader">
      <h3>📂 Tải tài liệu học tập</h3>
      <div className="form-upload">
        <input
          type="text"
          placeholder="Mã học viên"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
        />
        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Mô tả tài liệu"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button onClick={handleUpload}>📤 Tải lên</button>
      </div>
    </div>
  );
};

export default MaterialUploader;