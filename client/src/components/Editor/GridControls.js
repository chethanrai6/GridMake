import React from 'react';
import { FiDownload, FiRefreshCcw, FiSave, FiSettings, FiSliders, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const GridControls = ({ settings, onChange, onReset, onSave, onExport, loading, onUndo, onRedo, canUndo, canRedo }) => {
  const handleChange = (key, value) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <>
      <div className="control-group">
        <h3 className="section-title">
          <FiSliders className="section-title-icon" aria-hidden="true" />
          Grid Settings
        </h3>

        <div className="control-row">
          <label>Rows:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={settings.rows}
            onChange={(e) => handleChange('rows', parseInt(e.target.value))}
            id="numRows"
          />
          <input
            type="number"
            min="1"
            max="50"
            value={settings.rows}
            onChange={(e) => handleChange('rows', parseInt(e.target.value))}
            className="control-number"
          />
        </div>

        <div className="control-row">
          <label>Columns:</label>
          <input
            type="range"
            min="1"
            max="50"
            value={settings.cols}
            onChange={(e) => handleChange('cols', parseInt(e.target.value))}
            id="numCols"
          />
          <input
            type="number"
            min="1"
            max="50"
            value={settings.cols}
            onChange={(e) => handleChange('cols', parseInt(e.target.value))}
            className="control-number"
          />
        </div>

        <div className="control-row">
          <label>Line Thickness:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={settings.lineThickness}
            onChange={(e) => handleChange('lineThickness', parseInt(e.target.value))}
            id="lineThickness"
          />
          <div className="control-number-wrap">
            <input
              type="number"
              min="1"
              max="20"
              value={settings.lineThickness}
              onChange={(e) => handleChange('lineThickness', parseInt(e.target.value))}
              className="control-number"
            />
            <span className="unit-label">px</span>
          </div>
        </div>

        <div className="control-row">
          <label>Line Color:</label>
          <input
            type="color"
            value={settings.lineColor}
            onChange={(e) => handleChange('lineColor', e.target.value)}
            id="lineColor"
          />
          <span className="value-display">{settings.lineColor}</span>
        </div>
      </div>

      <div className="control-group">
        <h3 className="section-title">
          <FiSettings className="section-title-icon" aria-hidden="true" />
          Options
        </h3>

        <div className="checkbox-control">
          <input
            type="checkbox"
            id="gridVisible"
            checked={settings.gridVisible}
            onChange={(e) => handleChange('gridVisible', e.target.checked)}
          />
          <label htmlFor="gridVisible">Grid Visible</label>
        </div>

        <div className="checkbox-control">
          <input
            type="checkbox"
            id="diagonalLines"
            checked={settings.diagonals}
            onChange={(e) => handleChange('diagonals', e.target.checked)}
          />
          <label htmlFor="diagonalLines">Diagonal Lines</label>
        </div>
      </div>

      <div className="control-group">
        <h3 className="section-title">
          <FiSave className="section-title-icon" aria-hidden="true" />
          Actions
        </h3>

        <div className="action-buttons">
          <div className="undo-redo-row">
            <button 
              onClick={onUndo} 
              className="btn btn-secondary btn-icon btn-sm"
              disabled={loading || !canUndo}
              title="Undo (Ctrl+Z)"
            >
              <FiArrowLeft aria-hidden="true" />
              Undo
            </button>

            <button 
              onClick={onRedo} 
              className="btn btn-secondary btn-icon btn-sm"
              disabled={loading || !canRedo}
              title="Redo (Ctrl+Y)"
            >
              <FiArrowRight aria-hidden="true" />
              Redo
            </button>
          </div>

          <button 
            onClick={onReset} 
            className="btn btn-secondary btn-icon"
            disabled={loading}
          >
            <FiRefreshCcw aria-hidden="true" />
            Reset Settings
          </button>

          <button 
            onClick={onSave} 
            className="btn btn-primary btn-icon"
            disabled={loading}
          >
            <FiSave aria-hidden="true" />
            {loading ? 'Saving...' : 'Save Project'}
          </button>

          <button 
            onClick={onExport} 
            className="btn btn-primary btn-icon"
            disabled={loading}
          >
            <FiDownload aria-hidden="true" />
            Export PNG
          </button>
        </div>
      </div>
    </>
  );
};

export default GridControls;