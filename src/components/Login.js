import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //const url = isSignup
    //  ? "http://13.61.177.195:8000/api/signup/"
    //  : "http://13.61.177.195:8000/api/login/";

    const url = isSignup
      ? "/api/signup/"
      : "/api/login/";

    const body = isSignup ? { username, email, password } : { email, password };

    try {
      const { data } = await axios.post(url, body);

      if (isSignup) {
        alert("Signup successful! Please login. Modified!");
        setIsSignup(false);
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        if (!data.token) {
          alert("Login failed: No token received.");
          return;
        }

        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err.response);

      if (err.response && err.response.data) {
        const respData = err.response.data;

        // If backend sends {message: "something"}
        if (respData.message) {
          alert(respData.message);
        } 
        // If backend sends serializer errors like {email: ["..."], password: ["..."]}
        else if (typeof respData === "object") {
          const errors = Object.values(respData).flat().join("\n");
          alert(errors);
        } else {
          alert(respData);
        }
      } else {
        alert("Server error!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-2xl w-96 flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          {isSignup ? "Sign Up" : "Login modified"}
        </h2>

        {isSignup && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-md font-semibold hover:scale-105 transform transition duration-300 disabled:opacity-50"
        >
          {loading
            ? isSignup
              ? "Signing up..."
              : "Logging in..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>

        <p className="text-center text-gray-500 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-indigo-500 hover:underline font-semibold"
            onClick={() => {
              setIsSignup(!isSignup);
              setUsername("");
              setEmail("");
              setPassword("");
            }}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}
