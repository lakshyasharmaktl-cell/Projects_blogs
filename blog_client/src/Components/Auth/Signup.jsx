import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.gender) {
      toast.warning("All fields are required to join the club");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post( 
        "http://localhost:7890/register",
        formData
      );

      toast.success(response?.data?.msg || "OTP sent to your email ");

      navigate(`/otp-verify/${response?.data?.id}`);

    } catch (err) {
      toast.error(err.response?.data?.msg || "Server error. Try again.");
    }
  };

  const googleLogInAPi = () => {
    try {
      window.location.href = "http://localhost:7890/auth/google";
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="flex w-full max-w-5xl bg-gray-100 rounded-3xl shadow-2xl overflow-hidden border border-white/10">

        <div className="hidden lg:flex lg:w-1/2 relative h-100 mt-20">
          <img
            src="https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg?s=612x612&w=0&k=20&c=xR2vOmtg-N6Lo6_I269SoM5PXEVRxlgvKxXUBMeMC_A="
            alt="Whisky Aging"
            className="absolute inset-0 w-full h-full object-cover brightness-50"
          />
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-black mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs text-black mb-1 uppercase">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 py-2.5 bg-white text-black rounded-xl border border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-black uppercase" >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 py-2.5 bg-white text-black rounded-xl border border-white/10"
                />
              </div>
            </div>

            {/* GENDER */}
            <div>
              <label className="block text-xs text-black mb-2 uppercase">
                Gender
              </label>
              <div className="flex gap-4">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex-1">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      onChange={handleChange}
                      className="hidden peer"
                    />
                    <div className="py-2 text-center bg-white rounded-xl border border-white peer-checked:border-amber-600 peer-checked:text-amber-500">
                      {g}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* PASSWORD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-black mb-1 uppercase">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-10 py-2.5 bg-white text-black rounded-xl border border-white/10"
                  />
                  <div
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-black mb-1 uppercase">
                  Confirm
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-10 py-2.5 bg-white text-black rounded-xl border border-white/10"
                  />
                  <div
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  >
                    {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
            >
              Sign Up
            </button>
            <div className="mt-6 flex justify-center">
              <button
              type="button"
                onClick={googleLogInAPi}
                className="flex items-center justify-center gap-3 
               bg-white text-gray-700 font-semibold 
               px-6 py-3 rounded-xl 
               shadow-md hover:shadow-lg 
               hover:scale-105 
               transition-all duration-300 
               border border-gray-300"
              >
                <img
                  className="h-6 w-6"
                  src="https://static.vecteezy.com/system/resources/previews/042/165/816/non_2x/google-logo-transparent-free-png.png"
                  alt="Google Logo"
                />
                <span>Continue with Google</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );  
}
