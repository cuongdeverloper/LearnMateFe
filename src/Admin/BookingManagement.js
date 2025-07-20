import React, { useEffect, useState } from 'react';
import { Table, Card, Row, Col, Statistic, Tag, Button, Input, Select, DatePicker, Modal, message, Space, Tooltip, Timeline, Calendar, Badge } from 'antd';
import { FileSearchOutlined, ReloadOutlined, EyeOutlined, ClockCircleOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { fetchBookingsApi, fetchScheduleDataApi } from '../Service/ApiService';

const { RangePicker } = DatePicker;
const { Option } = Select;

const statusColors = {
  pending: 'orange',
  approve: 'green',
  cancelled: 'red',
};

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [filters, setFilters] = useState({});
  const [detailModal, setDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const accessToken = useSelector(state => state.user.account.access_token);

  

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [page, limit, filters]);

  const handleFilter = (changed) => {
    setPage(1);
    setFilters(prev => ({ ...prev, ...changed }));
  };

  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Fetch schedule data from API
  const fetchScheduleData = async (bookingId) => {
  if (!bookingId) return [];

  setScheduleLoading(true);
  try {
    const data = await fetchScheduleDataApi(bookingId);
    if (data && data.length > 0) {
      setScheduleData(data.data);
      return data.data;
    } else {
      message.error(data.message || 'Không thể tải dữ liệu schedule. Vui lòng thử lại sau.');
      return [];
    }
  } catch {
    message.error('Không thể tải dữ liệu schedule. Vui lòng thử lại sau.');
    return [];
  } finally {
    setScheduleLoading(false);
  }
};

const fetchBookings = async (params = {}) => {
  setLoading(true);
  try {
    const data = await fetchBookingsApi({
      page,
      limit,
      ...filters,
      ...params,
    });
    if (data && data.length > 0) {
      setBookings(data);
      setTotal(data.length);
    } else {
      message.error(data.message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.');
    }
  } catch {
    message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
  } finally {
    setLoading(false);
  }
};

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <b>{id?.toString().substring(0, 8)}...</b>,
    },
    {
      title: 'Learner',
      dataIndex: ['learnerId', 'username'],
      key: 'learner',
      render: (username, record) => (
        <div>
          <div><b>{username}</b></div>
          <div style={{ fontSize: '11px', color: '#666' }}>{record.learnerId?.email}</div>
        </div>
      ),
    },
    {
      title: 'Tutor',
      dataIndex: ['tutorId', 'username'],
      key: 'tutor',
      render: (username, record) => (
        <div>
          <div><b>{username}</b></div>
          <div style={{ fontSize: '11px', color: '#666' }}>{record.tutorId?.email}</div>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount?.toLocaleString()}`,
    },
    {
      title: 'Sessions',
      dataIndex: 'numberOfSessions',
      key: 'numberOfSessions',
      render: (sessions) => (
        <div style={{ textAlign: 'center' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {sessions}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status] || 'default'}>{status?.toUpperCase()}</Tag>,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (note) => note ? (
        <Tooltip title={note}>
          <span style={{ cursor: 'pointer', color: '#1890ff' }}>📝</span>
        </Tooltip>
      ) : '-',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dt) => moment(dt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Tooltip title="View Details & Schedule">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={async () => { 
              setSelectedBooking(record); 
              setDetailModal(true);
              await fetchScheduleData(record._id);
            }} 
          />
        </Tooltip>
      ),
    },
  ];

  const getCalendarData = (scheduleData) => {
    const data = {};
    scheduleData.forEach(schedule => {
      const date = schedule.date;
      if (!data[date]) {
        data[date] = [];
      }
      data[date].push({
        type: 'success',
        content: `${schedule.startTime} - ${schedule.endTime}`,
      });
    });
    return data;
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Statistic title="Total Bookings" value={total} prefix={<FileSearchOutlined />} /></Col>
        <Col span={6}>
          <Statistic 
            title="Pending Bookings" 
            value={bookings.filter(b => b.status === 'pending').length} 
            prefix={<span style={{ color: '#fa8c16' }}>⏳</span>}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="Approved Bookings" 
            value={bookings.filter(b => b.status === 'approve').length} 
            prefix={<span style={{ color: '#52c41a' }}>✅</span>}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="Total Amount" 
            value={bookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString()} 
            prefix={<span style={{ color: '#3f8600' }}>$</span>}
            valueStyle={{ color: '#3f8600' }}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '12px 16px',
            background: '#fafafa',
            borderRadius: '6px',
            border: '1px solid #d9d9d9'
          }}>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 8 }}>📊 Hiển thị:</span>
              <span>{bookings.length} booking trên trang hiện tại</span>
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: 8 }}>📄 Trang:</span>
              <span>{page} / {Math.ceil(total / limit)}</span>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Space>
            <Input.Search
              placeholder="Booking ID..."
              allowClear
              onSearch={val => handleFilter({ _id: val })}
              style={{ width: 180 }}
            />
            <Input.Search
              placeholder="Learner..."
              allowClear
              onSearch={val => handleFilter({ learner: val })}
              style={{ width: 140 }}
            />
            <Input.Search
              placeholder="Tutor..."
              allowClear
              onSearch={val => handleFilter({ tutor: val })}
              style={{ width: 140 }}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 120 }}
              onChange={val => handleFilter({ status: val })}
            >
              <Option value="pending">Pending</Option>
              <Option value="approve">Approve</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
            <RangePicker
              onChange={dates => {
                if (!dates || dates.length === 0) handleFilter({ fromDate: undefined, toDate: undefined });
                else handleFilter({ fromDate: dates[0].startOf('day').toISOString(), toDate: dates[1].endOf('day').toISOString() });
              }}
            />
            <Button icon={<ReloadOutlined />} onClick={() => { setFilters({}); setPage(1); }} />
          </Space>
        </Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              type="primary" 
              icon="⟪" 
              onClick={() => setPage(1)}
              disabled={page === 1}
              title="Về trang đầu"
            >
              Đầu
            </Button>
            <Button 
              icon="<" 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              title="Trang trước"
            >
              Trước
            </Button>
            <span style={{ padding: '0 12px', fontWeight: 'bold' }}>
              Trang {page} / {Math.ceil(total / limit)}
            </span>
            <Button 
              icon=">" 
              onClick={() => setPage(Math.min(Math.ceil(total / limit), page + 1))}
              disabled={page >= Math.ceil(total / limit)}
              title="Trang sau"
            >
              Sau
            </Button>
            <Button 
              type="primary" 
              icon="⟫" 
              onClick={() => setPage(Math.ceil(total / limit))}
              disabled={page >= Math.ceil(total / limit)}
              title="Về trang cuối"
            >
              Cuối
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => fetchBookings()}
              title="Làm mới dữ liệu"
            >
              Làm mới
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} booking`,
            itemRender: (page, type, originalElement) => {
              if (type === 'prev') {
                return <Button size="small" icon="<" title="Trang trước" />;
              }
              if (type === 'next') {
                return <Button size="small" icon=">" title="Trang sau" />;
              }
              if (type === 'jump-prev') {
                return <Button size="small" title="Về đầu">⟪</Button>;
              }
              if (type === 'jump-next') {
                return <Button size="small" title="Về cuối">⟫</Button>;
              }
              return originalElement;
            },
            onChange: setPage,
          }}
          locale={{ emptyText: loading ? 'Loading...' : 'Không có booking nào tương ứng.' }}
        />
      </Card>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOutlined style={{ color: '#1890ff' }} />
            <span>Booking Details & Schedule</span>
          </div>
        }
        open={detailModal}
        onCancel={() => setDetailModal(false)}
        footer={null}
        width={800}
        destroyOnHidden={false}
      >
        {selectedBooking && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Booking Information" size="small" style={{ marginBottom: 16 }}>
                  <p><b>Booking ID:</b> {selectedBooking._id}</p>
                  <p><b>Amount:</b> ${selectedBooking.amount?.toLocaleString()}</p>
                  <p><b>Number of Sessions:</b> {selectedBooking.numberOfSessions}</p>
                  <p><b>Status:</b> <Tag color={statusColors[selectedBooking.status] || 'default'}>{selectedBooking.status?.toUpperCase()}</Tag></p>
                  {selectedBooking.note && <p><b>Note:</b> {selectedBooking.note}</p>}
                  <p><b>Created At:</b> {moment(selectedBooking.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                  <p><b>Updated At:</b> {moment(selectedBooking.updatedAt).format('DD/MM/YYYY HH:mm')}</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="User Information" size="small" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={24}>
                      <p><b>Learner:</b></p>
                      <div style={{ 
                        background: '#f6ffed', 
                        padding: '8px 12px', 
                        borderRadius: '6px',
                        borderLeft: '3px solid #52c41a'
                      }}>
                        <div><b>{selectedBooking.learnerId?.username}</b></div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{selectedBooking.learnerId?.email}</div>
                      </div>
                    </Col>
                    <Col span={24}>
                      <p><b>Tutor:</b></p>
                      <div style={{ 
                        background: '#fff7e6', 
                        padding: '8px 12px', 
                        borderRadius: '6px',
                        borderLeft: '3px solid #fa8c16'
                      }}>
                        <div><b>{selectedBooking.tutorId?.username}</b></div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{selectedBooking.tutorId?.email}</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Schedule Section */}
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ClockCircleOutlined style={{ color: '#52c41a' }} />
                  <span>Learning Schedule</span>
                </div>
              }
              size="small"
            >
              {scheduleLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div>Loading schedule data...</div>
                </div>
              ) : scheduleData && scheduleData.length > 0 ? (
                <div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <h4 style={{ marginBottom: 16 }}>📅 Schedule Timeline</h4>
                      <Timeline>
                        {scheduleData.map((schedule, idx) => (
                          <Timeline.Item 
                            key={idx}
                            color="green"
                            dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
                          >
                            <div>
                              <p style={{ margin: 0, fontWeight: 'bold' }}>
                                Session {idx + 1} - {moment(schedule.date).format('dddd, DD/MM/YYYY')}
                              </p>
                              <p style={{ margin: 0, color: '#666' }}>
                                ⏰ {schedule.startTime} - {schedule.endTime} ({schedule.subject})
                              </p>
                              <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>
                                📍 {schedule.location || 'Online'} | Status: <Tag color={schedule.attended ? 'green' : 'orange'} size="small">{schedule.attended ? 'Attended' : 'Scheduled'}</Tag>
                              </p>
                              {schedule.notes && (
                                <p style={{ margin: 0, color: '#666', fontSize: '11px', fontStyle: 'italic' }}>
                                  📝 {schedule.notes}
                                </p>
                              )}
                              <Tag color="green" style={{ marginTop: 4 }}>
                                <UserOutlined /> {selectedBooking.learnerId?.username} & {selectedBooking.tutorId?.username}
                              </Tag>
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </Col>
                    <Col span={12}>
                      <h4 style={{ marginBottom: 16 }}>📆 Calendar View</h4>
                      <Calendar
                        fullscreen={false}
                        dateCellRender={(date) => {
                          const dateStr = date.format('YYYY-MM-DD');
                          const daySchedules = scheduleData.filter(s => s.date === dateStr);
                          
                          return (
                            <div style={{ height: '100%', padding: '4px' }}>
                              {daySchedules.map((schedule, index) => (
                                <Badge 
                                  key={index}
                                  status="success" 
                                  text={
                                    <div style={{ fontSize: '10px', lineHeight: '1.2' }}>
                                      {schedule.startTime}
                                    </div>
                                  } 
                                />
                              ))}
                            </div>
                          );
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  <ClockCircleOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <p>No schedule data available</p>
                  <p>Schedule information will be displayed here once sessions are scheduled.</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingManagement; 