import { useState } from "react";
import axios from "axios";
import video from "./video.mp4";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, form);
      setMessage(res.data.message);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
      }
    } catch (err) {
      setMessage("Error registering user");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <video className='absolute top-0 left-0 w-full h-full object-cover' autoPlay loop muted>
              <source src={video} type='video/mp4'/>
            </video>
      <form
        onSubmit={handleSubmit}
        className="bg-black/70 text-white rounded-lg shadow-lg p-8 max-w-md w-full z-10"
      >
        <div className="text-2xl mb-4 font-bold text-center">
              Weather App
            </div>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold flex mb-4">Signup</h2>
        <button className="w-20 bg-blue-500 cursor-pointer text-white p-2 rounded hover:bg-blue-600 mb-4" onClick={() => navigate("/login")}>Login</button>
        </div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Register
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}