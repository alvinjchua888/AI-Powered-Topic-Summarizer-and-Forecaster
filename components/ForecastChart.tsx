// Fix: Create a native SVG chart component for forecast data.
import React from 'react';
import { ForecastDataPoint } from '../types';

interface ForecastChartProps {
  data: ForecastDataPoint[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">No data to display</div>;
  }

  const padding = 50;
  const svgWidth = 600;
  const svgHeight = 320;
  
  const chartWidth = svgWidth - 2 * padding;
  const chartHeight = svgHeight - 2 * padding;

  const dataValues = data.map(p => p.value);
  const dataMin = Math.min(...dataValues);
  const dataMax = Math.max(...dataValues);
  
  // Add padding to min/max for better visualization, handle flat line case
  const range = dataMax - dataMin;
  const minValue = range === 0 ? dataMin - (dataMin * 0.2 || 10) : dataMin - range * 0.1;
  const maxValue = range === 0 ? dataMax + (dataMax * 0.2 || 10) : dataMax + range * 0.1;

  const getX = (index: number) => {
    if (data.length === 1) {
        return padding + chartWidth / 2;
    }
    return padding + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    const valueRange = maxValue - minValue;
    if (valueRange === 0) return svgHeight - padding; // Center if no range
    return svgHeight - padding - ((value - minValue) / valueRange) * chartHeight;
  };

  const linePath = data.length > 1 ? data
    .map((point, index) => {
      const x = getX(index);
      const y = getY(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ') : '';

  const maxLabels = 12; // Max number of labels on X-axis
  const labelStep = data.length > maxLabels ? Math.ceil(data.length / maxLabels) : 1;
  
  const xLabels = data
    .map((point, index) => ({
      x: getX(index),
      label: point.time,
    }))
    .filter((_, index) => index % labelStep === 0 || index === data.length - 1);

  // Generate Y-axis labels based on the dynamic range
  const numYLabels = 5;
  const yLabels = Array.from({length: numYLabels}, (_, i) => {
      const value = minValue + (i * (maxValue - minValue)) / (numYLabels - 1);
      return {
        y: getY(value),
        label: value.toLocaleString(undefined, { maximumFractionDigits: 2 })
      }
  });

  return (
    <div className="w-full h-full flex justify-center items-center">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" aria-label="Forecast chart">
            <title>A line chart showing the forecasted trend over time.</title>
            {/* Y-axis grid lines and labels */}
            {yLabels.map(({ y, label }) => (
                <g key={`y-axis-${label}`} className="text-xs text-slate-400">
                    <line
                        x1={padding}
                        y1={y}
                        x2={svgWidth - padding}
                        y2={y}
                        stroke="currentColor"
                        strokeOpacity="0.2"
                        strokeDasharray="3 3"
                    />
                    <text
                        x={padding - 10}
                        y={y}
                        dy="0.3em"
                        textAnchor="end"
                        fill="currentColor"
                    >
                        {label}
                    </text>
                </g>
            ))}
             <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="currentColor" strokeOpacity="0.3" />


            {/* X-axis labels */}
            {xLabels.map(({ x, label }, index) => (
                <text
                    key={`x-axis-${index}`}
                    x={x}
                    y={svgHeight - padding + 20}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-xs text-slate-400"
                >
                    {label}
                </text>
            ))}
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight-padding} stroke="currentColor" strokeOpacity="0.3" />

            {/* Line path */}
            {linePath && <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth="2" />}

            {/* Data points */}
            {data.map((point, index) => (
                <circle
                    key={`dot-${index}`}
                    cx={getX(index)}
                    cy={getY(point.value)}
                    r="4"
                    fill="#38bdf8"
                    stroke="#0f172a"
                    strokeWidth="2"
                />
            ))}
        </svg>
    </div>
  );
};

export default ForecastChart;