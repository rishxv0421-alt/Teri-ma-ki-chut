import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { HistoryRecord, VolatilityDataPoint, ColorTheme } from '../types';
import { calculateVolatilityTrend } from '../services/analyticsEngine';
import { soundService } from '../services/soundService';
import { Activity, TrendingUp, TrendingDown, Eye, Maximize2, Zap } from 'lucide-react';

interface D3VolatilityChartProps {
  history: HistoryRecord[];
  theme: ColorTheme;
}

export const D3VolatilityChart: React.FC<D3VolatilityChartProps> = ({ history, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [recordCount, setRecordCount] = useState<20 | 30 | 50>(50);
  const [hoveredPoint, setHoveredPoint] = useState<VolatilityDataPoint | null>(null);
  const [showThresholds, setShowThresholds] = useState<boolean>(true);

  // Compute trend data
  const data = useMemo(() => {
    return calculateVolatilityTrend(history, recordCount);
  }, [history, recordCount]);

  // Color accents depending on theme
  const themeColors = useMemo(() => {
    switch (theme) {
      case 'emerald':
        return {
          stroke: '#10b981',
          fillStart: 'rgba(16, 185, 129, 0.45)',
          fillEnd: 'rgba(16, 185, 129, 0.01)',
          glow: 'rgba(16, 185, 129, 0.6)',
          dot: '#34d399'
        };
      case 'crimson':
        return {
          stroke: '#f43f5e',
          fillStart: 'rgba(244, 63, 94, 0.45)',
          fillEnd: 'rgba(244, 63, 94, 0.01)',
          glow: 'rgba(244, 63, 94, 0.6)',
          dot: '#fb7185'
        };
      case 'amber':
        return {
          stroke: '#f59e0b',
          fillStart: 'rgba(245, 158, 11, 0.45)',
          fillEnd: 'rgba(245, 158, 11, 0.01)',
          glow: 'rgba(245, 158, 11, 0.6)',
          dot: '#fde047'
        };
      case 'arctic':
        return {
          stroke: '#38bdf8',
          fillStart: 'rgba(56, 189, 248, 0.45)',
          fillEnd: 'rgba(56, 189, 248, 0.01)',
          glow: 'rgba(56, 189, 248, 0.6)',
          dot: '#93c5fd'
        };
      case 'spectral':
      default:
        return {
          stroke: '#22d3ee',
          fillStart: 'rgba(168, 85, 247, 0.45)',
          fillEnd: 'rgba(6, 182, 212, 0.01)',
          glow: 'rgba(34, 211, 238, 0.6)',
          dot: '#c084fc'
        };
    }
  }, [theme]);

  // Current volatility and slope
  const latestVol = data.length > 0 ? data[data.length - 1].volatility : 50;
  const prevVol = data.length > 1 ? data[data.length - 2].volatility : latestVol;
  const isRising = latestVol >= prevVol;

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth || 360;
    const height = 180;
    const margin = { top: 18, right: 14, bottom: 26, left: 32 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    // Definitions: Gradients and Glow Filter
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'd3-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Area fill gradient
    const areaGradient = defs.append('linearGradient').attr('id', 'area-gradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', themeColors.fillStart);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', themeColors.fillEnd);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X and Y Scales
    const xScale = d3
      .scaleLinear()
      .domain([1, data.length])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // Gridlines
    const yGrid = d3.axisLeft(yScale).tickValues([25, 50, 75]).tickSize(-innerWidth).tickFormat(() => '');
    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(148, 163, 184, 0.08)')
      .attr('stroke-dasharray', '2,2');

    // Threshold zones (Turbulent > 60%, Laminar < 30%)
    if (showThresholds) {
      // Upper turbulent band
      g.append('rect')
        .attr('x', 0)
        .attr('y', yScale(100))
        .attr('width', innerWidth)
        .attr('height', yScale(60) - yScale(100))
        .attr('fill', 'rgba(244, 63, 94, 0.04)');

      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(60))
        .attr('y2', yScale(60))
        .attr('stroke', 'rgba(244, 63, 94, 0.35)')
        .attr('stroke-dasharray', '3,3');

      // Lower laminar band
      g.append('rect')
        .attr('x', 0)
        .attr('y', yScale(30))
        .attr('width', innerWidth)
        .attr('height', yScale(0) - yScale(30))
        .attr('fill', 'rgba(6, 182, 212, 0.04)');

      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(30))
        .attr('y2', yScale(30))
        .attr('stroke', 'rgba(6, 182, 212, 0.35)')
        .attr('stroke-dasharray', '3,3');
    }

    // Line and Area Generators
    const lineGen = d3
      .line<VolatilityDataPoint>()
      .x(d => xScale(d.index))
      .y(d => yScale(d.volatility))
      .curve(d3.curveMonotoneX);

    const areaGen = d3
      .area<VolatilityDataPoint>()
      .x(d => xScale(d.index))
      .y0(innerHeight)
      .y1(d => yScale(d.volatility))
      .curve(d3.curveMonotoneX);

    // Render Area
    g.append('path')
      .datum(data)
      .attr('d', areaGen)
      .attr('fill', 'url(#area-gradient)');

    // Render Line with Glow
    g.append('path')
      .datum(data)
      .attr('d', lineGen)
      .attr('fill', 'none')
      .attr('stroke', themeColors.stroke)
      .attr('stroke-width', 2.2)
      .attr('filter', 'url(#d3-glow)');

    // Bottom X-Axis
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.min(6, data.length))
      .tickFormat(n => `#${n}`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', 'rgba(148, 163, 184, 0.4)')
      .selectAll('text')
      .attr('font-size', '9px')
      .attr('font-family', 'Share Tech Mono, monospace')
      .attr('fill', '#94a3b8');

    // Left Y-Axis
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues([0, 30, 60, 100])
      .tickFormat(n => `${n}%`);

    g.append('g')
      .call(yAxis)
      .attr('color', 'rgba(148, 163, 184, 0.4)')
      .selectAll('text')
      .attr('font-size', '9px')
      .attr('font-family', 'Share Tech Mono, monospace')
      .attr('fill', '#94a3b8');

    // Data points dots on line
    g.selectAll('.data-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-dot')
      .attr('cx', d => xScale(d.index))
      .attr('cy', d => yScale(d.volatility))
      .attr('r', d => (d.index === data.length ? 4.5 : 2))
      .attr('fill', d => (d.index === data.length ? themeColors.dot : '#fff'))
      .attr('stroke', themeColors.stroke)
      .attr('stroke-width', d => (d.index === data.length ? 2 : 1));

    // Pointer hover overlay for interactive inspection
    const bisectIndex = d3.bisector<VolatilityDataPoint, number>(d => d.index).center;

    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    // Vertical hover line
    const hoverLine = g
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', 'rgba(255, 255, 255, 0.5)')
      .attr('stroke-dasharray', '2,2')
      .style('opacity', 0);

    const hoverDot = g
      .append('circle')
      .attr('r', 5.5)
      .attr('fill', themeColors.dot)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('opacity', 0);

    overlay
      .on('mousemove touchmove', function (event) {
        const [xPos] = d3.pointer(event);
        const xVal = xScale.invert(xPos);
        const idx = bisectIndex(data, xVal);
        const point = data[idx];

        if (point) {
          hoverLine
            .attr('x1', xScale(point.index))
            .attr('x2', xScale(point.index))
            .style('opacity', 1);

          hoverDot
            .attr('cx', xScale(point.index))
            .attr('cy', yScale(point.volatility))
            .style('opacity', 1);

          setHoveredPoint(point);
        }
      })
      .on('mouseleave touchend', function () {
        hoverLine.style('opacity', 0);
        hoverDot.style('opacity', 0);
        setHoveredPoint(null);
      });

  }, [data, themeColors, showThresholds]);

  return (
    <div className="titanium-glass rounded-xl p-3 sm:p-4 border border-violet-500/25 space-y-2.5">
      {/* Title Bar & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron text-xs font-bold text-white tracking-wider">
                VOLATILITY TREND MATRIX
              </span>
              <span className="px-1.5 py-0.2 rounded text-[8px] font-tech font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                D3.JS VECTOR
              </span>
            </div>
            <div className="font-tech text-[10px] text-slate-400">
              ROLLING SEQUENCE ENTROPY OVER LAST {recordCount} VERIFIED CYCLES
            </div>
          </div>
        </div>

        {/* Record Range Selector (20 / 30 / 50) */}
        <div className="flex items-center gap-1 font-tech text-xs">
          {[20, 30, 50].map(cnt => (
            <button
              key={cnt}
              onClick={() => {
                soundService.click();
                setRecordCount(cnt as 20 | 30 | 50);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-orbitron font-bold transition-all cursor-pointer ${
                recordCount === cnt
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cnt}R
            </button>
          ))}
          <button
            onClick={() => {
              soundService.click();
              setShowThresholds(!showThresholds);
            }}
            className={`p-1 rounded text-[10px] font-tech ml-1 cursor-pointer ${
              showThresholds ? 'text-cyan-400 bg-slate-900 border border-cyan-500/30' : 'text-slate-500'
            }`}
            title="Toggle Threshold Bands"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Realtime Live Gauge & Telemetry Strip */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 font-tech text-xs">
        <div>
          <span className="text-slate-500 text-[10px] block">CURRENT INDEX</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-orbitron font-black text-base text-cyan-400">
              {latestVol}%
            </span>
            {isRising ? (
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
        </div>

        <div>
          <span className="text-slate-500 text-[10px] block">REGIME PHASE</span>
          <span className="font-bold text-white text-[11px] truncate block mt-0.5">
            {data.length > 0 ? data[data.length - 1].phase : 'CALIBRATING'}
          </span>
        </div>

        <div>
          <span className="text-slate-500 text-[10px] block">SAMPLE WINDOW</span>
          <span className="font-bold text-violet-300 text-[11px] block mt-0.5">
            {data.length} NODES
          </span>
        </div>
      </div>

      {/* D3 SVG Chart Container */}
      <div ref={containerRef} className="w-full relative bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden">
        {data.length === 0 ? (
          <div className="h-44 flex items-center justify-center font-tech text-xs text-slate-500">
            AWAITING MINIMUM 3 VERIFIED ROUNDS FOR D3 MATRIX
          </div>
        ) : (
          <svg ref={svgRef} className="w-full h-auto block" />
        )}
      </div>

      {/* Dynamic Hover Inspection Tooltip */}
      {hoveredPoint && (
        <div className="p-2.5 rounded-lg bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-cyan-400/40 font-tech text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg">
          <div>
            <span className="text-slate-400">NODE #{hoveredPoint.index} · ISSUE: </span>
            <span className="font-bold text-white">{hoveredPoint.issue}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">VOLATILITY: </span>
            <span className="font-orbitron font-black text-cyan-300">{hoveredPoint.volatility}%</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-violet-300">
              {hoveredPoint.phase}
            </span>
            <span className="text-slate-400">RES: </span>
            <span className="font-bold text-white">{hoveredPoint.resultNum} ({hoveredPoint.resultType})</span>
          </div>
        </div>
      )}

      {/* Legend & Threshold Explanation */}
      <div className="flex flex-wrap items-center justify-between text-[10px] font-tech text-slate-400 pt-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-rose-500" />
            <span>TURBULENT (&gt;60%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-slate-400" />
            <span>HARMONIC (30-60%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 bg-cyan-400" />
            <span>LAMINAR (&lt;30%)</span>
          </span>
        </div>
        <span className="text-slate-500">HOVER / TOUCH FOR PRECISE TELEMETRY</span>
      </div>
    </div>
  );
};
