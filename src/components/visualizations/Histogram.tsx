import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Statistics } from '../../types/statistics';

interface HistogramProps {
  data: number[];
  stats: Statistics;
}

export const Histogram: React.FC<HistogramProps> = ({ data, stats }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data) as [number, number])
      .nice()
      .range([0, width]);

    // Create histogram bins
    const histogram = d3.histogram()
      .value(d => d)
      .domain(xScale.domain() as [number, number])
      .thresholds(Math.min(10, Math.ceil(Math.sqrt(data.length))));

    const bins = histogram(data);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) || 0])
      .nice()
      .range([height, 0]);

    // Draw bars
    g.selectAll('.bar')
      .data(bins)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.x0!))
      .attr('width', d => Math.max(0, xScale(d.x1!) - xScale(d.x0!)))
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', '#3B82F6')
      .attr('stroke', '#1E40AF')
      .attr('stroke-width', 1)
      .attr('opacity', 0.7)
      .transition()
      .duration(300)
      .attr('y', d => yScale(d.length))
      .attr('height', d => height - yScale(d.length));

    // Add mean line
    if (stats.mean !== null) {
      g.append('line')
        .attr('x1', xScale(stats.mean))
        .attr('x2', xScale(stats.mean))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0)
        .transition()
        .delay(300)
        .duration(300)
        .attr('opacity', 1);

      g.append('text')
        .attr('x', xScale(stats.mean))
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#EF4444')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`Mean: ${stats.mean.toFixed(2)}`)
        .attr('opacity', 0)
        .transition()
        .delay(600)
        .duration(300)
        .attr('opacity', 1);
    }

    // Add median line
    if (stats.median !== null) {
      g.append('line')
        .attr('x1', xScale(stats.median))
        .attr('x2', xScale(stats.median))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#10B981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '3,3')
        .attr('opacity', 0)
        .transition()
        .delay(300)
        .duration(300)
        .attr('opacity', 1);
    }

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale));

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Frequency');

    g.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom})`)
      .style('text-anchor', 'middle')
      .text('Value');

  }, [data, stats]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            📊
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Yet</h3>
          <p className="text-gray-600">Add some data points to see the histogram</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Histogram Distribution</h3>
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
          <span>Mean</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-green-500" style={{ borderStyle: 'dashed' }}></div>
          <span>Median</span>
        </div>
      </div>
    </div>
  );
};