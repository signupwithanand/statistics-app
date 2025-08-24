import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Statistics } from '../../types/statistics';

interface ScatterPlotProps {
  data: number[];
  stats: Statistics;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, stats }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create data points with index as x-axis
    const scatterData = data.map((value, index) => ({ x: index + 1, y: value }));

    const xScale = d3.scaleLinear()
      .domain([0, data.length + 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data) as [number, number])
      .nice()
      .range([height, 0]);

    // Draw axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `#${d}`));

    g.append('g')
      .call(d3.axisLeft(yScale));

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Value');

    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Data Point Index');

    // Draw points
    g.selectAll('.point')
      .data(scatterData)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 0)
      .attr('fill', '#3B82F6')
      .attr('stroke', '#1E40AF')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .transition()
      .duration(300)
      .delay((d, i) => i * 50)
      .attr('r', 6);

    // Add mean line
    if (stats.mean !== null) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(stats.mean))
        .attr('y2', yScale(stats.mean))
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0)
        .transition()
        .delay(500)
        .duration(300)
        .attr('opacity', 0.8);

      g.append('text')
        .attr('x', width - 5)
        .attr('y', yScale(stats.mean) - 5)
        .attr('text-anchor', 'end')
        .attr('fill', '#EF4444')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`Mean: ${stats.mean.toFixed(2)}`)
        .attr('opacity', 0)
        .transition()
        .delay(800)
        .duration(300)
        .attr('opacity', 1);
    }

    // Add median line
    if (stats.median !== null) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(stats.median))
        .attr('y2', yScale(stats.median))
        .attr('stroke', '#10B981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0)
        .transition()
        .delay(500)
        .duration(300)
        .attr('opacity', 0.8);
    }

  }, [data, stats]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            📈
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Yet</h3>
          <p className="text-gray-600">Add some data points to see the scatter plot</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Scatter Plot</h3>
      <div className="flex justify-center">
        <svg
          ref={svgRef}
          width={500}
          height={300}
          className="border border-gray-200 rounded-lg bg-white"
        />
      </div>
      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }}></div>
          <span>Mean line</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-green-500" style={{ borderStyle: 'dashed' }}></div>
          <span>Median line</span>
        </div>
        <p>• Each point represents a data value in order of entry</p>
      </div>
    </div>
  );
};