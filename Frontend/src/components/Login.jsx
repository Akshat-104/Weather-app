import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import video from './video.mp4';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, form);
      setMessage(res.data.message);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        navigate("/weather");
      }
    } catch (err) {
      setMessage("Error logging in");
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
        <div className="flex justify-between items-center">
          
          <h2 className="text-xl font-bold flex justify-center mb-4">Login</h2>
        <button className="w-20 bg-blue-500 cursor-pointer text-white p-2 rounded hover:bg-blue-600 mb-4" onClick={() => navigate("/signup")}>SignUp</button>
        </div>
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
          className="w-full bg-blue-500 cursor-pointer text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}