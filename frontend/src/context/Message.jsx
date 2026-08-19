import { createContext, useState } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "/message";

  const [messages, setmessages] = useState([]);

  // Get Messages
  const getMessages = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        return;
      }

      setmessages(json);
    } catch (error) {
      console.log(error);
    }
  };

  // Send Message
  const sendMessage = async (id, text) => {
    try {
      const response = await fetch(`${BASE_URL}/send/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setmessages((prev) => [...prev, json.data || json]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        setmessages,
        getMessages,
        sendMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
