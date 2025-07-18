import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to access this page.</p>
      <Button type="primary" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </div>
  );
};

export default Unauthorized;
