"use client";

import { useState } from "react";
import Navbar from "../../../components/Navbar";
import { motion } from "framer-motion";

export default function EnquiryPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    eventType: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Check required fields
    if (!form.name || !form.email || !form.mobile || !form.eventType) {
      return alert("Please fill all required fields");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setForm({ name: "", email: "", mobile: "", eventType: "", message: "" });
      } else {
        alert(data.error || "Failed to submit enquiry");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit enquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 text-gray-900">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-20 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 md:p-10"
        >
          <h1 className="text-3xl font-bold text-center mb-6">Enquiry Form</h1>

          {successMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-center"
            >
              {successMsg}
            </motion.p>
          )}

          {["name", "email", "mobile"].map((field) => (
            <input
              key={field}
              type={field === "email" ? "email" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              className="border border-pink-300 p-3 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
            />
          ))}

          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            className="border border-pink-300 p-3 rounded-xl w-full mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black"
          >
            <option value="">Select Event Type</option>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Wedding">Wedding</option>
            <option value="Corporate">Corporate</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            name="message"
            placeholder="Message (optional)"
            value={form.message}
            onChange={handleChange}
            className="border border-pink-300 p-3 rounded-xl w-full mb-4 h-24 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black resize-none"
          />

          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold w-full py-3 rounded-full shadow-md hover:shadow-xl transition-all"
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
