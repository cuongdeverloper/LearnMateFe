import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Import axios
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css';
import "../../scss/BookingSchedule.scss";

const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
];

// Time slots for 2-hour durations with 30-min breaks
const timeSlots = [
    "07:00 - 09:00",
    "09:30 - 11:30",
    "12:00 - 14:00",
    "14:30 - 16:30",
    "17:00 - 19:00",
    "19:30 - 21:30",
];

const getWeekDays = (monday) => {
    const days = [];
    const base = new Date(monday);
    for (let i = 0; i < 7; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        days.push(d.toISOString().slice(0, 10));
    }
    return days;
};

const BookingSchedule = () => {
    const { bookingId } = useParams();

    const [weekStart, setWeekStart] = useState(() => {
        const now = new Date();
        const day = now.getDay();
        const diff = day === 0 ? -6 : 1 - day; // Calculate days to subtract to get to Monday
        const monday = new Date(now);
        monday.setDate(now.getDate() + diff);
        return monday.toISOString().slice(0, 10);
    });

    const [busySlots, setBusySlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null); // NEW: State for booking details
    const [currentBookedSlotsCount, setCurrentBookedSlotsCount] = useState(0); // NEW: Count of already booked slots for THIS booking

    // Effect to load booking details
    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:6060/bookings/${bookingId}`);
                setBookingDetails(res.data);
            } catch (error) {
                console.error("Error fetching booking details:", error);
                toast.error("Không thể tải thông tin khóa học.");
            }
        };
        fetchBookingDetails();
    }, [bookingId]);

    // Effect to load busy slots (runs on bookingId or weekStart change)
    useEffect(() => {
        loadBusySlots();
    }, [bookingId, weekStart]);

    const loadBusySlots = async () => {
        try {
            const res = await axios.get(
                `http://localhost:6060/schedule/booking/${bookingId}/busy-slots?weekStart=${weekStart}`
            );
            setBusySlots(res.data);

            // NEW: Calculate how many slots are already booked for THIS booking
            const count = res.data.filter(slot => slot.bookingId === bookingId).length;
            setCurrentBookedSlotsCount(count);

            setSelectedSlots(new Set()); // Clear selected slots when week/data reloads
        } catch (err) {
            console.error("Error loading busy slots:", err);
            toast.error("Không thể tải lịch bận.");
        }
    };

    const weekDays = getWeekDays(weekStart);

    const busyMap = new Map();
    busySlots.forEach((slot) => {
        // Use the full slot.date here if it comes with time, or just the date part if it's 'YYYY-MM-DD'
        const dateKey = slot.date.slice(0, 10);
        const key = `${dateKey}|${slot.startTime}`;
        busyMap.set(key, slot);
    });

    const totalSessionsAllowed = bookingDetails ? bookingDetails.numberOfSessions : 0;
    const remainingSessionsToBook = totalSessionsAllowed - currentBookedSlotsCount;

    const toggleSlot = (date, timeSlot) => {
        const startTime = timeSlot.split(" - ")[0];
        const key = `${date}|${startTime}`;
        const slot = busyMap.get(key);

        // Cannot select if already busy (by self or others)
        if (slot) return;

        setSelectedSlots((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                // NEW: Prevent selection if it exceeds the remaining allowed sessions
                if (newSet.size < remainingSessionsToBook) {
                    newSet.add(key);
                } else {
                    toast.warn(`Bạn chỉ có thể chọn thêm ${remainingSessionsToBook} buổi học.`);
                }
            }
            return newSet;
        });
    };

    const handleAddSchedule = async () => {
        if (selectedSlots.size === 0) {
            toast.info("Vui lòng chọn ít nhất 1 ô giờ để thêm lịch.");
            return;
        }

        // NEW: Final check before saving
        if (currentBookedSlotsCount + selectedSlots.size > totalSessionsAllowed) {
            toast.error(`Tổng số buổi sau khi thêm sẽ vượt quá ${totalSessionsAllowed} buổi cho khóa học này. Vui lòng chọn lại.`);
            return;
        }

        // Group selected slots by date
        const slotsByDate = {};
        Array.from(selectedSlots).forEach((key) => {
            const [date, startTime] = key.split("|");
            if (!slotsByDate[date]) {
                slotsByDate[date] = [];
            }
            slotsByDate[date].push(startTime);
        });

        // Process and merge consecutive slots for each day
        const slotsToSave = [];
        for (const date in slotsByDate) {
            const currentDaySlots = slotsByDate[date].sort(); // Sort times for correct merging

            let i = 0;
            while (i < currentDaySlots.length) {
                let currentStartTime = currentDaySlots[i];
                let currentEndTime = timeSlots.find(slot => slot.startsWith(currentStartTime))?.split(" - ")[1];

                if (!currentEndTime) {
                    console.warn(`Could not find end time for slot starting at ${currentStartTime}`);
                    i++;
                    continue; // Skip this malformed slot
                }

                let j = i + 1;

                while (j < currentDaySlots.length) {
                    const prevTimeSlotFull = timeSlots.find(slot => slot.startsWith(currentDaySlots[j - 1]));
                    const currentTimeSlotFull = timeSlots.find(slot => slot.startsWith(currentDaySlots[j]));

                    if (prevTimeSlotFull && currentTimeSlotFull) {
                        const prevEndTime = prevTimeSlotFull.split(" - ")[1];
                        const currentStartTimeCheck = currentTimeSlotFull.split(" - ")[0];

                        // Get the index of the previous slot in timeSlots array
                        const prevSlotIndex = timeSlots.indexOf(prevTimeSlotFull);
                        // Get the index of the current slot being considered
                        const currentSlotIndex = timeSlots.indexOf(currentTimeSlotFull);

                        // Check if they are consecutive in the `timeSlots` array
                        if (currentSlotIndex === prevSlotIndex + 1) {
                            currentEndTime = currentTimeSlotFull.split(" - ")[1]; // Extend the end time
                            j++;
                        } else {
                            break; // Not consecutive
                        }
                    } else {
                        break; // Should not happen if timeSlots are well-defined
                    }
                }

                slotsToSave.push({
                    date: date,
                    startTime: currentStartTime,
                    endTime: currentEndTime,
                });
                i = j; // Move to the next unprocessed slot
            }
        }

        setLoading(true);
        try {
            await axios.post(`http://localhost:6060/schedule/booking/${bookingId}/add-slots`, { slots: slotsToSave });
            toast.success("Thêm lịch thành công!");
            loadBusySlots(); // Re-fetch to update counts and grid
        } catch (err) {
            console.error("Error adding schedule:", err);
            const errorMessage = err.response?.data?.message || err.message || "Thêm lịch thất bại";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSlot = async (scheduleId) => {
        if (!window.confirm("Bạn có chắc muốn xóa slot này?")) return;
        try {
            await axios.delete(`http://localhost:6060/schedule/${scheduleId}`);
            toast.success("Xóa slot thành công!");
            loadBusySlots(); // Re-fetch to update counts and grid
        } catch (err) {
            console.error("Error deleting slot:", err);
            const errorMessage = err.response?.data?.message || err.message || "Xóa slot thất bại";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="booking-schedule-container">
            <h2 className="heading">Quản lý lịch học cho Booking {bookingId}</h2>

            <div className="booking-summary">
                {bookingDetails ? (
                    <p>
                        Tổng số buổi được đặt: <strong>{totalSessionsAllowed}</strong> |
                        Số buổi đã xếp lịch: <strong>{currentBookedSlotsCount}</strong> |
                        Số buổi có thể xếp thêm: <strong>{remainingSessionsToBook}</strong>
                    </p>
                ) : (
                    <p>Đang tải thông tin booking...</p>
                )}
            </div>

            <div className="week-start-picker">
                <label>
                    Chọn ngày bắt đầu tuần (Thứ 2):{" "}
                    <input
                        type="date"
                        value={weekStart}
                        onChange={(e) => setWeekStart(e.target.value)}
                    />
                </label>
            </div>

            <table className="schedule-grid">
                <thead>
                    <tr>
                        <th>Khung giờ / Ngày</th>
                        {weekDays.map((date) => (
                            <th key={date}>
                                {date} <br />
                                <small>
                                    {
                                        dayNames[
                                            new Date(date).getDay() === 0
                                                ? 6
                                                : new Date(date).getDay() - 1
                                        ]
                                    }
                                </small>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map((timeSlot) => (
                        <tr key={timeSlot}>
                            <td className="time-slot">{timeSlot}</td>
                            {weekDays.map((date) => {
                                const startTime = timeSlot.split(" - ")[0];
                                const key = `${date}|${startTime}`;
                                const slot = busyMap.get(key);
                                const isSelected = selectedSlots.has(key);
                                const isBusy = !!slot;
                                const isOwnBooking = slot?.bookingId === bookingId;

                                let className = "slot-cell";
                                if (isBusy) {
                                    className += isOwnBooking ? " busy-own" : " busy-other";
                                } else if (isSelected) {
                                    className += " selected";
                                } else {
                                    className += " available";
                                }

                                return (
                                    <td
                                        key={key}
                                        className={className}
                                        onClick={() => {
                                            // Only allow selection if not busy and there are remaining sessions
                                            if (!isBusy && remainingSessionsToBook > 0) {
                                                toggleSlot(date, timeSlot);
                                            } else if (!isBusy && remainingSessionsToBook <= 0) {
                                                toast.warn("Bạn đã xếp đủ số buổi cho khóa học này.");
                                            }
                                        }}
                                    >
                                        {isBusy ? (
                                            <>
                                                <span>{isOwnBooking ? "Đã đặt (Bạn)" : "Đã đặt"}</span>
                                                {isOwnBooking && (
                                                    <button
                                                        className="delete-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteSlot(slot._id);
                                                        }}
                                                    >
                                                        X
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            isSelected && <span>✓</span>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="button-container">
                <button
                    onClick={handleAddSchedule}
                    disabled={loading || selectedSlots.size === 0 || remainingSessionsToBook <= 0} // Disable if no slots selected or no remaining capacity
                >
                    {loading ? "Đang lưu..." : "Lưu các slot mới"}
                </button>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default BookingSchedule;