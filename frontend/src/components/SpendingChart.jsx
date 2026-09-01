import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SpendingChart = ({
  monthlySpending = [],
}) => {
  const formatAmount = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }

    return `₹${value}`;
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (
      !active ||
      !payload ||
      payload.length === 0
    ) {
      return null;
    }

    const amount = Number(payload[0].value);

    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-base font-bold text-slate-900">
          ₹
          {amount.toLocaleString("en-IN")}
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Spending Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your spending over the last 6 months
        </p>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[280px] w-full sm:h-[320px]">
        {monthlySpending.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-sm text-slate-400">
              Add expenses to see your spending trend.
            </p>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={monthlySpending}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />

              <YAxis
                tickFormatter={formatAmount}
                tick={{
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
                width={55}
              />

              <Tooltip
                content={<CustomTooltip />}
              />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0f172a"
                strokeWidth={3}
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SpendingChart;