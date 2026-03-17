import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FiPenTool, FiEdit, FiTrash2 } from 'react-icons/fi';
import { MdClear } from 'react-icons/md';
import './DrawingCanvas.css';

const DrawingCanvas = ({ canvasWidth = 800, canvasHeight = 600, isVisible = true }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState('pencil'); // pencil, eraser, line
  const [drawColor, setDrawColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
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
  }, [drawingMode, canvasWidth, canvasHeight, drawingData]);

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

      setStartPos({ x, y });
      setIsDrawing(true);

      if (drawingMode === 'line') {
        // Don't start drawing yet, wait for mouse up
        return;
      }

      const context = contextRef.current;
      context.strokeStyle = drawingMode === 'eraser' ? 'rgba(0,0,0,0)' : drawColor;
      context.lineWidth = brushSize;
      context.beginPath();
      context.moveTo(x, y);
    },
    [drawingMode, drawColor, brushSize, isVisible]
  );

  const draw = (e) => {
    if (!isDrawing || !isVisible) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingMode === 'line') {
      // Preview line - don't draw yet
      return;
    }

    const context = contextRef.current;
    if (drawingMode === 'eraser') {
      context.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (drawingMode === 'line') {
      // Draw line from start to current position
      const rect = canvas.getBoundingClientRect();
      const endX = startPos.x; // Use the stored startPos
      const endY = startPos.y;

      context.strokeStyle = drawColor;
      context.lineWidth = brushSize;
      context.beginPath();
      context.moveTo(startPos.x, startPos.y);
      context.lineTo(endX, endY);
      context.stroke();
    }

    context.closePath();
    setIsDrawing(false);

    // Save drawing to data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setDrawingData({
      imageData,
      strokes: [] // We'd need to track strokes separately for full functionality
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    setDrawingData(null);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
