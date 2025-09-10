import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  Chip,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ZoomIn,
  ZoomOut,
  MyLocation,
  Fullscreen,
  Home,
  Navigation,
  PanTool,
  CropFree,
  Timeline,
  Straighten,
  Business,
  Terrain,
  Place,
  Clear,
  Close,
  Minimize,
  ExpandMore,
  Info,
} from "@mui/icons-material";
import useGlobalMap, { useGlobalMapContext } from "../hooks/useGlobalMap";
import { MeasurementManager, formatDistance } from "../utils/measurementUtils";

export default function GISCard({ 
  title = "GIS Tools",
  showMapContainer = true,
  onNotification = () => {},
  cardStyles = {}
}) {
  const theme = useTheme();
  
  // Global map state
  const { map, loaded, error, initializeGlobalMap } = useGlobalMap({});
  const mapContainerRef = useRef(null);
  
  // UI state
  const [activeTool, setActiveTool] = useState("pan");
  const [selectedBaseMap, setSelectedBaseMap] = useState("hybrid");
  const [currentCoords, setCurrentCoords] = useState({
    lat: 22.5,
    lng: 78.9,
    zoom: 5,
  });
  
  // Measurement state
  const [measurementDialog, setMeasurementDialog] = useState(false);
  const [measurementMinimized, setMeasurementMinimized] = useState(false);
  const [measurementActive, setMeasurementActive] = useState(false);
  const [measurementPoints, setMeasurementPoints] = useState([]);
  const [measurementDistance, setMeasurementDistance] = useState(0);
  
  // Measurement manager
  const measurementManagerRef = useRef(null);
  
  // Drawing tools configuration
  const drawingTools = [
    { id: "pan", icon: PanTool, name: "Pan", color: "primary", shortcut: "P" },
    {
      id: "select",
      icon: CropFree,
      name: "Select",
      color: "secondary",
      shortcut: "S",
    },
    {
      id: "polygon",
      icon: Timeline,
      name: "Polygon",
      color: "success",
      shortcut: "G",
    },
    {
      id: "measure",
      icon: Straighten,
      name: "Measure",
      color: "warning",
      shortcut: "M",
    },
    {
      id: "infrastructure",
      icon: Business,
      name: "infra",
      color: "error",
      shortcut: "I",
    },
    {
      id: "elevation",
      icon: Terrain,
      name: "Elevation",
      color: "info",
      shortcut: "E",
    },
    {
      id: "marker",
      icon: Place,
      name: "Marker",
      color: "primary",
      shortcut: "K",
    },
  ];
  
  // Base maps configuration
  const baseMaps = [
    {
      id: "satellite",
      name: "Satellite",
      desc: "High-resolution satellite imagery",
      icon: "🛰️",
    },
    {
      id: "street",
      name: "Street Map",
      desc: "Detailed street and road network",
      icon: "🗺️",
    },
    {
      id: "terrain",
      name: "Terrain",
      desc: "Topographic and elevation data",
      icon: "🏔️",
    },
    {
      id: "hybrid",
      name: "Hybrid",
      desc: "Satellite with street labels",
      icon: "🌐",
    },
  ];

  // Initialize map when container is ready
  useEffect(() => {
    if (mapContainerRef.current && !map && showMapContainer) {
      initializeGlobalMap(mapContainerRef);
    }
  }, [map, showMapContainer, initializeGlobalMap]);

  // Initialize measurement manager when map is ready
  useEffect(() => {
    if (map && loaded && !measurementManagerRef.current) {
      measurementManagerRef.current = new MeasurementManager(map, {
        onPointAdded: (data) => {
          setMeasurementPoints(prev => [...prev, data.point]);
          setMeasurementDistance(data.totalDistance);
          onNotification(`📍 Point ${data.pointCount} added • ${data.formattedDistance}`, 'success');
        },
        onMeasurementComplete: (distance, points) => {
          onNotification(`✅ Measurement completed: ${formatDistance(distance)}`, 'success');
        },
        onError: (message) => {
          onNotification(message, 'warning');
        }
      });
    }
  }, [map, loaded, onNotification]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      try {
        if (measurementManagerRef.current) {
          measurementManagerRef.current.destroy();
          measurementManagerRef.current = null;
        }
      } catch (error) {
        console.warn('⚠️ Cleanup warning (non-critical):', error);
      }
    };
  }, []);

  // Tool change handler
  const handleToolChange = (toolId) => {
    setActiveTool(toolId);
    onNotification(`Switched to ${toolId} tool`, "info");

    if (toolId === "measure") {
      if (!loaded || !map) {
        onNotification('Map is not ready for measurement. Please wait...', 'warning');
        return;
      }
      startMeasurement();
    } else if (toolId === "elevation") {
      onNotification('Elevation tool selected', 'info');
    } else if (toolId === "infrastructure") {
      onNotification('Infrastructure tool selected', 'info');
    } else if (toolId === "polygon") {
      onNotification('Polygon drawing tool selected', 'info');
    }
  };

  // Measurement functions
  const startMeasurement = () => {
    if (measurementManagerRef.current) {
      const success = measurementManagerRef.current.startMeasurement();
      if (success) {
        setMeasurementActive(true);
        setMeasurementDialog(true);
        onNotification('🎯 Click on the map to start measuring distances!', 'info');
      }
    }
  };

  const stopMeasurement = () => {
    if (measurementManagerRef.current) {
      measurementManagerRef.current.stopMeasurement();
      setMeasurementActive(false);
    }
  };

  const clearMeasurements = () => {
    if (measurementManagerRef.current) {
      measurementManagerRef.current.clearMeasurements();
      setMeasurementPoints([]);
      setMeasurementDistance(0);
      onNotification('🧹 Measurements cleared', 'info');
    }
  };

  // Base map change handler
  const handleBaseMapChange = (e, newMap) => {
    if (newMap && map) {
      setSelectedBaseMap(newMap);
      map.setMapTypeId(newMap === 'street' ? 'roadmap' : newMap);
      onNotification(`Switched to ${newMap} view`, "success");
    }
  };

  return (
    <Card sx={{ mb: 2, ...cardStyles }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: "h6", fontSize: "1rem" }}
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* Map Container */}
          {showMapContainer && (
            <Box
              sx={{
                position: "relative",
                height: 400,
                bgcolor: "grey.300",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                ref={mapContainerRef}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!loaded && (
                  <Typography variant="body2" color="text.secondary">
                    {error ? `Error: ${error}` : 'Loading map...'}
                  </Typography>
                )}
              </div>

              {/* Map Controls */}
              {loaded && (
                <Paper
                  elevation={3}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <ButtonGroup orientation="vertical" size="small">
                    <Tooltip title="Zoom In" placement="left">
                      <IconButton
                        onClick={() => {
                          if (map) {
                            map.setZoom(map.getZoom() + 1);
                            onNotification("Zoomed in", "info");
                          }
                        }}
                      >
                        <ZoomIn />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Zoom Out" placement="left">
                      <IconButton
                        onClick={() => {
                          if (map) {
                            map.setZoom(map.getZoom() - 1);
                            onNotification("Zoomed out", "info");
                          }
                        }}
                      >
                        <ZoomOut />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="My Location" placement="left">
                      <IconButton
                        onClick={() =>
                          onNotification("Getting current location...", "info")
                        }
                      >
                        <MyLocation />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Home View" placement="left">
                      <IconButton
                        onClick={() => {
                          if (map) {
                            map.setCenter({ lat: 22.5, lng: 78.9 });
                            map.setZoom(5);
                            onNotification("Returned to home view", "success");
                          }
                        }}
                      >
                        <Home />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </Paper>
              )}
            </Box>
          )}

          {/* Drawing Tools */}
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Drawing Tools
              <Tooltip title="Tool shortcuts available">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                gap: 1,
              }}
            >
              {drawingTools.map((tool) => (
                <Tooltip
                  key={tool.id}
                  title={`${tool.name} (${tool.shortcut})`}
                  placement="top"
                >
                  <Button
                    variant={
                      (activeTool === tool.id || (tool.id === "measure" && measurementActive)) 
                        ? "contained" 
                        : "outlined"
                    }
                    color={tool.color}
                    startIcon={<tool.icon />}
                    onClick={() => handleToolChange(tool.id)}
                    size="small"
                    sx={{
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    {tool.name}
                    {tool.id === "measure" && measurementActive && measurementPoints.length > 0 && (
                      <Chip 
                        label={`${measurementPoints.length} pts`}
                        size="small" 
                        color="success" 
                        sx={{ ml: 1, fontSize: '0.6rem', height: 16 }}
                      />
                    )}
                  </Button>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Base Maps */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Base Maps
            </Typography>
            <ToggleButtonGroup
              value={selectedBaseMap}
              exclusive
              onChange={handleBaseMapChange}
              aria-label="base map selection"
              size="small"
              sx={{ flexWrap: 'wrap' }}
            >
              {baseMaps.map((mapType) => (
                <ToggleButton
                  key={mapType.id}
                  value={mapType.id}
                  sx={{
                    flexDirection: 'column',
                    minWidth: 80,
                    p: 1,
                  }}
                >
                  <Typography sx={{ fontSize: '0.8rem' }}>{mapType.icon}</Typography>
                  <Typography variant="caption">{mapType.name}</Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Box>
      </CardContent>

      {/* Measurement Dialog */}
      <Dialog
        open={measurementDialog}
        onClose={() => {
          setMeasurementDialog(false);
          if (measurementActive) {
            stopMeasurement();
          }
        }}
        maxWidth="sm"
        fullWidth
        hideBackdrop
        disableEnforceFocus
        sx={{
          '& .MuiDialog-paper': {
            position: 'fixed',
            top: 80,
            right: 20,
            left: 'auto',
            margin: 0,
            maxHeight: 'calc(100vh - 100px)',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Straighten color="primary" />
              Distance Measurement
              {measurementActive && (
                <Chip 
                  label={`${measurementPoints.length} points • ${formatDistance(measurementDistance)}`}
                  size="small" 
                  color="success" 
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            <Box>
              <IconButton onClick={() => setMeasurementMinimized(!measurementMinimized)} size="small">
                {measurementMinimized ? <ExpandMore /> : <Minimize />}
              </IconButton>
              <IconButton onClick={() => {
                setMeasurementDialog(false);
                if (measurementActive) {
                  stopMeasurement();
                }
              }} size="small">
                <Close />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        
        {!measurementMinimized && (
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" paragraph color="text.secondary">
                {measurementActive 
                  ? '🎯 Measurement active! Click points on the India map to measure distances.'
                  : '📏 Click "Start Measurement" to begin measuring distances on the map.'
                }
              </Typography>

              {/* Results Display */}
              <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Measurement Results
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'success.main' }}>
                  Distance: {formatDistance(measurementDistance)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Points: {measurementPoints.length}
                </Typography>
                {measurementActive && (
                  <Chip 
                    label="🎯 Measuring active - Click on map" 
                    color="success" 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                )}
              </Paper>

              {/* Control Buttons */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button 
                  variant={measurementActive ? "outlined" : "contained"}
                  startIcon={measurementActive ? <Close /> : <Straighten />}
                  onClick={measurementActive ? stopMeasurement : startMeasurement}
                  color={measurementActive ? "secondary" : "primary"}
                  disabled={!loaded || !map}
                >
                  {measurementActive ? 'Stop Measurement' : 'Start Measurement'}
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<Clear />} 
                  onClick={clearMeasurements}
                  disabled={measurementPoints.length === 0}
                >
                  Clear All
                </Button>
              </Box>

              {/* Instructions */}
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="caption" color="primary.contrastText">
                  <strong>Measurement Instructions:</strong><br/>
                  1. Click "Start Measurement" above<br/>
                  2. Click points on the India map to measure<br/>
                  3. See distance update in real-time<br/>
                  4. Green marker = start, Red markers = points<br/>
                  5. Red line connects all points<br/>
                  6. Click "Stop" when finished
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* Floating Measurement Indicator */}
      {measurementActive && !measurementDialog && measurementPoints.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            top: 100,
            right: 20,
            p: 2,
            zIndex: 1300,
            bgcolor: 'success.main',
            color: 'success.contrastText',
            borderRadius: 2,
            cursor: 'pointer'
          }}
          onClick={() => setMeasurementDialog(true)}
        >
          <Typography variant="body2" fontWeight="bold">
            🎯 Measuring: {formatDistance(measurementDistance)}
          </Typography>
          <Typography variant="caption">
            {measurementPoints.length} points • Click to open controls
          </Typography>
        </Paper>
      )}
    </Card>
  );
}
