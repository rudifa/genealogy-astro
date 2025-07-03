# Zoom and Pan Feature Documentation

## Overview

The Zoom and Pan feature in the Genealogy Graph application provides interactive viewing capabilities for genealogy trees of various sizes. It includes a comprehensive set of controls for zooming in/out, fitting to screen, resetting to 1:1 scale, and intuitive mouse/touch panning.

## Key Features

1. **Interactive Controls**:
   - Zoom In/Out buttons (+/-)
   - Fit to Screen button (⌶)
   - Reset to 1:1 button (⌂)
   - Mouse wheel zoom
   - Click and drag panning
   - Touch pinch-to-zoom and swipe-to-pan for mobile

2. **Adaptive Sizing**:
   - Automatically fits the graph to the available screen space
   - Maintains proper centering regardless of graph size
   - Responds to window resize events

3. **Coordinate System**:
   - Uses SVG's internal coordinate system for accurate positioning
   - Properly accounts for SVG content offset from origin

## Technical Implementation

### SVG Rendering

The SVG graph is rendered within a container div with the following considerations:

1. **Size Conversion**:
   - Converts SVG's pt-based dimensions to CSS pixels (1pt = 4/3px)
   - Removes width/height attributes to prevent conflicts
   - Sets explicit pixel dimensions via CSS

2. **ViewBox Management**:
   - Ensures viewBox is properly set to encompass all content
   - Uses getBBox() for accurate content boundary detection

### Centering Logic

The centering mechanism has been optimized to correctly position the SVG content:

```javascript
// Get the SVG's content bounding box
const contentBounds = svgElement.getBBox();

// Calculate container center
const containerCenterX = containerRect.width / 2;
const containerCenterY = containerRect.height / 2;

// Calculate content center in SVG coordinate system
const contentCenterX = contentBounds.x + contentBounds.width / 2;
const contentCenterY = contentBounds.y + contentBounds.height / 2;

// Position the SVG so content center aligns with container center
currentTranslateX = containerCenterX - contentCenterX * currentScale;
currentTranslateY = containerCenterY - contentCenterY * currentScale;
```

This approach ensures:

- The center of the actual content (not just the SVG viewBox) aligns with the center of the container
- Content offset from SVG origin (getBBox x/y) is properly compensated for
- Visual centering remains consistent at different scales

### Zoom Mechanics

1. **Fit to Screen**:
   - Calculates available container space with padding
   - Determines scale factor based on content dimensions
   - Limits maximum scale to 1:1 (100%)
   - Centers the scaled content in the container

2. **Reset to 1:1**:
   - Sets scale to exactly 1.0
   - Centers the content at 1:1 scale

3. **Zoom to Point**:
   - Maintains the point under cursor during zoom
   - Applies proper translation to keep focal point stable

## Debugging Features

Extensive console logging provides insight into:

- SVG dimensions (logical vs. rendered)
- Content bounds and offsets
- Scale calculations
- Translation values
- Margin calculations

## Edge Cases Handled

1. **Container Not Visible**:
   - Retries fitting when container dimensions are zero

2. **SVG Not Ready**:
   - Gracefully handles cases where SVG content isn't fully loaded

3. **Tree Switching**:
   - Resets zoom/pan state when switching between trees
   - Re-fits the new tree to the container

## Known Limitations

- SVGs with extremely large coordinate systems may have precision issues
- Zoom limits are set to MIN_SCALE (0.1) and MAX_SCALE (5.0)

## Troubleshooting

If the graph appears incorrectly positioned:

1. Check the console logs for reported dimensions and offsets
2. Verify that the SVG has proper viewBox and dimensions
3. Try the "Reset to 1:1" button followed by "Fit to Screen"
