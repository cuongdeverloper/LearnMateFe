import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
      <Button type="primary" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;