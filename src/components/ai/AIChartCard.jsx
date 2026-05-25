import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AIGlassCard from "./AIGlassCard";

const AIChartCard = ({ title, data = [], chartType = "bar", dataKey = "value", secondaryKey }) => {
  const Chart = chartType === "line" ? LineChart : BarChart;

  return (
    <AIGlassCard title={title}>
      <div className="h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip />
            {chartType === "line" ? (
              <>
                <Line type="monotone" dataKey={dataKey} stroke="#3b82f6" strokeWidth={2} dot={false} />
                {secondaryKey && (
                  <Line type="monotone" dataKey={secondaryKey} stroke="#8b5cf6" strokeWidth={2} dot={false} />
                )}
              </>
            ) : (
              <>
                <Bar dataKey={dataKey} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={22} />
                {secondaryKey && (
                  <Bar dataKey={secondaryKey} fill="#a855f7" radius={[4, 4, 0, 0]} barSize={22} />
                )}
              </>
            )}
          </Chart>
        </ResponsiveContainer>
      </div>
    </AIGlassCard>
  );
};

export default AIChartCard;
