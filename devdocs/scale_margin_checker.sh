#!/bin/bash

# Scale and Margin Checker for SVG
# Usage: Open browser console and paste this function

cat <<EOF
// Enhanced SVG Scale and Margin Checker
function checkSvgScaleAndMargins() {
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

  // Extract scale from transform matrix
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  if (graphContent) {
    const transform = graphContent.style.transform;
    if (transform) {
      const scaleMatch = transform.match(/scale\\(([^)]+)\\)/);
      if (scaleMatch && scaleMatch[1]) {
        scale = parseFloat(scaleMatch[1]);
      }

      const translateMatch = transform.match(/translate\\(([^,]+),\\s*([^)]+)\\)/);
      if (translateMatch && translateMatch[1] && translateMatch[2]) {
        translateX = parseFloat(translateMatch[1]);
        translateY = parseFloat(translateMatch[2]);
      }
    }
  }

  // Calculate margins
  const leftMargin = svgRect.left - containerRect.left;
  const rightMargin = containerRect.right - svgRect.right;
  const topMargin = svgRect.top - containerRect.top;
  const bottomMargin = containerRect.bottom - svgRect.bottom;

  const marginDiffX = Math.abs(leftMargin - rightMargin);
  const marginDiffY = Math.abs(topMargin - bottomMargin);

  // Calculate visible content area
  const visibleWidth = svgRect.width;
  const visibleHeight = svgRect.height;
  const contentToContainerRatioX = visibleWidth / containerRect.width;
  const contentToContainerRatioY = visibleHeight / containerRect.height;

  // Evaluate scale
  const idealMaxScale = 0.85; // 85% of container is ideal max
  const isScaleGood = scale <= idealMaxScale;

  console.log('Container dimensions:', {
    width: containerRect.width.toFixed(0) + 'px',
    height: containerRect.height.toFixed(0) + 'px'
  });

  console.log('SVG rendered dimensions:', {
    width: visibleWidth.toFixed(0) + 'px',
    height: visibleHeight.toFixed(0) + 'px',
    widthRatio: contentToContainerRatioX.toFixed(2),
    heightRatio: contentToContainerRatioY.toFixed(2)
  });

  console.log('SVG getBBox dimensions:', {
    x: svgBBox.x.toFixed(0) + 'px',
    y: svgBBox.y.toFixed(0) + 'px',
    width: svgBBox.width.toFixed(0) + 'px',
    height: svgBBox.height.toFixed(0) + 'px'
  });

  console.log('Transform:', {
    scale: scale.toFixed(3),
    translateX: translateX.toFixed(1) + 'px',
    translateY: translateY.toFixed(1) + 'px',
  });

  console.log('SVG margins:', {
    left: leftMargin.toFixed(1) + 'px',
    right: rightMargin.toFixed(1) + 'px',
    diffX: marginDiffX.toFixed(1) + 'px',
    top: topMargin.toFixed(1) + 'px',
    bottom: bottomMargin.toFixed(1) + 'px',
    diffY: marginDiffY.toFixed(1) + 'px'
  });

  // Check if margins are balanced
  const isBalancedX = marginDiffX < Math.max(10, containerRect.width * 0.05); // Allow either 10px or 5% difference
  const isBalancedY = marginDiffY < Math.max(10, containerRect.height * 0.05);

  console.log('Status assessment:', {
    scale: isScaleGood ? '✅ Good' : '❌ Too large',
    horizontalMargins: isBalancedX ? '✅ Balanced' : '❌ Unbalanced',
    verticalMargins: isBalancedY ? '✅ Balanced' : '❌ Unbalanced',
    idealScale: '<= ' + idealMaxScale.toFixed(2),
    recommendedAdjustments: getRecommendations(scale, isBalancedX, isBalancedY, marginDiffX, marginDiffY)
  });

  return {
    container: containerRect,
    svg: svgRect,
    bbox: svgBBox,
    transform: {
      scale,
      translateX,
      translateY
    },
    margins: {
      left: leftMargin,
      right: rightMargin,
      top: topMargin,
      bottom: bottomMargin,
      diffX: marginDiffX,
      diffY: marginDiffY
    },
    assessment: {
      scaleGood: isScaleGood,
      balancedX: isBalancedX,
      balancedY: isBalancedY
    }
  };

  function getRecommendations(scale, isBalancedX, isBalancedY, diffX, diffY) {
    const recommendations = [];

    if (scale > idealMaxScale) {
      recommendations.push('Reduce MAX_SCALE constant (currently ' + scale.toFixed(2) + ', aim for <= ' + idealMaxScale.toFixed(2) + ')');
    }

    if (!isBalancedX) {
      if (leftMargin > rightMargin) {
        recommendations.push('Reduce xCorrectionFactor');
      } else {
        recommendations.push('Increase xCorrectionFactor');
      }
    }

    if (!isBalancedY) {
      recommendations.push('Adjust vertical centering logic');
    }

    return recommendations.length ? recommendations : ['No adjustments needed'];
  }
}

// Run the check
checkSvgScaleAndMargins();
EOF
