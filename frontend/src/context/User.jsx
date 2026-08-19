import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "/auth";

  const [isloggedin, setisloggedin] = useState(0);
  const [user_detail, setuser_detail] = useState({
    name: "User Name",
    email: "user@example.com",
    phone: "",
    location: ""
  });
  const [all_users, setall_users] = useState([]);
  const [particular_user, setparticular_user] = useState({});

  const checkislogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getuser`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setisloggedin(1);
        const json = await response.json();
        setuser_detail(json);
      } else {
        setisloggedin(0);
      }
    } catch (error) {
      setisloggedin(0);
      console.log(error);
    }
  };

  useEffect(() => {
    checkislogin();
  }, []);

  // Signup
  const Signup = async (name, email, password, phone, location) => {
    try {
      const response = await fetch(`${BASE_URL}/Signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          location,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setisloggedin(0);
        alert(json.message);
        return false;
      }

      setisloggedin(1);
      await getUser();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Login
  const Login = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setisloggedin(0);
        alert(json.message);
        return false;
      }

      setisloggedin(1);
      await getUser();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get User Profile
  const getUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getuser`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        setisloggedin(0);
        return;
      }

      setuser_detail(json);
      setisloggedin(1);
    } catch (error) {
      setisloggedin(0);
      console.log(error);
    }
  };

  // Update User Profile
  const updateUser = async (name, phone, location) => {
    try {
      const response = await fetch(`${BASE_URL}/edit_user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone,
          location,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setuser_detail(json.user || json);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Logout
  const Logout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setuser_detail({
        name: "User Name",
        email: "user@example.com",
        phone: "",
        location: "",
      });

      setisloggedin(0);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get All Users (/api/auth/all_users)
  const getAllUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/all_users`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        return;
      }

      setall_users(json);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Particular User (/api/auth/particular_user/:id)
  const getParticularUser = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/particular_user/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        return;
      }

      setparticular_user(json);
      return json;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        Signup,
        Login,
        Logout,
        getUser,
        updateUser,
        getAllUsers,
        getParticularUser,

        isloggedin,
        setisloggedin,
        user_detail,
        setuser_detail,
        all_users,
        setall_users,
        particular_user,
        setparticular_user,

        checkislogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};