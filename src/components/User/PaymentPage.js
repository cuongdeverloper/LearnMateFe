import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../scss/PaymentPage.scss";

export default function PaymentPage() {
  const userId = useSelector((state) => state.user.account.id);
  const token = useSelector((state) => state.user.account.access_token);
  const [userPaymentInfo, setUserPaymentInfo] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amountToTopUp, setAmountToTopUp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  

  const fetchPaymentData = async () => {
    if (!userId) {
      setError("Không có userId để lấy dữ liệu");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const infoRes = await fetch(`http://localhost:6060/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!infoRes.ok) throw new Error("Lấy thông tin người dùng thất bại");
      const infoData = await infoRes.json();
  
      const historyRes = await fetch(`http://localhost:6060/user/${userId}/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!historyRes.ok) throw new Error("Lấy lịch sử thanh toán thất bại");
      const historyData = await historyRes.json();
  
      setUserPaymentInfo(infoData.user);
      setBalance(infoData.user.balance || 0);
      setPaymentHistory(historyData.payments || []);
    } catch (err) {
      setError(err.message || "Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPaymentData();
  }, [userId]);

  const handleTopUp = async () => {
    const amount = Number(amountToTopUp);
    if (!amount || amount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Đồng bộ với route backend thanh toán
      const res = await fetch("http://localhost:6060/payment/create-vnpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, userId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Tạo thanh toán thất bại");
      }

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán từ server");
      }
    } catch (err) {
      setError(err.message || "Lỗi khi nạp tiền");
      setLoading(false);
    }
  };

  if (loading && !userPaymentInfo) {
    return <div className="payment-page__loading">Đang tải thông tin thanh toán...</div>;
  }

  if (error && !userPaymentInfo) {
    return (
      <div className="payment-page__error">
        <p>{error}</p>
        <button onClick={fetchPaymentData}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <nav className="payment-page__navbar">Trang Quản Lý Thanh Toán</nav>

      <section className="payment-page__user-info">
        <h3>Thông tin người dùng</h3>
        <p><strong>Tên:</strong> {userPaymentInfo?.username || "Không xác định"}</p>
        <p><strong>Email:</strong> {userPaymentInfo?.email || "Không xác định"}</p>
        {userPaymentInfo?.phoneNumber && <p><strong>Điện thoại:</strong> {userPaymentInfo.phoneNumber}</p>}
        {userPaymentInfo?.paymentMethods && (
          <p><strong>Phương thức thanh toán:</strong> {userPaymentInfo.paymentMethods.join(", ")}</p>
        )}
        <h4 className="payment-page__balance">
          Số dư tài khoản: <span>{balance.toLocaleString()} VND</span>
        </h4>
      </section>

      <section className="payment-page__topup-form">
        <h3>Nạp tiền vào tài khoản</h3>
        <div className="payment-page__input-group">
          <input
            type="number"
            placeholder="Nhập số tiền (VND)"
            value={amountToTopUp}
            onChange={(e) => setAmountToTopUp(e.target.value)}
            min="0"
            disabled={loading}
          />
          <button onClick={handleTopUp} disabled={loading}>
            {loading ? "Đang xử lý..." : "Nạp tiền"}
          </button>
        </div>
      </section>

      <section className="payment-page__history">
        <h3>Lịch sử nạp tiền</h3>
        {paymentHistory.length === 0 ? (
          <p>Chưa có giao dịch nào.</p>
        ) : (
          <table className="payment-page__history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ngày giờ</th>
                <th>Số tiền (VND)</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((item, idx) => (
                <tr key={item._id || idx} className={idx % 2 === 0 ? "even" : "odd"}>
                  <td>{item._id || idx + 1}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{item.amount.toLocaleString()}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {error && (
        <div className="payment-page__error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Đóng</button>
        </div>
      )}
    </div>
  );
}
