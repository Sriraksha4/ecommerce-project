import React, { useState } from "react";

// Helper to find the maximum value in dataset for scaling
const getMaxValue = (data) => {
  const values = data.map((d) => d.value);
  const max = Math.max(...values, 10); // avoid division by 0
  return Math.ceil(max * 1.1); // add 10% padding
};

// 1. Premium SVG Line Chart
export const LineChart = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  if (!data || data.length === 0) return <div className="text-muted text-center py-4">No data</div>;

  const width = 600;
  const height = 280;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxValue = getMaxValue(data);

  // Generate points coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.value / maxValue) * chartHeight;
    return { x, y, label: d.label, value: d.value };
  });

  // Generate Bezier path line
  let pathD = "";
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      // Control points for smooth bezier curve
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
  }

  // Generate fill path to draw gradient underneath the line
  const fillD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : "";

  // Grid lines
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, i) => {
    const val = (maxValue / (gridLinesCount - 1)) * i;
    const y = paddingTop + chartHeight - (val / maxValue) * chartHeight;
    return { y, value: Math.round(val) };
  });

  return (
    <div className="position-relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-100 h-auto">
        <defs>
          {/* Glowing Line Gradient */}
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          {/* Area Fill Gradient */}
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          {/* Shadow Filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3b82f6" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              className="chart-grid-line"
              strokeDasharray="4"
            />
            <text
              x={paddingLeft - 10}
              y={line.y + 4}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="end"
            >
              ₹{line.value.toLocaleString("en-IN")}
            </text>
          </g>
        ))}

        {/* X Axis Labels */}
        {points.map((pt, i) => (
          <text
            key={i}
            x={pt.x}
            y={height - 15}
            fill="#94a3b8"
            fontSize="10"
            textAnchor="middle"
          >
            {pt.label}
          </text>
        ))}

        {/* Area Fill */}
        <path d={fillD} fill="url(#areaGrad)" />

        {/* Line Stroke */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="3"
          filter="url(#glow)"
        />

        {/* Interaction Points */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4"
              fill="#ffffff"
              stroke="#3b82f6"
              strokeWidth="2"
              className="chart-line-point"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          </g>
        ))}
      </svg>

      {/* Floating Tooltip */}
      {hoveredPoint && (
        <div
          className="position-absolute bg-dark border rounded px-3 py-2 text-white small pointer-events-none"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100 - 15}%`,
            transform: "translate(-50%, -100%)",
            zIndex: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(15, 23, 42, 0.95)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="text-muted extra-small">{hoveredPoint.label}</div>
          <div className="fw-bold">₹{hoveredPoint.value.toLocaleString("en-IN")}</div>
        </div>
      )}
    </div>
  );
};

// 2. Premium SVG Bar Chart
export const BarChart = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState(null);

  if (!data || data.length === 0) return <div className="text-muted text-center py-4">No data</div>;

  const width = 600;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxValue = getMaxValue(data);

  const barWidth = (chartWidth / data.length) * 0.6;
  const barSpacing = (chartWidth / data.length) * 0.4;

  const bars = data.map((d, index) => {
    const x = paddingLeft + index * (barWidth + barSpacing) + barSpacing / 2;
    const barHeight = (d.value / maxValue) * chartHeight;
    const y = paddingTop + chartHeight - barHeight;
    return { x, y, width: barWidth, height: barHeight, label: d.label, value: d.value };
  });

  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount }).map((_, i) => {
    const val = (maxValue / (gridLinesCount - 1)) * i;
    const y = paddingTop + chartHeight - (val / maxValue) * chartHeight;
    return { y, value: Math.round(val) };
  });

  return (
    <div className="position-relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-100 h-auto">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              className="chart-grid-line"
              strokeDasharray="4"
            />
            <text
              x={paddingLeft - 10}
              y={line.y + 4}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="end"
            >
              {line.value}
            </text>
          </g>
        ))}

        {/* Bars */}
        {bars.map((bar, i) => (
          <g key={i}>
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill="url(#barGrad)"
              rx="4"
              className="chart-bar-rect"
              onMouseEnter={() => setHoveredBar(bar)}
              onMouseLeave={() => setHoveredBar(null)}
            />
            <text
              x={bar.x + bar.width / 2}
              y={height - 15}
              fill="#94a3b8"
              fontSize="10"
              textAnchor="middle"
            >
              {bar.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Floating Tooltip */}
      {hoveredBar && (
        <div
          className="position-absolute bg-dark border rounded px-3 py-2 text-white small pointer-events-none"
          style={{
            left: `${((hoveredBar.x + hoveredBar.width / 2) / width) * 100}%`,
            top: `${(hoveredBar.y / height) * 100 - 15}%`,
            transform: "translate(-50%, -100%)",
            zIndex: 10,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(15, 23, 42, 0.95)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="text-muted extra-small">{hoveredBar.label}</div>
          <div className="fw-bold">{hoveredBar.value} Units</div>
        </div>
      )}
    </div>
  );
};
