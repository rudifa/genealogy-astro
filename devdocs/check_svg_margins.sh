#!/bin/bash

# Helper script to measure SVG margins
# Usage: Open browser console and paste this function

cat <<EOF
// SVG Margin Calculator
function checkSvgMargins() {
  const container = document.getElementById('graph-container');
  const svg = document.querySelector('.graph-content svg');

  if (!container || !svg) {
    console.error('Container or SVG not found');
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();
  const svgBBox = svg.getBBox();

  const leftMargin = svgRect.left - containerRect.left;
  const rightMargin = containerRect.right - svgRect.right;
  const topMargin = svgRect.top - containerRect.top;
  const bottomMargin = containerRect.bottom - svgRect.bottom;

  console.log('Container dimensions:', {
    width: containerRect.width,
    height: containerRect.height
  });

  console.log('SVG rendered dimensions:', {
    width: svgRect.width,
    height: svgRect.height
  });

  console.log('SVG getBBox dimensions:', {
    x: svgBBox.x,
    y: svgBBox.y,
    width: svgBBox.width,
    height: svgBBox.height
  });

  console.log('SVG margins:', {
    left: leftMargin,
    right: rightMargin,
    diff: Math.abs(leftMargin - rightMargin),
    top: topMargin,
    bottom: bottomMargin
  });

  return {
    container: containerRect,
    svg: svgRect,
    bbox: svgBBox,
    margins: {
      left: leftMargin,
      right: rightMargin,
      top: topMargin,
      bottom: bottomMargin
    }
  };
}

// Check margins after fit-to-screen or reset
// Run this in console after clicking either button
checkSvgMargins();
EOF
