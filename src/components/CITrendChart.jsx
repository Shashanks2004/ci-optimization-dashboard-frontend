import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

export default function CITrendChart({ selectedRepo }) {
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    if (!selectedRepo) return;

    fetch(`https://ci-optimization-dashboard-backend.onrender.com/api/github/trend/${selectedRepo}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((run, index) => ({
          build: index + 1,
          result: run.status === "success" ? 1 : 0,
        }));

        setTrend(formatted);
      })
      .catch(err => console.error(err));
  }, [selectedRepo]);

  return (
    <div className="bg-white/50 backdrop-blur-md 
                    border border-[#DDB892] 
                    rounded-2xl p-6 shadow-md mt-6">

      <h3 className="text-lg font-semibold mb-4 text-[#5C4033]">
        CI Build Trend (Last 10 Builds)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="build" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="result"
            stroke="#2E7D32"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}