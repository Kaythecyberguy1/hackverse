import React, { useState } from "react";

export default function FlagPage() {
  const [labId, setLabId] = useState("");
  const [flag, setFlag] = useState("");
  const [message, setMessage] = useState("");

  const submitFlag = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/flags/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer hackverse-secret-token" // for now static
        },
        body: JSON.stringify({ labId, flag })
      });
      const data = await res.json();
      setMessage(data.message || "Error");
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-lg">
      <h1 className="text-xl font-bold mb-4">Submit Flag</h1>
      <form onSubmit={submitFlag}>
        <input
          type="text"
          placeholder="Lab ID (e.g. linux-intro)"
          value={labId}
          onChange={(e) => setLabId(e.target.value)}
          className="w-full p-2 mb-2 text-black rounded"
        />
        <input
          type="text"
          placeholder="Enter your flag"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          className="w-full p-2 mb-2 text-black rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 p-2 rounded font-bold hover:bg-green-700"
        >
          Submit
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
