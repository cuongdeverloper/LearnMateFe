import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Tooltip,
  Tabs,
  Switch,
  Divider,
  Descriptions
} from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  StarOutlined,
  DeleteOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { deleteTutorApi, fetchTutorsApi, toggleTutorStatusApi, unverifyTutorApi, verifyTutorApi } from '../Service/ApiService';

const { Title, Text } = Typography;

const TutorManagement = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
    active: 0,
  });
  const [activeTab, setActiveTab] = useState('all');

  // Get token from Redux store
  const accessToken = useSelector(state => state.user.account.access_token);

  const fetchTutors = async () => {
  try {
    setLoading(true);
    const result = await fetchTutorsApi(accessToken);
    if (result.errorCode === 0) {
      setTutors(result.data);

      const stats = {
        total: result.data.length,
        verified: result.data.filter(tutor => tutor.isVerified).length,
        unverified: result.data.filter(tutor => !tutor.isVerified).length,
        active: result.data.filter(tutor => tutor.isActive).length,
      };
      setStats(stats);
    } else {
      message.error(result.message || 'Failed to fetch tutors');
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (accessToken) {
      fetchTutors();
    }
  }, [accessToken]);


  const handleVerify = async (tutorId) => {
    const result = await verifyTutorApi(tutorId, accessToken);
    if (result.errorCode === 0) {
      message.success('Tutor verified successfully');
      fetchTutors();
    } else {
      message.error(result.message || 'Failed to verify tutor');
    }
  };

  const handleUnverify = async (tutorId) => {
    const result = await unverifyTutorApi(tutorId, accessToken);
    if (result.errorCode === 0) {
      message.success('Tutor unverified successfully');
      fetchTutors();
    } else {
      message.error(result.message || 'Failed to unverify tutor');
    }
  };


  const handleDelete = async (tutorId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this tutor?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const result = await deleteTutorApi(tutorId, accessToken);
        if (result.errorCode === 0) {
          message.success('Tutor deleted successfully');
          fetchTutors();
        } else {
          message.error(result.message || 'Failed to delete tutor');
        }
      }
    });
  };


  const showDetailModal = (tutor) => {
    setSelectedTutor(tutor);
    setDetailModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'green';
      case 'unverified': return 'orange';
      case 'active': return 'blue';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircleOutlined />;
      case 'unverified': return <ClockCircleOutlined />;
      case 'active': return <CheckCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const columns = [
    {
      title: 'Tutor',
      dataIndex: 'user',
      key: 'tutor',
      render: (user) => (
        <Space>
          <Avatar
            src={user?.image || user?.profileImage}
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: 'bold' }}>{user?.username}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{user?.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Subjects',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects) => (
        <Space wrap>
          {subjects?.map((subject, index) => (
            <Tag key={index} color="blue">{subject}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (experience) => (
        <Text ellipsis style={{ maxWidth: 200 }}>
          {experience}
        </Text>
      ),
    },
    {
      title: 'Price/Hour',
      dataIndex: 'pricePerHour',
      key: 'pricePerHour',
      render: (price) => (
        <Text strong>{price?.toLocaleString('vi-VN')}đ</Text>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text>{rating || 0}</Text>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location) => (
        <Text>{location}</Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={record.isVerified ? 'green' : 'orange'}>
          {record.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {activeTab === 'Verified' && record.isVerified && (
            <Button
              type="primary"
              icon={<CloseOutlined />}
              onClick={() => handleUnverify(record._id)}
              style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            >
              Unverify
            </Button>
          )}
          {activeTab === 'Unverified' && !record.isVerified && (
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleVerify(record._id)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Verify
            </Button>
          )}
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
          >
            View
          </Button>

          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredTutors = (status) => {
    if (status === 'all') return tutors;
    if (status === 'verified') return tutors.filter(tutor => tutor.isVerified);
    if (status === 'unverified') return tutors.filter(tutor => !tutor.isVerified);
    if (status === 'active') return tutors.filter(tutor => tutor.isActive);
    return tutors;
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Tutor Management</Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Tutors"
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Verified"
              value={stats.verified}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Unverified"
              value={stats.unverified}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Active"
              value={stats.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

      </Row>

      {/* Tutors Table */}
      <Card
        title="Tutors"
        extra={
          <Button
            type="primary"
            icon={<GlobalOutlined />}
            onClick={fetchTutors}
          >
            Refresh
          </Button>
        }
      >
        <Tabs
          defaultActiveKey="all"
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: `All (${stats.total})`,
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredTutors('all')}
                  rowKey="_id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} tutors`
                  }}
                />
              )
            },
            {
              key: 'Verified',
              label: `Verified (${stats.verified})`,
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredTutors('verified')}
                  rowKey="_id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} verified tutors`
                  }}
                />
              )
            },
            {
              key: 'Unverified',
              label: `Unverified (${stats.unverified})`,
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredTutors('unverified')}
                  rowKey="_id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} unverified tutors`
                  }}
                />
              )
            },
            {
              key: 'active',
              label: `Active (${stats.active})`,
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredTutors('active')}
                  rowKey="_id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} active tutors`
                  }}
                />
              )
            }
          ]}
        />

      </Card>

      {/* Detail Modal */}
      <Modal
        title="Tutor Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTutor && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                <Avatar
                  size={100}
                  src={selectedTutor.user?.image || selectedTutor.user?.profileImage}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col span={16}>
                <Descriptions title="Tutor Information" column={1}>
                  <Descriptions.Item label="Name">{selectedTutor.user?.username}</Descriptions.Item>
                  <Descriptions.Item label="Email">{selectedTutor.user?.email}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{selectedTutor.user?.phoneNumber}</Descriptions.Item>
                  <Descriptions.Item label="Role">{selectedTutor.user?.role}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider />

           <Descriptions title="Tutor Profile" column={2}>
  <Descriptions.Item label="Subjects">
    {selectedTutor.subjects?.map((subject, index) => (
      <Tag key={index} color="blue">{subject}</Tag>
    ))}
  </Descriptions.Item>
  <Descriptions.Item label="Price/Hour">
    {selectedTutor.pricePerHour?.toLocaleString('vi-VN')}đ
  </Descriptions.Item>

  <Descriptions.Item label="Location">{selectedTutor.location}</Descriptions.Item>
  <Descriptions.Item label="Education">{selectedTutor.education}</Descriptions.Item>

  <Descriptions.Item label="Rating">
    <Space>
      <StarOutlined style={{ color: '#faad14' }} />
      <Text>{selectedTutor.rating || 0}</Text>
    </Space>
  </Descriptions.Item>
  <Descriptions.Item label="Languages">
    {selectedTutor.languages?.map((lang, index) => (
      <Tag key={index} color="green">{lang}</Tag>
    ))}
  </Descriptions.Item>

  <Descriptions.Item label="Experience" span={2}>
    {selectedTutor.experience}
  </Descriptions.Item>
  <Descriptions.Item label="Bio" span={2}>
    {selectedTutor.bio}
  </Descriptions.Item>

  <Descriptions.Item label="Certifications" span={2}>
    {selectedTutor.certifications?.map((cert, index) => (
      <Tag key={index} color="purple">{cert.title} - {cert.issuedBy} ({cert.year})</Tag>
    ))}
  </Descriptions.Item>

  <Descriptions.Item label="Available Times" span={2}>
    {selectedTutor.availableTimes?.map((time, index) => (
      <div key={index} style={{ marginBottom: 8 }}>
        <Text strong>{time.day}: </Text>
        {time.slots?.map((slot, idx) => (
          <Tag key={idx} color="orange">{slot}</Tag>
        ))}
      </div>
    ))}
  </Descriptions.Item>
</Descriptions>


            <Divider />

            <Descriptions title="Status Information" column={2}>
              <Descriptions.Item label="Verified">
                <Tag color={selectedTutor.isVerified ? 'green' : 'orange'}>
                  {selectedTutor.isVerified ? 'YES' : 'NO'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Active">
                <Tag color={selectedTutor.isActive ? 'blue' : 'red'}>
                  {selectedTutor.isActive ? 'YES' : 'NO'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedTutor.createdAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {new Date(selectedTutor.updatedAt).toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TutorManagement; 