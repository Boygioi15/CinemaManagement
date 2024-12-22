import React, { useState } from "react";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const FilmShowChart = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const rooms = [
    "Theater 1",
    "Theater 2",
    "Theater 3",
    "Theater 4",
    "Theater 5",
  ];

  const events = [
    {
      id: 1,
      room: "Theater 1",
      film: "Inception",
      startTime: 23,
      duration: 1 + 47 / 60,
      category: "Sci-Fi",
      date: "2024-12-19",
      description:
        "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    },
    {
      id: 2,
      room: "Theater 2",
      film: "The Dark Knight",
      startTime: 10,
      duration: 2.75,
      category: "Action",
      date: "2024-12-19",
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    },
    {
      id: 3,
      room: "Theater 3",
      film: "Pulp Fiction",
      startTime: 13,
      duration: 2.8,
      category: "Crime",
      date: "2024-12-19",
      description:
        "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    },
    {
      id: 4,
      room: "Theater 1",
      film: "The Matrix",
      startTime: 15,
      duration: 2.3,
      category: "Sci-Fi",
      date: "2024-12-19",
      description:
        "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
    },
    {
      id: 5,
      room: "Theater 4",
      film: "Heat",
      startTime: 12,
      duration: 2.9,
      category: "Crime",
      date: "2024-12-19",
      description:
        "A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist.",
    },
  ];

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
      Empty: "bg-gray-300",
      "Sci-Fi": "bg-blue-500",
      Action: "bg-red-500",
      Crime: "bg-purple-500",
    };
    return colors[category] || "bg-gray-500";
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
        Daily Schedule Chart
      </h1>

      {/* Date Selection */}
      <div className="mb-6 flex gap-4">
        <div className="flex items-center">
          <label className="mr-2 text-gray-700">Selected Date:</label>
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
          {new Date(startDate).toLocaleDateString("en-US", {
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
                        No films scheduled
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
              <p>Room: {selectedEvent.room}</p>
              <p>Date: {selectedEvent.date}</p>
              <p>
                Time: {formatTime(selectedEvent.startTime, 0)} -{" "}
                {formatTime(
                  selectedEvent.startTime + Math.floor(selectedEvent.duration),
                  Math.round((selectedEvent.duration % 1) * 60)
                )}
              </p>
              <p>Duration: {formatDuration(selectedEvent.duration)}</p>
              <p>Category: {selectedEvent.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmShowChart;
