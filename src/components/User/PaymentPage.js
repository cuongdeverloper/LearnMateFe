import React, { useEffect, useState } from "react";
import "../../scss/PaymentPage.scss";

export default function PaymentPage() {
  const [userPaymentInfo, setUserPaymentInfo] = useState(null);
  const [balance, setBalance] = useState(0);
  const [amountToTopUp, setAmountToTopUp] = useState("");
  const [loading, setLoading] = useState(false);
  const [topUpResult, setTopUpResult] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUserPaymentInfo({
        username: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phoneNumber: "0909123456",
        paymentMethods: ["Visa **** 1234", "Momo: 0987654321"],
      });
      setBalance(1500000);
      setPaymentHistory([
        {
          id: 1,
          date: "2025-06-01 14:20",
          amount: 500000,
          status: "Thành công",
        },
        {
          id: 2,
          date: "2025-05-28 09:10",
          amount: 200000,
          status: "Thành công",
        },
        {
          id: 3,
          date: "2025-05-20 16:45",
          amount: 300000,
          status: "Thành công",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTopUp = () => {
    const amount = Number(amountToTopUp);
    if (!amount || amount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    setLoading(true);
    setTopUpResult(null);

    setTimeout(() => {
      setBalance((prev) => prev + amount);
      const newPayment = {
        id: paymentHistory.length + 1,
        date: new Date().toLocaleString("vi-VN", { hour12: false }),
        amount,
        status: "Thành công",
      };
      setPaymentHistory((prev) => [newPayment, ...prev]);
      setAmountToTopUp("");
      setTopUpResult(`Nạp tiền thành công: +${amount.toLocaleString()} VND`);
      setLoading(false);
    }, 1500);
  };

  if (loading || !userPaymentInfo) {
    return <div className="payment-page__loading">Đang tải thông tin thanh toán...</div>;
  }
  return (
    <div className="payment-page">
      {/* Navbar */}
      <nav className="payment-page__navbar">
        Trang Quản Lý Thanh Toán
      </nav>

      {/* User Info */}
      <section className="payment-page__user-info">
        <h3>Thông tin người dùng</h3>
        <p><strong>Tên:</strong> {userPaymentInfo.username}</p>
        <p><strong>Email:</strong> {userPaymentInfo.email}</p>
        <p><strong>Điện thoại:</strong> {userPaymentInfo.phoneNumber}</p>
        <p><strong>Phương thức thanh toán:</strong> {userPaymentInfo.paymentMethods.join(", ")}</p>
        <h4 className="payment-page__balance">
          Số dư tài khoản: <span>{balance.toLocaleString()} VND</span>
        </h4>
      </section>

      {/* Top-up form */}
      <section className="payment-page__topup-form">
        <h3>Nạp tiền vào tài khoản</h3>
        <div className="payment-page__input-group">
          <input
            type="number"
            placeholder="Nhập số tiền (VND)"
            value={amountToTopUp}
            onChange={(e) => setAmountToTopUp(e.target.value)}
            min="0"
          />
          <button
            onClick={handleTopUp}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Nạp tiền"}
          </button>
        </div>
        {topUpResult && <div className="payment-page__topup-result">{topUpResult}</div>}
      </section>

      {/* Payment history */}
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
                <tr key={item.id} className={idx % 2 === 0 ? "even" : "odd"}>
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.amount.toLocaleString()}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
