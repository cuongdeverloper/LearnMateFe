import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Statistic, Avatar, message, Table, Modal } from "antd";
import { PieChartOutlined, UserOutlined, TeamOutlined, FileOutlined, LogoutOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from 'react-redux';
import { doLogout } from '../../redux/action/userAction';
import { useNavigate } from 'react-router-dom';
import TutorApplications from './TutorApplications';
import TutorManagement from './TutorManagement';
import BookingManagement from './BookingManagement';
import NotificationBell from '../../components/NotificationBell';
import axios from 'axios';

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    tutors: 0,
    students: 0
  });
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [blockUserId, setBlockUserId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);

  const accessToken = useSelector(state => state.user.account.access_token);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    await dispatch(doLogout());
    navigate('/signin');
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (!accessToken) {
        message.error('No access token found. Please login again.');
        return;
      }
      const response = await axios.get('http://localhost:6060/admin/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
        const stats = {
          totalUsers: response.data.length,
          activeUsers: response.data.filter(user => !user.isBlocked).length,
          blockedUsers: response.data.filter(user => user.isBlocked).length,
          tutors: response.data.filter(user => user.role === 'tutor').length,
          students: response.data.filter(user => user.role === 'student').length
        };
        setStats(stats);
      } else {
        message.error('Invalid response format from server');
      }
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = (userId) => {
    setBlockUserId(userId);
    setBlockModalVisible(true);
  };

  const confirmBlockUser = async () => {
    try {
      await axios.put(`http://localhost:6060/admin/users/${blockUserId}/block`, { reason: blockReason }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      message.success('User blocked successfully');
      setBlockModalVisible(false);
      setBlockReason("");
      setBlockUserId(null);
      fetchUsers();
    } catch (error) {
      message.error('Failed to block user');
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await axios.put(`http://localhost:6060/admin/users/${userId}/unblock`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      message.success('User unblocked successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to unblock user');
    }
  };

  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId);
    setDeleteModalVisible(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:6060/admin/users/${deleteUserId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: { reason: deleteReason }
      });
      message.success('User deleted successfully');
      setDeleteModalVisible(false);
      setDeleteReason("");
      setDeleteUserId(null);
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => (
        <span style={{ fontWeight: 'bold' }}>{text}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <span style={{ color: role === 'admin' ? 'red' : role === 'tutor' ? 'blue' : 'green' }}>{role.toUpperCase()}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (isBlocked) => (
        <span style={{ color: isBlocked ? 'red' : 'green' }}>{isBlocked ? 'BLOCKED' : 'ACTIVE'}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <a onClick={() => { setSelectedUser(record); setProfileModalVisible(true); }}>View</a>
          {record.isBlocked ? (
            <a style={{ color: '#3f8600', marginLeft: 12 }} onClick={() => handleUnblockUser(record._id)}>Unblock</a>
          ) : (
            <a style={{ color: '#faad14', marginLeft: 12 }} onClick={() => handleBlockUser(record._id)}>Block</a>
          )}
          <a style={{ color: 'red', marginLeft: 12 }} onClick={() => handleDeleteUser(record._id)}>Delete</a>
        </>
      ),
    },
  ];

  const UserManagement = ({ onBlockUser }) => (
    <Card title="User Management">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Table
            columns={columns.map(col =>
              col.key === 'actions'
                ? {
                    ...col,
                    render: (_, record) => (
                      <>
                        <a onClick={() => { setSelectedUser(record); setProfileModalVisible(true); }}>View</a>
                        {record.isBlocked ? (
                          <a style={{ color: '#3f8600', marginLeft: 12 }} onClick={() => handleUnblockUser(record._id)}>Unblock</a>
                        ) : (
                          <a style={{ color: '#faad14', marginLeft: 12 }} onClick={() => onBlockUser(record._id)}>Block</a>
                        )}
                        <a style={{ color: 'red', marginLeft: 12 }} onClick={() => handleDeleteUser(record._id)}>Delete</a>
                      </>
                    )
                  }
                : col
            )}
            dataSource={users}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} users` }}
          />
        </Col>
      </Row>
      <Modal
        title="User Profile"
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={null}
        width={500}
        destroyOnClose={false}
      >
        {selectedUser && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <Avatar size={80} src={selectedUser.image} icon={<UserOutlined />} />
              </Col>
              <Col span={16}>
                <p><b>Name:</b> {selectedUser.username}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Phone:</b> {selectedUser.phoneNumber}</p>
                <p><b>Role:</b> {selectedUser.role}</p>
                <p><b>Status:</b> {selectedUser.isBlocked ? 'Blocked' : 'Active'}</p>
                <p><b>Created At:</b> {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}</p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  );

  useEffect(() => {
    if (accessToken) {
      fetchUsers();
    } else {
      message.error('Please login to access the admin dashboard');
    }
    // eslint-disable-next-line
  }, [accessToken]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} style={{ background: "#fff" }}>
        <div className="logo" style={{ height: 64, margin: 16, background: "#f0f2f5", borderRadius: 8, textAlign: "center", lineHeight: "64px", fontWeight: "bold" }}>
          <img src="/logo192.png" alt="Logo" style={{ height: 40 }} />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          style={{ height: "100%", borderRight: 0 }}
          onClick={({ key }) => setSelectedMenu(key)}
        >
          <Menu.Item key="dashboard" icon={<PieChartOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>User Management</Menu.Item>
          <Menu.Item key="applications" icon={<FileOutlined />}>Tutor Applications</Menu.Item>
          <Menu.Item key="tutors" icon={<TeamOutlined />}>Tutor Management</Menu.Item>
          <Menu.Item key="bookings" icon={<FileOutlined />}>Booking Management</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ marginLeft: 24, fontWeight: "bold", fontSize: 18 }}>Dashboard</div>
          <div style={{ marginRight: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <span>Xin chào, {user.account?.username || 'Admin'}</span>
            <NotificationBell />
            <Avatar src="https://i.pravatar.cc/40" />
            <LogoutOutlined style={{ fontSize: 20, color: "#f5222d", cursor: "pointer" }} onClick={logout} />
          </div>
        </Header>
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          {selectedMenu === 'dashboard' && (
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={4}><Card><Statistic title="Total Users" value={stats.totalUsers} prefix={<UserOutlined />} /></Card></Col>
              <Col span={4}><Card><Statistic title="Active Users" value={stats.activeUsers} valueStyle={{ color: '#3f8600' }} /></Card></Col>
              <Col span={4}><Card><Statistic title="Blocked Users" value={stats.blockedUsers} valueStyle={{ color: '#cf1322' }} /></Card></Col>
              <Col span={4}><Card><Statistic title="Tutors" value={stats.tutors} valueStyle={{ color: '#1890ff' }} /></Card></Col>
              <Col span={4}><Card><Statistic title="Students" value={stats.students} valueStyle={{ color: '#52c41a' }} /></Card></Col>
            </Row>
          )}
          {selectedMenu === 'users' && (
            <UserManagement onBlockUser={(userId) => {
              setBlockUserId(userId);
              setBlockModalVisible(true);
            }} />
          )}
          {selectedMenu === 'applications' && <TutorApplications />}
          {selectedMenu === 'tutors' && <TutorManagement />}
          {selectedMenu === 'bookings' && <BookingManagement />}
          <Modal
            title="Block User"
            open={blockModalVisible}
            onCancel={() => { setBlockModalVisible(false); setBlockReason(""); setBlockUserId(null); }}
            onOk={confirmBlockUser}
            okText="Block"
            okButtonProps={{ danger: true }}
            destroyOnClose={false}
          >
            <p>Nhập lý do block user này:</p>
            <textarea
              value={blockReason}
              onChange={e => setBlockReason(e.target.value)}
              rows={4}
              style={{ width: '100%' }}
              placeholder="Nhập lý do block..."
            />
          </Modal>
          <Modal
            title="Delete User"
            open={deleteModalVisible}
            onCancel={() => { setDeleteModalVisible(false); setDeleteReason(""); setDeleteUserId(null); }}
            onOk={confirmDeleteUser}
            okText="Delete"
            okButtonProps={{ danger: true }}
            destroyOnClose={false}
          >
            <p>Nhập lý do xóa user này:</p>
            <textarea
              value={deleteReason}
              onChange={e => setDeleteReason(e.target.value)}
              rows={4}
              style={{ width: '100%' }}
              placeholder="Nhập lý do xóa..."
            />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard; 