import { createContext, useState, useEffect } from "react";

export const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "/friend";

  const [friends, setfriends] = useState([]);

  // Get Friends
  const getFriends = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_friends`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        return;
      }

      setfriends(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  // Add Friend
  const addFriend = async (friendId) => {
    try {
      const response = await fetch(`${BASE_URL}/add_friend/${friendId}`, {
        method: "POST",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      await getFriends();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Delete Friend
  const deleteFriend = async (friendId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_friend/${friendId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      await getFriends();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <FriendContext.Provider
      value={{
        friends,
        setfriends,
        getFriends,
        addFriend,
        deleteFriend,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};
