import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Statistics } from '../../types/statistics';

interface BoxPlotProps {
  data: number[];
  stats: Statistics;
}

export const BoxPlot: React.FC<BoxPlotProps> = ({ data, stats }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedData = [...data].sort((a, b) => a - b);
    const q1 = d3.quantile(sortedData, 0.25) || 0;
    const median = d3.quantile(sortedData, 0.5) || 0;
    const q3 = d3.quantile(sortedData, 0.75) || 0;
    const iqr = q3 - q1;
    const min = Math.max(sortedData[0], q1 - 1.5 * iqr);
    const max = Math.min(sortedData[sortedData.length - 1], q3 + 1.5 * iqr);

    const outliers = sortedData.filter(d => d < min || d > max);

    const yScale = d3.scaleLinear()
      .domain([stats.min! - (stats.range! * 0.1), stats.max! + (stats.range! * 0.1)])
      .range([height, 0]);

    const boxWidth = 100;
    const boxX = width / 2 - boxWidth / 2;

    // Draw whiskers
    g.append('line')
      .attr('x1', width / 2)
      .attr('x2', width / 2)
      .attr('y1', yScale(min))
      .attr('y2', yScale(q1))
      .attr('stroke', '#374151')
      .attr('stroke-width', 2);

    g.append('line')
      .attr('x1', width / 2)
      .attr('x2', width / 2)
      .attr('y1', yScale(q3))
      .attr('y2', yScale(max))
      .attr('stroke', '#374151')
      .attr('stroke-width', 2);

    // Draw whisker caps
    [min, max].forEach(value => {
      g.append('line')
        .attr('x1', boxX + 20)
        .attr('x2', boxX + boxWidth - 20)
        .attr('y1', yScale(value))
        .attr('y2', yScale(value))
        .attr('stroke', '#374151')
        .attr('stroke-width', 2);
    });

    // Draw box
    g.append('rect')
      .attr('x', boxX)
      .attr('y', yScale(q3))
      .attr('width', boxWidth)
      .attr('height', yScale(q1) - yScale(q3))
      .attr('fill', '#DBEAFE')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2)
      .attr('opacity', 0)
      .transition()
      .duration(300)
      .attr('opacity', 1);

    // Draw median line
    g.append('line')
      .attr('x1', boxX)
      .attr('x2', boxX + boxWidth)
      .attr('y1', yScale(median))
      .attr('y2', yScale(median))
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 3)
      .attr('opacity', 0)
      .transition()
      .delay(300)
      .duration(300)
      .attr('opacity', 1);

    // Draw outliers
    g.selectAll('.outlier')
      .data(outliers)
      .enter()
      .append('circle')
      .attr('class', 'outlier')
      .attr('cx', width / 2)
      .attr('cy', d => yScale(d))
      .attr('r', 4)
      .attr('fill', '#F59E0B')
      .attr('stroke', '#D97706')
      .attr('stroke-width', 2)
      .attr('opacity', 0)
      .transition()
      .delay(600)
      .duration(300)
      .attr('opacity', 1);

    // Add axis
    g.append('g')
      .attr('transform', `translate(${width / 2 + boxWidth / 2 + 20}, 0)`)
      .call(d3.axisRight(yScale).ticks(8));

    // Add labels
    const labels = [
      { value: min, label: 'Min', color: '#6B7280' },
      { value: q1, label: 'Q1', color: '#3B82F6' },
      { value: median, label: 'Median', color: '#EF4444' },
      { value: q3, label: 'Q3', color: '#3B82F6' },
      { value: max, label: 'Max', color: '#6B7280' }
    ];

    labels.forEach((item, i) => {
      g.append('text')
        .attr('x', boxX - 10)
        .attr('y', yScale(item.value))
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('fill', item.color)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(`${item.label}: ${item.value.toFixed(2)}`)
        .attr('opacity', 0)
        .transition()
        .delay(300 + i * 100)
        .duration(300)
        .attr('opacity', 1);
    });

  }, [data, stats]);

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            📦
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Yet</h3>
          <p className="text-gray-600">Add some data points to see the box plot</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Box and Whisker Plot</h3>
      <div className="flex justify-center">
        <svg
          ref={svgRef}
          width={500}
          height={300}
          className="border border-gray-200 rounded-lg bg-white"
        />
      </div>
      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <p>• Box shows the interquartile range (Q1 to Q3)</p>
        <p>• Red line indicates the median</p>
        <p>• Whiskers extend to min/max within 1.5×IQR</p>
        <p>• Orange dots represent outliers</p>
      </div>
    </div>
  );
};