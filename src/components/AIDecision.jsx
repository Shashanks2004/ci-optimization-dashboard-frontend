import { useEffect, useState } from "react";

export default function AIDecision() {
  const [ai, setAi] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/latest-ai")
      .then(res => res.json())
      .then(data => setAi(data))
      .catch(err => console.error(err));
  }, []);

  if (!ai) return null;

  const riskColor =
    ai.risk_level === "High"
      ? "text-[#C62828]"
      : ai.risk_level === "Medium"
      ? "text-[#EF6C00]"
      : "text-[#2E7D32]";

  const predictionColor =
    ai.status === "Failed"
      ? "text-[#C62828]"
      : "text-[#2E7D32]";

  return (
    <div
      className="bg-white/50 backdrop-blur-md
                 border border-[#DDB892]
                 rounded-2xl p-6 shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4 text-[#5C4033]">
        Latest AI Decision
      </h3>

      <div className="space-y-3 text-sm text-[#4E342E]">

        <p>
          Commit <b>{ai.commit_hash}</b>
        </p>

        <p>
          Risk{" "}
          <span className={`${riskColor} font-semibold`}>
            {ai.risk_level}
          </span>
        </p>

        {/* 🧠 AI Metrics */}
        <p>
          Failure Probability{" "}
          <b className="text-[#8E24AA]">
            {ai.failure_probability ?? 0}%
          </b>
        </p>

        <p>
          Confidence{" "}
          <b className="text-[#00897B]">
            {ai.confidence ?? 0}%
          </b>
        </p>

        <hr className="border-[#EAD7C3]" />

        <p>
          Prediction{" "}
          <b className={`${predictionColor} font-semibold`}>
            {ai.status}
          </b>
        </p>

        <p className="text-[#8D6E63] font-medium hover:text-[#5C4033] cursor-pointer transition duration-200">
          Action: {ai.selected_tests}
        </p>

      </div>
    </div>
  );
}
