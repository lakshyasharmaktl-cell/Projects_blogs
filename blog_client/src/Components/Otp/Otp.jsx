import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Clock, RefreshCw } from "lucide-react";

export default function Otp() {
    const navigate = useNavigate();
    const location = useLocation();

    const { id } = useParams()

    const email = location.state?.email;
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(true);
    const inputRefs = useRef([]);

    useEffect(() => {
        let interval;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timer, isTimerActive]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        if (value && index === 5) {
            const otpValue = newOtp.join("");
            if (otpValue.length === 4) {
                handleSubmit(otpValue);
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
                inputRefs.current[index - 1].focus();
            } else if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1].focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d{6}$/.test(pasteData)) {
            const newOtp = pasteData.split('');
            setOtp(newOtp);
            newOtp.forEach((digit, idx) => {
                if (inputRefs.current[idx]) {
                    inputRefs.current[idx].value = digit;
                }
            });
            if (inputRefs.current[5]) {
                inputRefs.current[5].focus();
            }
        }
    };

    const handleSubmit = async (otpValue = null) => {
        const finalOtp = otpValue || otp.join("");

        if (finalOtp.length !== 4) {
            toast.warning("Please enter complete 4-digit OTP");
            return;
        }



        try {
            setLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1000));

            const res = await axios.post(`http://localhost:7890/verify_otp/${id}`, {
                email,
                otp: finalOtp,
            });

            if (res.status == 200) {
                toast.success(res.data?.msg || "Account verified successfully!");
                navigate("/login");
            }



        } catch (err) {

            toast.error(err.response?.data?.msg || "Invalid OTP. Please try again.");

            inputRefs.current.forEach(input => {
                if (input) {
                    input.classList.add('animate-shake');
                    setTimeout(() => {
                        input.classList.remove('animate-shake');
                    }, 500);
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (isTimerActive) return;

        try {
            setResending(true);

            await axios.post("http://localhost:7890/verify_otp/:id", { email });


            toast.success("New OTP sent to your email!");
            setTimer(60);
            setIsTimerActive(true);
            setOtp(["", "", "", ""]);
            inputRefs.current[0]?.focus();

        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 ">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-black hover:text-gray-500 mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </button>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-gray-100 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-700/30 overflow-hidden"
                >
                    <div className="p-8 md:p-10">
                        <div className="flex flex-col items-center text-center mb-8">
                            <motion.div
                                variants={itemVariants}
                                className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 mb-6"
                            >
                            </motion.div>

                            <motion.h2
                                variants={itemVariants}
                                className="text-3xl font-bold text-black mb-3"
                            >
                                Verify
                            </motion.h2>




                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <motion.div
                                variants={itemVariants}
                                className="mb-8"
                            >


                                <div
                                    className="flex justify-center gap-3 mb-6"
                                    onPaste={handlePaste}
                                >
                                    <AnimatePresence>
                                        {otp.map((digit, index) => (
                                            <motion.input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleChange(e.target.value, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                onFocus={(e) => e.target.select()}
                                                className="w-14 h-14 text-center text-2xl font-bold text-black bg-white border-2 border-blue-600/50 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all selection:bg-transparent"
                                                disabled={loading}
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0.9 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>


                            </motion.div>

                            <motion.button
                                variants={itemVariants}
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-4
                  ${loading
                                        ? 'bg-white cursor-not-allowed'
                                        : 'bg-white   active:scale-95'
                                    } shadow-lg shadow-red-500/20`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Verifying...
                                    </span>
                                ) : (
                                    "Verify & Continue"
                                )}
                            </motion.button>
                        </form>

                        <motion.div
                            variants={itemVariants}
                            className="text-center"
                        >


                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={resending || isTimerActive}
                                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all
                  ${isTimerActive || resending
                                        ? 'text-blue-400/60 bg-blue-800/20 cursor-not-allowed'
                                        : 'text-black bg-white hover:from-blue-600/40 hover:to-blue-700/40 border border-blue-600/50'
                                    }`}
                            >
                                {resending ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        {isTimerActive ? ` (${formatTime(timer)})` : ''}
                                    </>

                                )}
                            </button>
                        </motion.div>

                    </div>

                    <div className="h-2 bg-white"></div>
                </motion.div>

                <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}</style>
            </motion.div>
        </div>
    );
}