import React, { useState, useEffect } from "react";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const FilmShowChart = () => {
  const [rooms, setRooms] = useState([]); // State cho rooms
  const [events, setEvents] = useState([]); // State cho events

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const fetchData = async (date) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/statistics/film-statistic?selectedDate=${date}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      // Cập nhật rooms và events
      setRooms(data.rooms);
      setEvents(
        data.events.map((event) => ({
          id: event.id,
          room: event.room,
          film: event.film,
          startTime: event.starttime,
          duration: event.duration,
          category: event.category.join(", "),
          date: event.date,
          description: event.description,
        }))
      );
    } catch (err) {
      setError(err.message); // Lưu lỗi
    }
  };

  // Gọi API mỗi khi selectedDate thay đổi
  useEffect(() => {
    fetchData(startDate);
  }, [startDate]);

  console.log(rooms);
  console.log(events);

  const getEventStyle = (startTime, duration, isSpanningEvent) => {
    let width, left;
    if (isSpanningEvent) {
      // Event continues from a previous day
      width = `${Math.min(duration, 24) * 100}px`;
      left = "25px"; // Starts from 0:00 AM
    } else {
      let endTime = startTime + duration;
      let startPosition, endPosition;

      if (endTime > 24) {
        // Event spans across midnight
        startPosition = startTime * 100;
        endPosition = 24 * 100 - 25;
      } else {
        startPosition = startTime * 100;
        endPosition = endTime * 100;
      }

      width = `${endPosition - startPosition}px`;
      left = `${startPosition + 25}px`;
    }

    return { width, left };
  };

  const getCategoryColor = (category) => {
    const colors = {
      Empty: "bg-blue-300",
      "Sci-Fi": "bg-blue-500",
      Action: "bg-red-500",
      Crime: "bg-purple-500",
    };
    return colors[category] || "bg-blue-500";
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const startDateObj = new Date(startDate);

    if (eventDate.getTime() === startDateObj.getTime()) {
      // Same day event
      return true;
    }

    // Event started the previous day and continues into the current day
    if (
      eventDate.getTime() === startDateObj.getTime() - 86400000 &&
      event.startTime + event.duration > 24
    ) {
      return true;
    }

    return false;
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Biểu đồ suất phim
      </h1>

      {/* Date Selection */}
      <div className="mb-6 flex gap-4">
        <div className="flex items-center">
          <label className="mr-2 text-gray-700">Chọn ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md p-2 "
          />
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {new Date(startDate).toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h2>
        <div className="relative overflow-x-auto">
          <div className="flex ml-40 mb-4">
            {Array.from({ length: 48 }, (_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[50px] text-sm text-gray-600 text-center"
              >
                {formatTime(Math.floor(i / 2), (i % 2) * 30)}
              </div>
            ))}
          </div>

          <div className="relative">
            {rooms.map((room) => {
              const filteredRoomEvents = filteredEvents.filter(
                (event) => event.room === room
              );

              return (
                <div
                  key={`${room}-${startDate}`}
                  className="flex items-center h-20 border-t border-gray-200"
                >
                  <div className="w-40 flex-shrink-0 font-medium text-gray-700 pr-4">
                    {room}
                  </div>
                  <div className="relative flex-grow h-full bg-white">
                    {filteredRoomEvents.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        Không có lịch phim
                      </div>
                    )}

                    {filteredRoomEvents.map((event) => {
                      const isSpanningEvent =
                        new Date(event.date).getTime() <
                        new Date(startDate).getTime();

                      const adjustedStartTime = isSpanningEvent
                        ? 0
                        : event.startTime;

                      const adjustedDuration = isSpanningEvent
                        ? event.startTime + event.duration - 24
                        : event.duration;

                      return (
                        <div
                          key={event.id}
                          className={`absolute top-2 bottom-2 rounded-lg ${getCategoryColor(
                            event.category
                          )} text-white cursor-pointer transition-transform hover:scale-y-110`}
                          style={getEventStyle(
                            adjustedStartTime,
                            adjustedDuration,
                            isSpanningEvent
                          )}
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="p-2 text-sm flex items-center h-full">
                            <FaPlay className="mr-2" />
                            <span className="truncate">{event.film}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedEvent.film}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">
                <FaInfoCircle className="inline mr-2" />
                {selectedEvent.description}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Phòng: {selectedEvent.room}</p>
              <p>Ngày: {selectedEvent.date}</p>
              <p>
                Time: {formatTime(selectedEvent.startTime, 0)} -{" "}
                {formatTime(
                  selectedEvent.startTime + Math.floor(selectedEvent.duration),
                  Math.round((selectedEvent.duration % 1) * 60)
                )}
              </p>
              <p>Thời lượng: {formatDuration(selectedEvent.duration)}</p>
              <p>Thể loại: {selectedEvent.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmShowChart;
