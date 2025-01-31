import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import instance from "../config/axiosInstance";
import { toast } from "react-toastify";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialResponse = useCallback(
    async (response) => {
      try {
        const { data } = await axios.post("/google-login", {
          googleToken: response.credential,
        });

        localStorage.setItem("access_token", data.access_token);
        navigate("/");
      } catch (err) {
       toast.error(err)
      }
    },
    [navigate]
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await instance.post("/login", { email, password });
      localStorage.setItem("access_token", data.token);
      navigate("/");
    } catch (error) {
      console.log(error, "<-- Login error");
      toast.error(error.response?.data?.message || "Login gagal.");
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "673503023766-2ffib6ooe6n2i7sk23hscrfgaldhh35i.apps.googleusercontent.com ",
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        {
          theme: "outline",
          size: "large",
        }
      );
      window.google.accounts.id.prompt();
    }
  }, [navigate, handleCredentialResponse]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full mt-1 p-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* Google Login */}
        <div className="mt-4">
          <div id="buttonDiv" className="w-full flex justify-center"></div>
        </div>

        <p className="mt-4 text-sm text-gray-500 text-center">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  );
}
