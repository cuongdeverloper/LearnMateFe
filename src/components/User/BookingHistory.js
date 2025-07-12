import React, { useEffect, useState } from "react";
import axios from "../../Service/AxiosCustomize";
import { useSelector } from "react-redux";
import "../../scss/BookingHistory.scss";
import { FaCheckCircle, FaTimesCircle, FaClock, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify

// Component Modal đơn giản (có thể thay thế bằng thư viện UI khác)
const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button className="btn-confirm" onClick={onConfirm}>Xác nhận</button>
                </div>
            </div>
        </div>
    );
};


const BookingHistoryPage = () => {
    const userId = useSelector((state) => state.user.account.id);
    const token = useSelector((state) => state.user.account.access_token);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false); // State để hiển thị/ẩn modal
    const [selectedBookingId, setSelectedBookingId] = useState(null); // State để lưu ID booking đang chọn

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    const fetchBookingHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/bookings/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Dữ liệu bookings nhận được:", res.bookings);
            const sortedBookings = (res.bookings || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setBookings(sortedBookings);
        } catch (err) {
            console.error("Lỗi lấy lịch sử đặt lịch:", err);
            setError("Không thể tải lịch sử đặt lịch. Vui lòng thử lại sau.");
            toast.error("Không thể tải lịch sử đặt lịch."); // Thông báo lỗi bằng toast
        } finally {
            setLoading(false);
        }
    };

    // Hàm mở modal xác nhận
    const confirmCancel = (bookingId) => {
        setSelectedBookingId(bookingId);
        setShowCancelModal(true);
    };

    // Hàm đóng modal
    const handleCloseModal = () => {
        setShowCancelModal(false);
        setSelectedBookingId(null);
    };

    // Hàm xử lý hủy booking sau khi xác nhận trong modal
    const handleConfirmCancel = async () => {
        setShowCancelModal(false); // Đóng modal ngay lập tức
        if (!selectedBookingId) return;

        try {
            await axios.patch(`/bookings/${selectedBookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Đã hủy đặt lịch thành công và tiền đã được hoàn lại!"); // Toast thành công
            fetchBookingHistory(); // Tải lại danh sách booking sau khi hủy
        } catch (err) {
            console.error("Lỗi khi hủy đặt lịch:", err);
            let errorMessage = "Đã xảy ra lỗi khi hủy đặt lịch. Vui lòng thử lại.";
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = `Lỗi khi hủy đặt lịch: ${err.response.data.message}`;
            }
            toast.error(errorMessage); // Toast thất bại
        } finally {
            setSelectedBookingId(null); // Xóa ID booking đã chọn
        }
    };

    const renderStatus = (status) => {
        switch (status) {
            case "approve":
                return <span className="status approve"><FaCheckCircle /> Đã duyệt</span>;
            case "cancelled":
                return <span className="status cancelled"><FaTimesCircle /> Đã hủy</span>;
            default:
                return <span className="status pending"><FaClock /> Chờ duyệt</span>;
        }
    };

    if (loading) {
        return <div className="booking-history-container"><p>Đang tải lịch sử đặt lịch...</p></div>;
    }

    if (error) {
        // Không cần hiển thị p className="error-message" nữa vì đã có toast
        return <div className="booking-history-container"></div>;
    }

    return (
        <div className="booking-history-container">
            <h2>Lịch sử đặt lịch của bạn</h2>
            {bookings.length === 0 ? (
                <p className="empty-history">Bạn chưa có lịch sử đặt lịch nào.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>Gia sư</th>
                                <th>Số buổi</th>
                                <th>Số tiền</th>
                                <th>Trạng thái</th>
                                <th>Thời gian đặt</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => (
                                <tr key={b._id}>
                                    <td>
                                        <div className="tutor-info">
                                            <img
                                                src={b.tutorId?.user.image || "/default-avatar.png"}
                                                alt="avatar"
                                            />
                                            <span>{b.tutorId?.user.username || "Không rõ"}</span>
                                        </div>
                                    </td>
                                    <td>{b.numberOfSessions}</td>
                                    <td>{b.amount.toLocaleString()} VND</td>
                                    <td>{renderStatus(b.status)}</td>
                                    <td>{new Date(b.createdAt).toLocaleString()}</td>
                                    <td>
                                        {b.status === "pending" && (
                                            <button
                                                className="cancel-button"
                                                onClick={() => confirmCancel(b._id)} // Thay đổi gọi hàm confirmCancel
                                                title="Hủy đặt lịch"
                                            >
                                                <FaTrashAlt /> Hủy
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ToastContainer cho react-toastify */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Modal xác nhận */}
            <ConfirmModal
                show={showCancelModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
                message="Bạn có chắc chắn muốn hủy đặt lịch này? Hành động này không thể hoàn tác và tiền sẽ được hoàn lại vào số dư của bạn."
            />
        </div>
    );
};

export default BookingHistoryPage;