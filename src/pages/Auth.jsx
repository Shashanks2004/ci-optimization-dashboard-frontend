import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      password
    );
  };

  // ✅ ADDED
  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address.");
    }

    if (!validatePassword(password)) {
      return setError(
        "Password must be at least 8 characters with 1 letter, 1 number, and 1 special character."
      );
    }

    // ✅ Extra validations for signup only
    if (!isLogin) {
      if (name.trim().length < 3) {
        return setError("Name must be at least 3 characters.");
      }

      if (!validatePhone(phone)) {
        return setError("Enter valid 10-digit phone number.");
      }
    }

    localStorage.setItem("isAuth", "true");
    navigate("/dashboard");
  };

  // ✅ GOOGLE LOGIN HANDLER (unchanged)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          token: credentialResponse.credential,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAuth", "true");

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google login failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f3ece7]">

      {/* LEFT PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#e6d5c3] via-[#b08968] to-[#5c3d2e] text-white items-center justify-center p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6 leading-tight text-white">
            Continuous Integration Optimization 
          </h1>
          <p className="text-lg text-[#f5e6dc] leading-relaxed">
            Enhance deployment efficiency, streamline DevOps workflows,
            and accelerate software delivery with intelligent automation.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-[#f8f4f1]">
        <form
          onSubmit={handleSubmit}
          className="bg-[#fffaf7] shadow-lg p-10 rounded-xl w-[380px] border border-[#e0d3c5]"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-[#4a2f25]">
            {isLogin ? "Login" : "Create Account"}
          </h2>

          {/* GOOGLE OAUTH BUTTON */}
          <div className="mb-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
              theme="outline"
              size="large"
              shape="rectangular"
            />
          </div>

          <div className="text-center text-sm text-[#a1887f] mb-4">OR</div>

          {/* ✅ SHOW ONLY DURING SIGNUP */}
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full mb-4 p-3 bg-[#f4efeb] border border-[#d8c7b8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full mb-4 p-3 bg-[#f4efeb] border border-[#d8c7b8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 bg-[#f4efeb] border border-[#d8c7b8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 bg-[#f4efeb] border border-[#d8c7b8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539] placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-600 text-sm mb-3">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#7f5539] hover:bg-[#5c3d2e] text-white py-3 rounded-lg transition font-medium"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>

          <p className="text-center mt-6 text-sm text-[#8d6e63]">
            {isLogin ? "New user?" : "Already have an account?"}{" "}
            <span
              className="text-[#7f5539] cursor-pointer font-medium hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
