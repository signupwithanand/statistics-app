import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Statistics } from '../../types/statistics';

interface NumberLineProps {
  data: number[];
  onAddData: (value: number) => void;
  onRemoveData: (index: number) => void;
  stats: Statistics;
}

export const NumberLine: React.FC<NumberLineProps> = ({
  data,
  onAddData,
  onRemoveData,
  stats
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggedPoint, setDraggedPoint] = useState<number | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 20, bottom: 40, left: 20 };
    const width = 600 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Determine scale domain
    const domain = data.length > 0 
      ? [Math.min(...data) - 10, Math.max(...data) + 10]
      : [-50, 50];

    const xScale = d3.scaleLinear()
      .domain(domain)
      .range([0, width]);

    // Draw number line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', height / 2)
      .attr('y2', height / 2)
      .attr('stroke', '#374151')
      .attr('stroke-width', 2);

    // Add tick marks
    const ticks = xScale.ticks(10);
    g.selectAll('.tick')
      .data(ticks)
      .enter()
      .append('g')
      .attr('class', 'tick')
      .attr('transform', d => `translate(${xScale(d)}, ${height / 2})`)
      .each(function(d) {
        const tick = d3.select(this);
        tick.append('line')
          .attr('y1', -5)
          .attr('y2', 5)
          .attr('stroke', '#6B7280')
          .attr('stroke-width', 1);
        
        tick.append('text')
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', '#6B7280')
          .text(d);
      });

    // Add clickable area for adding points
    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair')
      .on('click', function(event) {
        const [mouseX] = d3.pointer(event);
        const value = Math.round(xScale.invert(mouseX));
        onAddData(value);
      });

    // Group data by value for stacking
    const dataGroups = data.reduce((acc, value, index) => {
      if (!acc[value]) acc[value] = [];
      acc[value].push({ value, index });
      return acc;
    }, {} as Record<number, Array<{ value: number; index: number }>>);

    // Draw data points
    Object.entries(dataGroups).forEach(([value, points]) => {
      const numValue = parseFloat(value);
      const x = xScale(numValue);
      
      points.forEach((point, stackIndex) => {
        const y = height / 2 - 10 - (stackIndex * 12);
        
        const circle = g.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 5)
          .attr('fill', '#3B82F6')
          .attr('stroke', '#1E40AF')
          .attr('stroke-width', 2)
          .attr('cursor', 'pointer')
          .attr('opacity', 0)
          .transition()
          .duration(300)
          .attr('opacity', 1);

        // Add hover effects
        circle.selection()
          .on('mouseenter', function() {
            d3.select(this)
              .transition()
              .duration(150)
              .attr('r', 7)
              .attr('fill', '#1E40AF');
          })
          .on('mouseleave', function() {
            if (draggedPoint !== point.index) {
              d3.select(this)
                .transition()
                .duration(150)
                .attr('r', 5)
                .attr('fill', '#3B82F6');
            }
          })
          .on('click', function(event) {
            event.stopPropagation();
            onRemoveData(point.index);
          });
      });
    });

    // Add mean indicator
    if (stats.mean !== null && data.length > 0) {
      const meanX = xScale(stats.mean);
      
      g.append('line')
        .attr('x1', meanX)
        .attr('x2', meanX)
        .attr('y1', -10)
        .attr('y2', height + 10)
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,2')
        .attr('opacity', 0)
        .transition()
        .delay(300)
        .duration(300)
        .attr('opacity', 0.7);

      g.append('text')
        .attr('x', meanX)
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', '#EF4444')
        .text(`Mean: ${stats.mean.toFixed(1)}`)
        .attr('opacity', 0)
        .transition()
        .delay(600)
        .duration(300)
        .attr('opacity', 1);
    }

    // Add median indicator
    if (stats.median !== null && data.length > 0) {
      const medianX = xScale(stats.median);
      
      g.append('line')
        .attr('x1', medianX)
        .attr('x2', medianX)
        .attr('y1', -10)
        .attr('y2', height + 10)
        .attr('stroke', '#10B981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '2,2')
        .attr('opacity', 0)
        .transition()
        .delay(300)
        .duration(300)
        .attr('opacity', 0.7);
    }

  }, [data, stats, onAddData, onRemoveData, draggedPoint]);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <svg
        ref={svgRef}
        width={600}
        height={100}
        className="w-full"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <p className="text-xs text-gray-600 mt-2 text-center">
        Click anywhere on the line to add data points • Click existing points to remove them
      </p>
    </div>
  );
};