interface DonutChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  total: number;
  centerText: string;
}

const DonutChart = ({ data, total, centerText }: DonutChartProps) => {
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let startAngle = 0;

  return (
    <div className="relative h-40 w-40">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform"
      >
        {data.map((segment, i) => {
          const segmentPercentage = segment.value / total;
          const segmentLength = segmentPercentage * circumference;
          const dashArray = `${segmentLength} ${circumference - segmentLength}`;
          const currentAngle = startAngle;
          startAngle = startAngle + segmentPercentage * 360;

          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={0}
              style={{
                transform: `rotate(${currentAngle}deg)`,
                transformOrigin: 'center',
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold">{centerText}</span>
        <span className="text-xs text-gray-500">TOTAL</span>
      </div>
    </div>
  );
};

export default DonutChart;
