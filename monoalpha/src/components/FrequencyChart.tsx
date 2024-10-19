import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface FrequencyChartProps {
  frequency: { [key: string]: number };
}

const FrequencyChart: React.FC<FrequencyChartProps> = ({ frequency }) => {
  // Prepare the data for the chart
  const data = Object.keys(frequency)
    .map((char) => ({
      character: char.toUpperCase(),
      count: frequency[char], // actual count of the character
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div style={{ width: "100%", height: 300, marginTop: 20 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="character" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#18181b">
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FrequencyChart;
