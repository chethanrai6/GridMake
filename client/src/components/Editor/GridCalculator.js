import React, { useState } from 'react';
import { FiX, FiZap } from 'react-icons/fi';
import './GridCalculator.css';

const GridCalculator = ({ isOpen, onClose, onApply }) => {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [cellSize, setCellSize] = useState(100);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [suggestion, setSuggestion] = useState(null);

  const aspectRatios = {
    '16:9': 1.778,
    '4:3': 1.333,
    '1:1': 1,
    '3:2': 1.5,
    'A4': 1.414,
    'Custom': null,
  };

  const handleAspectRatioChange = (ratio) => {
    setAspectRatio(ratio);
    if (ratio === 'Custom') return;

    const w = width;
    const h = Math.round(w / aspectRatios[ratio]);
    setHeight(h);
  };

  const calculateOptimalGrid = () => {
    const rows = Math.ceil(height / cellSize);
    const cols = Math.ceil(width / cellSize);

    // Suggest optimal grid sizes
    const suggestions = [];
    for (let i = 2; i <= 20; i++) {
      for (let j = 2; j <= 20; j++) {
        const gridRows = i;
        const gridCols = j;
        const gridCellWidth = Math.round(width / gridCols);
        const gridCellHeight = Math.round(height / gridRows);

        if (gridCellWidth >= 30 && gridCellHeight >= 30 && gridCellWidth <= 200) {
          suggestions.push({
            rows: gridRows,
            cols: gridCols,
            cellWidth: gridCellWidth,
            cellHeight: gridCellHeight,
          });
        }
      }
    }

    const best = suggestions[0] || { rows, cols, cellWidth: cellSize, cellHeight: cellSize };
    setSuggestion(best);

    return best;
  };

  const handleApply = () => {
    const optimal = calculateOptimalGrid();
    onApply({
      rows: optimal.rows,
      cols: optimal.cols,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="grid-calculator-overlay" onClick={onClose}>
      <div className="grid-calculator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="calc-header">
          <h3 className="calc-title">Grid Calculator</h3>
          <button className="calc-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="calc-content">
          {/* Canvas Size */}
          <div className="calc-section">
            <h4 className="calc-label">Canvas Size</h4>
            <div className="calc-row">
              <div className="calc-input-group">
                <label>Width (px)</label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="calc-input"
                />
              </div>
              <div className="calc-input-group">
                <label>Height (px)</label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="calc-input"
                />
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="calc-aspect-ratios">
              {Object.keys(aspectRatios).map((ratio) => (
                <button
                  key={ratio}
                  className={`aspect-btn ${aspectRatio === ratio ? 'active' : ''}`}
                  onClick={() => handleAspectRatioChange(ratio)}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Cell Size */}
          <div className="calc-section">
            <h4 className="calc-label">
              Cell Size: <span className="value">{cellSize}px</span>
            </h4>
            <input
              type="range"
              min="20"
              max="300"
              step="10"
              value={cellSize}
              onChange={(e) => setCellSize(Number(e.target.value))}
              className="calc-slider"
            />
            <div className="calculator-hint">
              At {cellSize}px: ~{Math.ceil(height / cellSize)} rows × {Math.ceil(width / cellSize)} cols
            </div>
          </div>

          {/* Suggestion */}
          {suggestion && (
            <div className="calc-section calc-suggestion">
              <div className="suggestion-header">
                <FiZap className="suggestion-icon" />
                <h4>Recommended Grid</h4>
              </div>
              <div className="suggestion-grid">
                <div className="suggestion-item">
                  <span className="suggestion-label">Rows</span>
                  <span className="suggestion-value">{suggestion.rows}</span>
                </div>
                <div className="suggestion-item">
                  <span className="suggestion-label">Columns</span>
                  <span className="suggestion-value">{suggestion.cols}</span>
                </div>
                <div className="suggestion-item">
                  <span className="suggestion-label">Cell W</span>
                  <span className="suggestion-value">{suggestion.cellWidth}px</span>
                </div>
                <div className="suggestion-item">
                  <span className="suggestion-label">Cell H</span>
                  <span className="suggestion-value">{suggestion.cellHeight}px</span>
                </div>
              </div>
              <p className="suggestion-desc">
                This grid provides balanced proportions for your canvas size
              </p>
            </div>
          )}
        </div>

        <div className="calc-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleApply}>
            <FiZap /> Apply Grid
          </button>
        </div>
      </div>
    </div>
  );
};

export default GridCalculator;
