import React, { createContext, useState, useContext } from 'react';

const TicketContext = createContext();

export const useTicket = () => {
  return useContext(TicketContext);
};

export const TicketProvider = ({ children }) => {
  const [ticketQuantities, setTicketQuantities] = useState({
    adult: 0,
    child: 0,
    pair: 0,
  });

  const updateQuantity = (name, quantity) => {
    setTicketQuantities((prevQuantities) => ({
      ...prevQuantities,
      [name]: quantity, // Sử dụng name để cập nhật số lượng
    }));
  };

  return (
    <TicketContext.Provider value={{ ticketQuantities, updateQuantity }}>
      {children}
    </TicketContext.Provider>
  );
};
