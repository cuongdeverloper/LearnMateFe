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
  Descriptions,
  Input,
  Form
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

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

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
    inactive: 0
  });
  const [activeTab, setActiveTab] = useState('all');
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationDetailModalVisible, setApplicationDetailModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectForm] = Form.useForm();
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const userRole = useSelector(state => state.user.account.role);

  // Get token from Redux store
  const accessToken = useSelector(state => state.user.account.access_token);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:6060/admin/tutors', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.errorCode === 0) {
        setTutors(response.data.data);
        
        // Calculate statistics
        const stats = {
          total: response.data.data.length,
          verified: response.data.data.filter(tutor => tutor.isVerified).length,
          unverified: response.data.data.filter(tutor => !tutor.isVerified).length,
          active: response.data.data.filter(tutor => tutor.isActive).length,
          inactive: response.data.data.filter(tutor => !tutor.isActive).length
        };
        setStats(stats);
      }
    } catch (error) {
      console.error('Error fetching tutors:', error);
      message.error('Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true);
      const response = await axios.get('http://localhost:6060/admin/applications', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data.errorCode === 0) {
        setApplications(response.data.data);
        const stats = {
          total: response.data.data.length,
          pending: response.data.data.filter(app => app.status === 'pending').length,
          approved: response.data.data.filter(app => app.status === 'approved').length,
          rejected: response.data.data.filter(app => app.status === 'rejected').length
        };
        setApplicationStats(stats);
      }
    } catch (error) {
      message.error('Failed to fetch applications');
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchTutors();
      fetchApplications();
    }
  }, [accessToken]);

  useEffect(() => {
    console.log('Tutors:', tutors);
  }, [tutors]);

  const handleVerify = async (tutorId) => {
    try {
      const response = await axios.put(`http://localhost:6060/admin/tutors/${tutorId}/verify`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.errorCode === 0) {
        message.success('Tutor verified successfully');
        fetchTutors();
      }
    } catch (error) {
      console.error('Error verifying tutor:', error);
      message.error('Failed to verify tutor');
    }
  };

  const handleUnverify = async (tutorId) => {
    try {
      const response = await axios.put(`http://localhost:6060/admin/tutors/${tutorId}/unverify`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.errorCode === 0) {
        message.success('Tutor unverified successfully');
        fetchTutors();
      }
    } catch (error) {
      console.error('Error unverifying tutor:', error);
      message.error('Failed to unverify tutor');
    }
  };

  const handleToggleStatus = async (tutorId, isActive) => {
    try {
      const response = await axios.put(`http://localhost:6060/admin/tutors/${tutorId}/toggle-status`, {
        isActive: !isActive
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data.errorCode === 0) {
        message.success(`Tutor ${!isActive ? 'activated' : 'deactivated'} successfully`);
        fetchTutors();
      }
    } catch (error) {
      console.error('Error toggling tutor status:', error);
      message.error('Failed to toggle tutor status');
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
        try {
          const response = await axios.delete(`http://localhost:6060/admin/tutors/${tutorId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });

          if (response.data.errorCode === 0) {
            message.success('Tutor deleted successfully');
            fetchTutors();
          }
        } catch (error) {
          console.error('Error deleting tutor:', error);
          message.error('Failed to delete tutor');
        }
      }
    });
  };

  const handleApproveApplication = async (applicationId) => {
    try {
      const response = await axios.put(`http://localhost:6060/admin/applications/${applicationId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data.errorCode === 0) {
        message.success('Application approved successfully');
        fetchApplications();
      }
    } catch (error) {
      message.error('Failed to approve application');
    }
  };
  const handleRejectApplication = async (values) => {
    try {
      const response = await axios.put(`http://localhost:6060/admin/applications/${selectedApplication._id}/reject`, {
        rejectionReason: values.rejectionReason
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data.errorCode === 0) {
        message.success('Application rejected successfully');
        setRejectModalVisible(false);
        rejectForm.resetFields();
        setSelectedApplication(null);
        fetchApplications();
      }
    } catch (error) {
      message.error('Failed to reject application');
    }
  };
  const showDetailModal = (tutor) => {
    setSelectedTutor(tutor);
    setDetailModalVisible(true);
  };
  const showApplicationDetailModal = (application) => {
    setSelectedApplication(application);
    setApplicationDetailModalVisible(true);
  };
  const showRejectModal = (application) => {
    setSelectedApplication(application);
    setRejectModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'green';
      case 'unverified': return 'orange';
      case 'active': return 'blue';
      case 'inactive': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircleOutlined />;
      case 'unverified': return <ClockCircleOutlined />;
      case 'active': return <CheckCircleOutlined />;
      case 'inactive': return <CloseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };
  const getApplicationStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'approved': return <CheckCircleOutlined />;
      case 'rejected': return <CloseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };
  const isIncomplete = (app) => {
    return !app.cvFile || !app.certificates || app.certificates.length === 0;
  };
  const isCorruptFile = (app) => {
    return app.cvFile && (!app.cvFile.startsWith('http://') && !app.cvFile.startsWith('https://'));
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

  const applicationColumns = [
    {
      title: 'Tutor',
      dataIndex: 'tutorId',
      key: 'tutor',
      render: (tutor) => (
        <Space>
          <Avatar src={tutor?.image} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{tutor?.username}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{tutor?.email}</div>
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
        <Text ellipsis style={{ maxWidth: 200 }}>{experience}</Text>
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getApplicationStatusColor(status)} icon={getApplicationStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Text>{new Date(date).toLocaleDateString('vi-VN')}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => showApplicationDetailModal(record)}
            >
              View
            </Button>
          </Tooltip>
          {userRole === 'admin' && record.status === 'pending' && !isIncomplete(record) && !isCorruptFile(record) && (
            <>
              <Tooltip title="Approve Application">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => handleApproveApplication(record._id)}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  Approve
                </Button>
              </Tooltip>
              <Tooltip title="Reject Application">
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => showRejectModal(record)}
                >
                  Reject
                </Button>
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const filteredTutors = (status) => {
    if (status === 'all') return tutors;
    if (status === 'verified') return tutors.filter(tutor => tutor.isVerified);
    if (status === 'unverified') return tutors.filter(tutor => !tutor.isVerified);
    if (status === 'active') return tutors.filter(tutor => tutor.isActive);
    if (status === 'inactive') return tutors.filter(tutor => !tutor.isActive);
    return tutors;
  };

  const filteredApplications = (status) => {
    if (status === 'all') return applications;
    return applications.filter(app => app.status === status);
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
        <Col span={4}>
          <Card>
            <Statistic
              title="Inactive"
              value={stats.inactive}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
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
        <Tabs defaultActiveKey="all" activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`All (${stats.total})`} key="all">
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
          </TabPane>
          <TabPane tab={`Verified (${stats.verified})`} key="Verified">
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
          </TabPane>
          <TabPane tab={`Unverified (${stats.unverified})`} key="Unverified">
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
          </TabPane>
        </Tabs>
      </Card>

      {/* Applications Table */}
      <Card 
        title="Applications" 
        extra={
          <Button 
            type="primary" 
            icon={<GlobalOutlined />}
            onClick={fetchApplications}
          >
            Refresh
          </Button>
        }
      >
        <Tabs defaultActiveKey="all" activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`Đơn chờ duyệt (${applicationStats.pending})`} key="pending">
            <Table
              columns={applicationColumns}
              dataSource={filteredApplications('pending')}
              rowKey="_id"
              loading={applicationsLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} pending applications`
              }}
            />
          </TabPane>
          <TabPane tab={`Đã duyệt (${applicationStats.approved})`} key="approved">
            <Table
              columns={applicationColumns}
              dataSource={filteredApplications('approved')}
              rowKey="_id"
              loading={applicationsLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} approved applications`
              }}
            />
          </TabPane>
          <TabPane tab={`Đã từ chối (${applicationStats.rejected})`} key="rejected">
            <Table
              columns={applicationColumns}
              dataSource={filteredApplications('rejected')}
              rowKey="_id"
              loading={applicationsLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} rejected applications`
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Tutor Details"
        visible={detailModalVisible}
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
              <Descriptions.Item label="Experience" span={2}>
                {selectedTutor.experience}
              </Descriptions.Item>
              <Descriptions.Item label="Bio" span={2}>
                {selectedTutor.bio}
              </Descriptions.Item>
              <Descriptions.Item label="Languages">
                {selectedTutor.languages?.map((lang, index) => (
                  <Tag key={index} color="green">{lang}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Certifications">
                {selectedTutor.certifications?.map((cert, index) => (
                  <Tag key={index} color="purple">{cert}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Available Times">
                {selectedTutor.availableTimes?.map((time, index) => (
                  <Tag key={index} color="orange">{time}</Tag>
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

      {/* Application Detail Modal */}
      <Modal
        title="Application Details"
        visible={applicationDetailModalVisible}
        onCancel={() => setApplicationDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedApplication && (
          <div>
            {isIncomplete(selectedApplication) && (
              <div style={{ marginBottom: 16 }}>
                <Tag color="red">Incomplete application. Please request additional documents.</Tag>
              </div>
            )}
            {isCorruptFile(selectedApplication) && (
              <div style={{ marginBottom: 16 }}>
                <Tag color="red">CV file is corrupt or unreadable. Please request resubmission from the tutor.</Tag>
              </div>
            )}
            <Row gutter={16}>
              <Col span={8}>
                <Avatar
                  size={100}
                  src={selectedApplication.tutorId?.image}
                  icon={<UserOutlined />}
                />
              </Col>
              <Col span={16}>
                <Descriptions title="Tutor Information" column={1}>
                  <Descriptions.Item label="Name">{selectedApplication.tutorId?.username}</Descriptions.Item>
                  <Descriptions.Item label="Email">{selectedApplication.tutorId?.email}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{selectedApplication.tutorId?.phoneNumber}</Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
            <Divider />
            <Descriptions title="Application Details" column={2}>
              <Descriptions.Item label="Subjects">
                {selectedApplication.subjects?.map((subject, index) => (
                  <Tag key={index} color="blue">{subject}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Price/Hour">
                {selectedApplication.pricePerHour?.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
              <Descriptions.Item label="Location">{selectedApplication.location}</Descriptions.Item>
              <Descriptions.Item label="Education">{selectedApplication.education}</Descriptions.Item>
              <Descriptions.Item label="Experience" span={2}>
                {selectedApplication.experience}
              </Descriptions.Item>
              <Descriptions.Item label="Bio" span={2}>
                {selectedApplication.bio}
              </Descriptions.Item>
              <Descriptions.Item label="Languages">
                {selectedApplication.languages?.map((lang, index) => (
                  <Tag key={index} color="green">{lang}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="Certificates">
                {selectedApplication.certificates?.map((cert, index) => (
                  <Tag key={index} color="purple">{cert}</Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <div>
              <Text strong>CV File:</Text>
              <div style={{ marginTop: 8 }}>
                {selectedApplication.cvFile && selectedApplication.cvFile.startsWith('http') ? (
                  <a href={selectedApplication.cvFile} target="_blank" rel="noopener noreferrer">
                    <Button icon={<FileTextOutlined />}>View CV</Button>
                  </a>
                ) : (
                  <Tag color="red">CV file is missing or invalid.</Tag>
                )}
              </div>
            </div>
            {selectedApplication.status !== 'pending' && (
              <>
                <Divider />
                <Descriptions title="Review Information" column={2}>
                  <Descriptions.Item label="Reviewed By">
                    {selectedApplication.reviewedBy?.username}
                  </Descriptions.Item>
                  <Descriptions.Item label="Reviewed At">
                    {new Date(selectedApplication.reviewedAt).toLocaleString('vi-VN')}
                  </Descriptions.Item>
                  {selectedApplication.rejectionReason && (
                    <Descriptions.Item label="Rejection Reason" span={2}>
                      {selectedApplication.rejectionReason}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Application Modal */}
      <Modal
        title="Reject Application"
        visible={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          rejectForm.resetFields();
          setSelectedApplication(null);
        }}
        footer={null}
      >
        <Form form={rejectForm} onFinish={handleRejectApplication} layout="vertical">
          <Form.Item
            name="rejectionReason"
            label="Rejection Reason"
            rules={[{ required: true, message: 'Please provide a rejection reason' }]}
          >
            <TextArea rows={4} placeholder="Please provide a detailed reason for rejection..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" danger>
                Reject Application
              </Button>
              <Button onClick={() => {
                setRejectModalVisible(false);
                rejectForm.resetFields();
                setSelectedApplication(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TutorManagement; 