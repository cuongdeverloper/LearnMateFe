import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Avatar, Button, message } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector(state => state.user.account.access_token);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:6060/notifications?limit=10', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setNotifications(response.data.data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('http://localhost:6060/notifications/unread-count', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setUnreadCount(response.data.data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:6060/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      message.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:6060/notifications/read-all', {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      fetchNotifications();
      fetchUnreadCount();
      message.success('All notifications marked as read');
    } catch (error) {
      message.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:6060/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      fetchNotifications();
      fetchUnreadCount();
      message.success('Notification deleted');
    } catch (error) {
      message.error('Failed to delete notification');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'tutor_application':
        return '👨‍🏫';
      case 'user_blocked':
        return '🚫';
      case 'user_deleted':
        return '🗑️';
      case 'booking':
        return '📅';
      default:
        return '📢';
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchNotifications();
      fetchUnreadCount();
      
      // Polling để cập nhật thông báo mới
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000); // Cập nhật mỗi 30 giây

      return () => clearInterval(interval);
    }
  }, [accessToken]);

  const notificationItems = [
    {
      key: 'header',
      label: (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '8px 16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <span style={{ fontWeight: 'bold' }}>Thông báo</span>
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              onClick={markAllAsRead}
              style={{ padding: 0 }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
      )
    },
    ...notifications.map((notification) => ({
      key: notification._id,
      label: (
        <List.Item
          style={{
            padding: '12px 16px',
            backgroundColor: notification.isRead ? '#fff' : '#f6ffed',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer'
          }}
          onClick={() => !notification.isRead && markAsRead(notification._id)}
        >
          <List.Item.Meta
            avatar={
              <Avatar 
                style={{ 
                  backgroundColor: notification.isRead ? '#d9d9d9' : '#52c41a',
                  fontSize: '16px'
                }}
              >
                {getNotificationIcon(notification.type)}
              </Avatar>
            }
            title={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ 
                  fontWeight: notification.isRead ? 'normal' : 'bold',
                  color: notification.isRead ? '#666' : '#000'
                }}>
                  {notification.title}
                </span>
                <div>
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification._id);
                    }}
                    style={{ marginRight: 4 }}
                  />
                  {!notification.isRead && (
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification._id);
                      }}
                    />
                  )}
                </div>
              </div>
            }
            description={
              <div>
                <div style={{ 
                  color: notification.isRead ? '#666' : '#000',
                  marginBottom: 4
                }}>
                  {notification.message}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#999' 
                }}>
                  {formatTime(notification.createdAt)}
                </div>
              </div>
            }
          />
        </List.Item>
      )
    })),
    {
      key: 'empty',
      label: notifications.length === 0 ? (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#999' 
        }}>
          Không có thông báo nào
        </div>
      ) : null
    }
  ];

  return (
    <Dropdown
      menu={{ items: notificationItems }}
      placement="bottomRight"
      trigger={['click']}
      overlayStyle={{ width: 400, maxHeight: 500, overflow: 'auto' }}
    >
      <Badge count={unreadCount} size="small">
        <BellOutlined 
          style={{ 
            fontSize: 20, 
            cursor: 'pointer',
            color: unreadCount > 0 ? '#1890ff' : '#666'
          }} 
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell; 