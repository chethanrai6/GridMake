import React, { useCallback, useEffect, useImperativeHandle, useRef, forwardRef } from 'react';

const GridCanvas = forwardRef(({ image, gridSettings }, ref) => {
  const canvasRef = useRef(null);

  // Expose export function to parent component
  useImperativeHandle(ref, () => ({
    exportCanvas: (filename = 'drawing-grid.png') => {
      if (!canvasRef.current) {
        throw new Error('Canvas not available');
      }
      
      const canvas = canvasRef.current;
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas is empty');
      }

      const dataURL = canvas.toDataURL('image/png', 1.0);
      if (dataURL === 'data:,') {
        throw new Error('Failed to generate image data');
      }

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    }
  }));

  const drawGrid = useCallback((ctx, width, height, settings) => {
    // Get all current grid settings (matching your vanilla JS names)
    const numCols = settings.cols;
    const numRows = settings.rows;
    const lineThickness = settings.lineThickness;
    const lineColor = settings.lineColor;
    const showDiagonals = settings.diagonals;

    const cellWidth = width / numCols;
    const cellHeight = height / numRows;

    // Set line styles
    ctx.lineWidth = lineThickness;
    ctx.strokeStyle = lineColor;

    ctx.beginPath(); // Start drawing path

    // Draw vertical lines
    for (let i = 1; i < numCols; i++) {
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, height);
    }

    // Draw horizontal lines
    for (let i = 1; i < numRows; i++) {
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(width, i * cellHeight);
    }

    // Draw diagonal lines if checked
    if (showDiagonals) {
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          ctx.moveTo(col * cellWidth, row * cellHeight);
          ctx.lineTo((col + 1) * cellWidth, (row + 1) * cellHeight);
        }
      }
    }

    ctx.stroke(); // Render all the lines at once
  }, []);

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // If we have an image, set canvas size to match the image size
    if (image) {
      canvas.width = image.width;
      canvas.height = image.height;
    } else {
      // Default canvas size if no image
      canvas.width = 800;
      canvas.height = 600;
    }

    // Clear the entire canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the uploaded image if it exists
    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    // Check if the grid should be visible
    if (!gridSettings.gridVisible) {
      return; // Stop here if the grid is hidden
    }

    // Draw grid
    drawGrid(ctx, canvas.width, canvas.height, gridSettings);
  }, [drawGrid, image, gridSettings]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  return (
    <canvas
      ref={canvasRef}
      id="drawingCanvas"
      className="grid-canvas"
    />
  );
});

export default GridCanvas;