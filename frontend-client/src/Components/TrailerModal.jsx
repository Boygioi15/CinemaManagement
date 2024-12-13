// components/TrailerModal.jsx
import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5"; // Import biểu tượng IoClose từ react-icons

const TrailerModal = ({ videoOpen, setVideoOpen, videoUrl }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setVideoOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setVideoOpen]);

  if (!videoOpen) return null;

  // Thêm autoplay và mute vào URL của video
  const autoplayUrl = `${videoUrl}&autoplay=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div ref={modalRef} className="relative w-full max-w-[937px] bg-white">
        <iframe
          className="h-[528px] w-full"
          src={autoplayUrl} // Sử dụng URL mới với autoplay và mute
          title="Trailer"
          allowFullScreen
          allow="autoplay" // Cho phép autoplay
        />
        <button
          onClick={() => setVideoOpen(false)}
          className="absolute right-2 top-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 text-white hover:bg-black"
        >
          <IoClose className="h-6 w-6" /> {/* Sử dụng biểu tượng IoClose */}
        </button>
      </div>
    </div>
  );
};

export default TrailerModal;