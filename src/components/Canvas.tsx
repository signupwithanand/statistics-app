import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Statistics } from '../types/statistics';

interface CanvasProps {
  data: number[];
  stats: Statistics;
  activeStatistic: string;
  onAddCandy: (value?: number) => void;
  onRemoveCandy: (index: number) => void;
  onMoveCandy: (index: number, newValue: number) => void;
  theme: 'light' | 'dark';
}

const CANDY_EMOJIS = ['🍭', '🍬', '🧁', '🍪', '🍩', '🎂'];

export const Canvas: React.FC<CanvasProps> = ({
  data,
  stats,
  activeStatistic,
  onAddCandy,
  onRemoveCandy,
  onMoveCandy,
  theme
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggedCandy, setDraggedCandy] = useState<number | null>(null);

  // Pedagogy: Visual representation of each candy as an emoji with position
  const candies = data.map((value, index) => ({
    id: index,
    value,
    emoji: CANDY_EMOJIS[index % CANDY_EMOJIS.length],
    x: 0, // Will be calculated by D3
    y: 0
  }));

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear previous content
    svg.selectAll('*').remove();

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, Math.max(20, d3.max(data) || 20)])
      .range([60, width - 60]);

    const yScale = d3.scaleLinear()
      .domain([0, 10])
      .range([height - 100, 100]);

    // Draw number line
    const numberLine = svg.append('g').attr('class', 'number-line');
    
    numberLine.append('line')
      .attr('x1', 60)
      .attr('x2', width - 60)
      .attr('y1', height - 80)
      .attr('y2', height - 80)
      .attr('stroke', theme === 'dark' ? '#6B7280' : '#374151')
      .attr('stroke-width', 3);

    // Add tick marks
    const ticks = xScale.ticks(10);
    numberLine.selectAll('.tick')
      .data(ticks)
      .enter()
      .append('g')
      .attr('class', 'tick')
      .attr('transform', d => `translate(${xScale(d)}, ${height - 80})`)
      .each(function(d) {
        const tick = d3.select(this);
        tick.append('line')
          .attr('y1', -8)
          .attr('y2', 8)
          .attr('stroke', theme === 'dark' ? '#6B7280' : '#374151')
          .attr('stroke-width', 2);
        
        tick.append('text')
          .attr('y', 25)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('fill', theme === 'dark' ? '#D1D5DB' : '#374151')
          .text(d);
      });

    // Group candies by value for stacking
    const groupedCandies = d3.group(candies, d => d.value);
    
    // Position candies
    groupedCandies.forEach((group, value) => {
      group.forEach((candy, stackIndex) => {
        candy.x = xScale(value);
        candy.y = height - 80 - 30 - (stackIndex * 35);
      });
    });

    // Draw candies
    const candyGroups = svg.selectAll('.candy')
      .data(candies)
      .enter()
      .append('g')
      .attr('class', 'candy')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer');

    candyGroups.append('circle')
      .attr('r', 15)
      .attr('fill', '#F3F4F6')
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', 2);

    candyGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '20px')
      .text(d => d.emoji);

    // Add click handlers
    candyGroups.on('click', (event, d) => {
      event.stopPropagation();
      onRemoveCandy(d.id);
    });

    // Pedagogy: Visual indicators for each statistic
    if (activeStatistic === 'mean' && stats.mean !== null) {
      // Mean: Balance plank animation
      const meanX = xScale(stats.mean);
      
      // Plank/seesaw
      svg.append('line')
        .attr('x1', meanX - 40)
        .attr('x2', meanX + 40)
        .attr('y1', height - 40)
        .attr('y2', height - 40)
        .attr('stroke', '#3B82F6')
        .attr('stroke-width', 4)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);

      // Fulcrum
      svg.append('polygon')
        .attr('points', `${meanX},${height - 40} ${meanX - 8},${height - 25} ${meanX + 8},${height - 25}`)
        .attr('fill', '#1E40AF')
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);

      // Mean label
      svg.append('text')
        .attr('x', meanX)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#3B82F6')
        .text(`Mean: ${stats.mean.toFixed(1)}`)
        .style('opacity', 0)
        .transition()
        .delay(300)
        .duration(300)
        .style('opacity', 1);
    }

    if (activeStatistic === 'median' && stats.median !== null) {
      // Median: Spotlight on middle value
      const medianX = xScale(stats.median);
      
      // Spotlight circle
      svg.append('circle')
        .attr('cx', medianX)
        .attr('cy', height - 80)
        .attr('r', 25)
        .attr('fill', 'none')
        .attr('stroke', '#10B981')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '5,5')
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);

      svg.append('text')
        .attr('x', medianX)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#10B981')
        .text(`Median: ${stats.median}`)
        .style('opacity', 0)
        .transition()
        .delay(300)
        .duration(300)
        .style('opacity', 1);
    }

    if (activeStatistic === 'mode' && stats.mode.length > 0) {
      // Mode: Pulse the tallest stacks
      stats.mode.forEach(modeValue => {
        const modeX = xScale(modeValue);
        
        svg.append('circle')
          .attr('cx', modeX)
          .attr('cy', height - 80)
          .attr('r', 30)
          .attr('fill', 'none')
          .attr('stroke', '#8B5CF6')
          .attr('stroke-width', 3)
          .style('opacity', 0.7)
          .transition()
          .duration(1000)
          .ease(d3.easeSinInOut)
          .attr('r', 35)
          .style('opacity', 0)
          .on('end', function() {
            d3.select(this).remove();
          });
      });
    }

    if (activeStatistic === 'range' && stats.range !== null) {
      // Range: Rope between min and max
      const minX = xScale(stats.min!);
      const maxX = xScale(stats.max!);
      
      svg.append('line')
        .attr('x1', minX)
        .attr('x2', maxX)
        .attr('y1', height - 120)
        .attr('y2', height - 120)
        .attr('stroke', '#F59E0B')
        .attr('stroke-width', 4)
        .attr('stroke-dasharray', '8,4')
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);

      svg.append('text')
        .attr('x', (minX + maxX) / 2)
        .attr('y', height - 130)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#F59E0B')
        .text(`Range: ${stats.range}`)
        .style('opacity', 0)
        .transition()
        .delay(300)
        .duration(300)
        .style('opacity', 1);
    }

    if (activeStatistic === 'sd' && stats.standardDeviation !== null && stats.mean !== null) {
      // Standard Deviation: Bell curve band
      const meanX = xScale(stats.mean);
      const sdWidth = Math.abs(xScale(stats.standardDeviation) - xScale(0));
      
      svg.append('ellipse')
        .attr('cx', meanX)
        .attr('cy', height - 80)
        .attr('rx', sdWidth)
        .attr('ry', 20)
        .attr('fill', '#EC4899')
        .attr('fill-opacity', 0.2)
        .attr('stroke', '#EC4899')
        .attr('stroke-width', 2)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);
    }

    // Click to add candy anywhere on canvas
    svg.on('click', (event) => {
      const [mouseX] = d3.pointer(event);
      const value = Math.round(xScale.invert(mouseX));
      if (value >= 0 && value <= 20) {
        onAddCandy(value);
      }
    });

  }, [data, stats, activeStatistic, theme, onAddCandy, onRemoveCandy]);

  return (
    <div className="h-full relative bg-white dark:bg-gray-900 overflow-hidden">
      {/* Pedagogy: Always-visible animated legend */}
      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <span>⚖️</span>
            <span className="text-blue-600">Balance point</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🎯</span>
            <span className="text-green-600">Middle value</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>👑</span>
            <span className="text-purple-600">Most common</span>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-crosshair"
        style={{ minHeight: '400px' }}
      />

      {/* Empty state */}
      {data.length === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <motion.div
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🍭
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Start Playing!
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Click anywhere or use the buttons to add candies
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};