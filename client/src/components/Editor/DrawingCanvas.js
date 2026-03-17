import React, { useRef, useEffect, useState, useCallback } from 'react';
import './DrawingCanvas.css';

const DrawingCanvas = ({ canvasWidth = 800, canvasHeight = 600, isVisible = true }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    canvas.style.cursor = 'crosshair';

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    // Store original drawing data for redraw
    if (drawingData) {
      redrawCanvas(context, canvas.width, canvas.height, drawingData);
    }
  }, [canvasWidth, canvasHeight, drawingData]);

  const redrawCanvas = (ctx, width, height, data) => {
    ctx.clearRect(0, 0, width, height);
    if (!data || !data.strokes) return;

    data.strokes.forEach((stroke) => {
      if (stroke.type === 'pencil' || stroke.type === 'line') {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      } else if (stroke.type === 'eraser') {
        ctx.clearRect(
          stroke.points[0].x - stroke.size / 2,
          stroke.points[0].y - stroke.size / 2,
          stroke.size,
          stroke.size
        );
      }
    });
  };

  const startDrawing = useCallback(
    (e) => {
      if (!isVisible) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setIsDrawing(true);

      const context = contextRef.current;
      context.beginPath();
      context.moveTo(x, y);
    },
    [isVisible]
  );

  const draw = (e) => {
    if (!isDrawing || !isVisible) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const context = contextRef.current;
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;

    context.closePath();
    setIsDrawing(false);

    // Save drawing to data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setDrawingData({
      imageData,
      strokes: []
    });
  };

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};

DrawingCanvas.defaultProps = {
  canvasWidth: 800,
  canvasHeight: 600,
  isVisible: false
};

export default DrawingCanvas;
