#!/bin/bash

# Enhanced helper script to measure SVG margins
# Usage: Open browser console and paste this function

cat <<EOF
// Enhanced SVG Margin Calculator
function checkSvgMargins() {
  const container = document.getElementById('graph-container');
  const graphContent = document.querySelector('.graph-content');
  const svg = document.querySelector('.graph-content svg');

  if (!container || !svg) {
    console.error('Container or SVG not found');
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();
  const svgBBox = svg.getBBox();

  // Get current transform matrix
  let transform = '';
  if (graphContent) {
    transform = graphContent.style.transform;
  }

  const leftMargin = svgRect.left - containerRect.left;
  const rightMargin = containerRect.right - svgRect.right;
  const topMargin = svgRect.top - containerRect.top;
  const bottomMargin = containerRect.bottom - svgRect.bottom;

  const marginDiffX = Math.abs(leftMargin - rightMargin);
  const marginDiffY = Math.abs(topMargin - bottomMargin);

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

  console.log('Current transform:', transform);

  console.log('SVG margins:', {
    left: leftMargin.toFixed(1) + 'px',
    right: rightMargin.toFixed(1) + 'px',
    diffX: marginDiffX.toFixed(1) + 'px',
    top: topMargin.toFixed(1) + 'px',
    bottom: bottomMargin.toFixed(1) + 'px',
    diffY: marginDiffY.toFixed(1) + 'px'
  });

  // Check if margins are balanced
  const isBalancedX = marginDiffX < 10; // Allow 10px difference
  const isBalancedY = marginDiffY < 10;

  console.log('Centering status:', {
    balancedX: isBalancedX ? '✅ Good' : '❌ Needs adjustment',
    balancedY: isBalancedY ? '✅ Good' : '❌ Needs adjustment'
  });

  return {
    container: containerRect,
    svg: svgRect,
    bbox: svgBBox,
    transform,
    margins: {
      left: leftMargin,
      right: rightMargin,
      top: topMargin,
      bottom: bottomMargin,
      diffX: marginDiffX,
      diffY: marginDiffY
    },
    isCentered: {
      x: isBalancedX,
      y: isBalancedY
    }
  };
}

// Check margins after fit-to-screen or reset
// Run this in console after clicking either button
checkSvgMargins();
EOF
