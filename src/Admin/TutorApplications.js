import React, { useState, useEffect } from 'react';
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
  Input,
  Form,
  Divider,
  Descriptions,
  Image
} from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { approveApplicationApi, fetchApplicationsApi, rejectApplicationApi } from '../Service/ApiService';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TutorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectForm] = Form.useForm();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Get token from Redux store
  const accessToken = useSelector(state => state.user.account.access_token);

  // Lấy role từ redux
  const userRole = useSelector(state => state.user.account.role);

  const fetchApplications = async () => {
  try {
    setLoading(true);

    const result = await fetchApplicationsApi();
    if (result.error) {
      message.error(result.message || 'Failed to fetch applications');
      return;
    }

    const applications = result.data;
    setApplications(applications);

    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
    setStats(stats);
  } catch (error) {
    message.error("Unexpected error");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (accessToken) {
      fetchApplications();
    }
  }, [accessToken]);

  const handleApprove = async (applicationId) => {
  const result = await approveApplicationApi(applicationId);

  if (result.success) {
    message.success('Application approved successfully');
    fetchApplications();
  } else {
    message.error(result.message || 'Failed to approve application');
  }
};

 const handleReject = async (values) => {
  const result = await rejectApplicationApi(selectedApplication._id, values.rejectionReason);

  if (result.success) {
    message.success('Application rejected successfully');
    setRejectModalVisible(false);
    rejectForm.resetFields();
    setSelectedApplication(null);
    fetchApplications();
  } else {
    message.error(result.message || 'Failed to reject application');
  }
};

  const showDetailModal = (application) => {
    setSelectedApplication(application);
    setDetailModalVisible(true);
  };

  const showRejectModal = (application) => {
    setSelectedApplication(application);
    setRejectModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'approved': return <CheckCircleOutlined />;
      case 'rejected': return <CloseCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  // Kiểm tra thiếu giấy tờ
  const isIncomplete = (app) => {
    return !app.cvFile || !app.certificates || app.certificates.length === 0;
  };

  // Kiểm tra file CV có hợp lệ không (chỉ kiểm tra link, không kiểm tra file thực tế)
  const isCorruptFile = (app) => {
    return app.cvFile && (!app.cvFile.startsWith('http://') && !app.cvFile.startsWith('https://'));
  };

  const columns = [
    {
      title: 'Tutor',
      dataIndex: 'tutorId',
      key: 'tutor',
      render: (tutor) => (
        <Space>
          <Avatar 
            src={tutor?.image} 
            icon={<UserOutlined />}
          />
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
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
              onClick={() => showDetailModal(record)}
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
                  onClick={() => handleApprove(record._id)}
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

  const filteredApplications = (status) => {
    if (status === 'all') return applications;
    return applications.filter(app => app.status === status);
  };

  // Log thao tác approve/reject
  const handleApproveLog = async (applicationId) => {
    await handleApprove(applicationId);
  };
  const handleRejectLog = async (values) => {
    await handleReject(values);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Tutor Applications Management</Title>
      
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Applications"
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Approved"
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Rejected"
              value={stats.rejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Applications Table */}
      <Card 
        title="Applications" 
        extra={
          <Button 
            type="primary" 
            icon={<FileTextOutlined />}
            onClick={fetchApplications}
          >
            Refresh
          </Button>
        }
      >
        <Tabs
  defaultActiveKey="all"
  items={[
    {
      key: 'all',
      label: `All (${stats.total})`,
      children: (
        <Table
          columns={columns}
          dataSource={filteredApplications('all')}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} applications`
          }}
        />
      )
    },
    {
      key: 'pending',
      label: `Pending (${stats.pending})`,
      children: (
        <Table
          columns={columns}
          dataSource={filteredApplications('pending')}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} pending applications`
          }}
        />
      )
    },
    {
      key: 'approved',
      label: `Approved (${stats.approved})`,
      children: (
        <Table
          columns={columns}
          dataSource={filteredApplications('approved')}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} approved applications`
          }}
        />
      )
    },
    {
      key: 'rejected',
      label: `Rejected (${stats.rejected})`,
      children: (
        <Table
          columns={columns}
          dataSource={filteredApplications('rejected')}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} rejected applications`
          }}
        />
      )
    }
  ]}
/>

      </Card>

      {/* Detail Modal */}
      <Modal
        title="Application Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
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

      {/* Reject Modal */}
      <Modal
        title="Reject Application"
        open={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false);
          rejectForm.resetFields();
          setSelectedApplication(null);
        }}
        footer={null}
      >
        <Form form={rejectForm} onFinish={handleRejectLog} layout="vertical">
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

export default TutorApplications; 