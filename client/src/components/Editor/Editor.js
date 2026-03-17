import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPenTool } from 'react-icons/fi';
import { MdCalculate } from 'react-icons/md';
import { useProject } from '../../contexts/ProjectContext';
import { resolveAssetUrl } from '../../services/api';
import { uploadService } from '../../services/upload';
import GridCanvas from './GridCanvas';
import GridControls from './GridControls';
import ImageUpload from './ImageUpload';
import GridCalculator from './GridCalculator';
import DrawingCanvas from './DrawingCanvas';

const DEFAULT_GRID_SETTINGS = {
  rows: 10,
  cols: 10,
  lineColor: '#000000',
  lineThickness: 2,
  diagonals: false,
  gridVisible: true,
  showCellNames: true
};

const Editor = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { 
    currentProject, 
    createProject, 
    updateProject, 
    getProject, 
    setCurrentProject,
    initializeNewProject,
    updateGridSettings,
    undo,
    redo,
    canUndo,
    canRedo
  } = useProject();
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [gridSettings, setGridSettings] = useState(DEFAULT_GRID_SETTINGS);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // New features states
  const [showCalculator, setShowCalculator] = useState(false);
  const [referenceOpacity, setReferenceOpacity] = useState(0.5);
  const [imageRotation, setImageRotation] = useState(0);
  const [drawingMode, setDrawingMode] = useState(false);

  const loadProject = useCallback(async (id) => {
    setLoading(true);
    const result = await getProject(id);
    if (!result.success) {
      toast.error(result.message);
      navigate('/dashboard');
    }
    setLoading(false);
  }, [getProject, navigate]);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    } else {
      // New project - initialize with default settings
      initializeNewProject(DEFAULT_GRID_SETTINGS);
      setProjectName('');
      setImage(null);
      setImagePath(null);
      setGridSettings(DEFAULT_GRID_SETTINGS);
    }

    return () => {
      setCurrentProject(null);
    };
  }, [projectId, loadProject, setCurrentProject, initializeNewProject]);

  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name);
      setGridSettings(currentProject.gridSettings);

      if (currentProject.imagePath) {
        setImagePath(currentProject.imagePath);
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Enable CORS to prevent tainted canvas
        img.onload = () => setImage(img);
        img.src = resolveAssetUrl(currentProject.imagePath);
      }
    }
  }, [currentProject]);

  const handleImageUpload = async (file) => {
    setLoading(true);
    try {
      const uploadResult = await uploadService.uploadImage(file);
      setImagePath(uploadResult.path);

      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS to prevent tainted canvas
      img.onload = () => {
        setImage(img);
        toast.success('Image uploaded successfully');
      };
      img.src = resolveAssetUrl(uploadResult.path);

    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGridChange = useCallback((newSettings) => {
    updateGridSettings(newSettings);
  }, [updateGridSettings]);

  const handleCalculatorApply = useCallback((calculatedGrid) => {
    const newSettings = {
      ...gridSettings,
      ...calculatedGrid
    };
    handleGridChange(newSettings);
    setShowCalculator(false);
    toast.success('Grid settings applied');
  }, [gridSettings, handleGridChange]);

  const handleUndo = useCallback(() => {
    undo();
  }, [undo]);

  const handleRedo = useCallback(() => {
    redo();
  }, [redo]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        if (canRedo) handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, handleUndo, handleRedo]);

  const resetSettings = () => {
    setGridSettings(DEFAULT_GRID_SETTINGS);
  };

  const handleSave = async () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }

    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    setLoading(true);
    try {
      if (!imagePath) {
        toast.error('Please upload an image before saving');
        return;
      }

      const projectData = {
        name: projectName,
        imagePath: imagePath,
        gridSettings
      };

      let result;
      if (currentProject) {
        result = await updateProject(currentProject._id, projectData);
      } else {
        result = await createProject(projectData);
      }

      if (result.success) {
        toast.success(`Project ${currentProject ? 'updated' : 'saved'} successfully`);
        if (!currentProject) {
          navigate(`/editor/${result.project._id}`);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to save project');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!image) {
      toast.error('Please upload an image first');
      return;
    }

    console.log('Export triggered - canvasRef:', canvasRef.current);
    console.log('Image:', image);
    console.log('Grid settings:', gridSettings);

    try {
      // Use the ref-based export function
      if (canvasRef.current && canvasRef.current.exportCanvas) {
        const filename = projectName ? `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png` : 'drawing-grid.png';
        console.log('Using ref-based export with filename:', filename);
        canvasRef.current.exportCanvas(filename);
        toast.success(`Image exported as ${filename}`);
      } else {
        // Fallback to DOM query method
        const canvas = document.getElementById('drawingCanvas') || document.querySelector('.grid-canvas');
        
        if (!canvas) {
          toast.error('Canvas not found - please wait for the image to load');
          return;
        }

        if (canvas.width === 0 || canvas.height === 0) {
          toast.error('Canvas is empty - please upload an image first');
          return;
        }

        const filename = projectName ? `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png` : 'drawing-grid.png';
        const dataURL = canvas.toDataURL('image/png', 1.0);
        
        if (dataURL === 'data:,') {
          toast.error('Failed to export - canvas is empty');
          return;
        }
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`Image exported as ${filename}`);
      }
      
    } catch (error) {
      toast.error(`Failed to export image: ${error.message}`);
      console.error('Export error:', error);
    }
  };

  if (loading && projectId) {
    return (
      <div className="editor editor-loading">
        <div className="spinner"></div>
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="editor">
      <div className="editor-sidebar">
        <div className="control-group">
          <h3>Project</h3>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              className="form-control"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
        </div>

        <ImageUpload onImageUpload={handleImageUpload} loading={loading} />

        {image && (
          <>
            <div className="control-group">
              <button
                className="btn btn-primary btn-icon"
                onClick={() => setShowCalculator(true)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <MdCalculate />
                Calculate Optimal Grid
              </button>
            </div>

            <div className="control-group">
              <h3>Reference Tools</h3>
              
              <div className="form-group">
                <label className="form-label">Image Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={referenceOpacity}
                  onChange={(e) => setReferenceOpacity(parseFloat(e.target.value))}
                  className="form-range"
                />
                <span className="range-value">{Math.round(referenceOpacity * 100)}%</span>
              </div>

              <div className="form-group">
                <label className="form-label">Image Rotation</label>
                <input
                  type="number"
                  min="-360"
                  max="360"
                  step="5"
                  value={imageRotation}
                  onChange={(e) => setImageRotation(parseInt(e.target.value))}
                  className="form-control"
                  placeholder="Rotation angle (°)"
                />
                <span className="range-hint">{imageRotation}°</span>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setReferenceOpacity(1);
                  setImageRotation(0);
                }}
                style={{ width: '100%' }}
              >
                Reset Reference Tools
              </button>
            </div>

            <div className="control-group">
              <button
                className={`btn ${drawingMode ? 'btn-primary' : 'btn-secondary'} btn-icon`}
                onClick={() => setDrawingMode(!drawingMode)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <FiPenTool />
                {drawingMode ? 'Exit Drawing Mode' : 'Enter Drawing Mode'}
              </button>
            </div>
            
            <GridControls
              settings={gridSettings}
              onChange={handleGridChange}
              onReset={resetSettings}
              onSave={handleSave}
              onExport={handleExport}
              loading={loading}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />
          </>
        )}
      </div>

      <div className="editor-main">
        {image ? (
          <div className="canvas-container">
            <GridCanvas
              ref={canvasRef}
              image={image}
              gridSettings={gridSettings}
              referenceOpacity={referenceOpacity}
              imageRotation={imageRotation}
            />
            {drawingMode && (
              <DrawingCanvas
                canvasWidth={image.width}
                canvasHeight={image.height}
                isVisible={drawingMode}
              />
            )}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Upload an Image to Get Started</h3>
            <p>Select an image from the sidebar to begin creating your custom grid</p>
          </div>
        )}
        
        {drawingMode && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 500,
            background: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>Drawing Mode Active</span>
            <button
              onClick={() => setDrawingMode(false)}
              style={{
                padding: '8px 16px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.9rem'
              }}
            >
              Exit Drawing Mode
            </button>
          </div>
        )}
      </div>

      <GridCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onApply={handleCalculatorApply}
      />
    </div>
  );
};

export default Editor;