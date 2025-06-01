// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../Service/ApiService';

// export default function PaymentResult() {
//   const { bookingId } = useParams();
//   const [status, setStatus] = useState('');

//   useEffect(() => {
//     const fetchResult = async () => {
//       try {
//         const res = await axios.get(`/bookings/pay/success/${bookingId}`);
//         setStatus('success');
//       } catch (err) {
//         setStatus('failed');
//       }
//     };
//     fetchResult();
//   }, [bookingId]);

//   return (
//     <div className="p-4 max-w-md mx-auto text-center">
//       {status === 'success' ? (
//         <div className="text-green-600 text-xl">Thanh toán thành công!</div>
//       ) : status === 'failed' ? (
//         <div className="text-red-600 text-xl">Thanh toán thất bại.</div>
//       ) : (
//         <div>Đang xử lý...</div>
//       )}
//     </div>
//   );
// }