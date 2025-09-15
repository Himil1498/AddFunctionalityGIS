// import React, { useState, useRef, useEffect } from "react";
// import {
//   Box,
//   Drawer,
//   Typography,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Paper,
//   Button,
//   Switch,
//   FormControlLabel,
//   Chip,
//   Card,
//   CardContent,
//   Badge,
//   IconButton,
//   Tooltip,
//   Stack,
//   ToggleButton,
//   ToggleButtonGroup,
//   useTheme,
//   alpha,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   ButtonGroup,
//   Grid,
//   AppBar,
//   Toolbar,
//   InputAdornment,
//   Fade,
//   Slide,
//   Collapse,
//   Fab,
//   Grow
// } from "@mui/material";
// import {
//   PanTool,
//   CropFree,
//   Timeline,
//   Straighten,
//   Business,
//   TrendingUp,
//   Place,
//   Layers,
//   Map as MapIcon,
//   Satellite,
//   Terrain,
//   LayersClear,
//   Bookmark,
//   Settings,
//   Fullscreen,
//   ZoomIn,
//   ZoomOut,
//   CenterFocusStrong,
//   MyLocation,
//   PlayArrow,
//   Stop,
//   Crop,
//   Clear,
//   Save,
//   History,
//   ExpandMore,
//   Visibility,
//   Upload,
//   Download,
//   BugReport,
//   Code,
//   LocationOn,
//   Close,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   Public,
//   BorderAll,
//   Menu,
//   MoreVert,
//   Brightness4,
//   Brightness7,
//   Undo,
//   Redo
// } from "@mui/icons-material";
// import WorkingMeasurementMap from "./WorkingMeasurementMap";
// import MapSearchBox from "./MapSearchBox";

// const GISProfessionalDashboard = () => {
//   const theme = useTheme();
//   const [activeDrawingTool, setActiveDrawingTool] = useState("pan");
//   const [activeLayers, setActiveLayers] = useState({
//     boundaries: true,
//     roads: false,
//     buildings: false,
//     terrain: false,
//     infrastructure: true
//   });
//   const [selectedBaseMap, setSelectedBaseMap] = useState("satellite");
//   const [bookmarks, setBookmarks] = useState([
//     { id: 1, name: "Delhi Metro Area", coords: { lat: 28.6139, lng: 77.209 } },
//     { id: 2, name: "Mumbai Central", coords: { lat: 19.076, lng: 72.8777 } },
//     { id: 3, name: "Bangalore IT Hub", coords: { lat: 12.9716, lng: 77.5946 } }
//   ]);

//   // Enhanced UI state
//   const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
//   const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [showIndiaBoundary, setShowIndiaBoundary] = useState(false);
//   const [compactMode, setCompactMode] = useState(true);

//   // Compact sidebar width for more map space
//   const leftDrawerWidth = 250; // Reduced from 280
//   const rightDrawerWidth = 320;

//   // State for actual WorkingMeasurementMap functionality
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [isPolygonDrawing, setIsPolygonDrawing] = useState(false);
//   const [showElevation, setShowElevation] = useState(false);
//   const [elevationMarkers, setElevationMarkers] = useState([]);
//   const [showElevationChart, setShowElevationChart] = useState(false);
//   const [elevationData, setElevationData] = useState([]);
//   const [showInfrastructure, setShowInfrastructure] = useState(false);
//   const [points, setPoints] = useState([]);
//   const [polygonPoints, setPolygonPoints] = useState([]);
//   const [loaded, setLoaded] = useState(true);

//   // Additional states for functionality
//   const [totalDistance, setTotalDistance] = useState(0);
//   const [polygonArea, setPolygonArea] = useState(0);
//   const [saveDialogOpen, setSaveDialogOpen] = useState(false);
//   const [polygonSaveDialogOpen, setPolygonSaveDialogOpen] = useState(false);
//   const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
//   const [measurementName, setMeasurementName] = useState("");
//   const [polygonName, setPolygonName] = useState("");

//   // Live coordinates state
//   const [liveCoordinates, setLiveCoordinates] = useState({
//     lat: 20.5937,
//     lng: 78.9629
//   });
//   const [mapZoom, setMapZoom] = useState(6);
//   const [mouseCoordinates, setMouseCoordinates] = useState(null);
//   const [hoverCoordinates, setHoverCoordinates] = useState(null);

//   // Units and export state
//   const [selectedUnit, setSelectedUnit] = useState("metric");

//   // Debug logs state
//   const [debugLogs, setDebugLogs] = useState([]);
//   const [showDebugLogs, setShowDebugLogs] = useState(false);

//   // Undo/Redo state management
//   const [history, setHistory] = useState([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const [actionHistory, setActionHistory] = useState([]);

//   // Save current state to history
//   const saveToHistory = (action, data) => {
//     const newState = {
//       points: [...points],
//       polygonPoints: [...polygonPoints],
//       bookmarks: [...bookmarks],
//       action,
//       timestamp: Date.now(),
//       data
//     };

//     const newHistory = history.slice(0, historyIndex + 1);
//     newHistory.push(newState);

//     setHistory(newHistory);
//     setHistoryIndex(newHistory.length - 1);

//     // Limit history to 50 items
//     if (newHistory.length > 50) {
//       setHistory(newHistory.slice(-50));
//       setHistoryIndex(49);
//     }
//   };

//   // Undo function
//   const handleUndo = () => {
//     if (historyIndex > 0) {
//       const previousState = history[historyIndex - 1];
//       setPoints(previousState.points);
//       setPolygonPoints(previousState.polygonPoints);
//       setBookmarks(previousState.bookmarks);
//       setHistoryIndex(historyIndex - 1);
//       addLog(`↶ Undid: ${previousState.action}`);
//     }
//   };

//   // Redo function
//   const handleRedo = () => {
//     if (historyIndex < history.length - 1) {
//       const nextState = history[historyIndex + 1];
//       setPoints(nextState.points);
//       setPolygonPoints(nextState.polygonPoints);
//       setBookmarks(nextState.bookmarks);
//       setHistoryIndex(historyIndex + 1);
//       addLog(`↷ Redid: ${nextState.action}`);
//     }
//   };

//   // Bookmark editing state
//   const [editingBookmark, setEditingBookmark] = useState(null);
//   const [bookmarkEditDialogOpen, setBookmarkEditDialogOpen] = useState(false);
//   const [editedBookmarkName, setEditedBookmarkName] = useState("");
//   const [bookmarkDeleteDialogOpen, setBookmarkDeleteDialogOpen] =
//     useState(false);
//   const [bookmarkToDelete, setBookmarkToDelete] = useState(null);

//   // Ref to access child component functions
//   const workingMapRef = useRef(null);

//   const baseMaps = [
//     {
//       id: "satellite",
//       name: "SATELLITE",
//       description: "HIGH RESOLUTION SATELLITE IMAGERY",
//       icon: "🛰️"
//     },
//     {
//       id: "street",
//       name: "STREET MAP",
//       description: "DETAILED STREET AND ROAD NETWORK",
//       icon: "🗺️"
//     },
//     {
//       id: "terrain",
//       name: "TERRAIN",
//       description: "TOPOGRAPHIC AND ELEVATION DATA",
//       icon: "🏔️"
//     }
//   ];

//   const handleLayerToggle = (layerName) => {
//     const newValue = !activeLayers[layerName];
//     setActiveLayers((prev) => ({
//       ...prev,
//       [layerName]: newValue
//     }));

//     // Pass layer changes to WorkingMeasurementMap
//     if (workingMapRef.current && workingMapRef.current.toggleLayer) {
//       workingMapRef.current.toggleLayer(layerName, newValue);
//     }

//     console.log(`🌍 Layer ${layerName} toggled to: ${newValue}`);
//   };

//   const activeLayersCount = Object.values(activeLayers).filter(Boolean).length;

//   // Real functionality handlers
//   const handleStartDrawing = () => {
//     if (workingMapRef.current && workingMapRef.current.startDrawing) {
//       saveToHistory("Start Distance Drawing", { isDrawing: true });
//       setIsDrawing(true);
//       setIsPolygonDrawing(false);
//       workingMapRef.current.startDrawing();
//       addLog("📏 Started distance measurement");
//     }
//   };

//   const handleStopDrawing = () => {
//     if (workingMapRef.current && workingMapRef.current.stopDrawing) {
//       setIsDrawing(false);
//       workingMapRef.current.stopDrawing();
//     }
//   };

//   const handleStartPolygonDrawing = () => {
//     console.log("📐 Dashboard handleStartPolygonDrawing called");
//     if (workingMapRef.current && workingMapRef.current.startPolygonDrawing) {
//       console.log("✅ Starting polygon drawing...");
//       setIsPolygonDrawing(true);
//       setIsDrawing(false);
//       workingMapRef.current.startPolygonDrawing();
//     } else {
//       console.error("❌ workingMapRef or startPolygonDrawing not available");
//     }
//   };

//   const handleStopPolygonDrawing = () => {
//     console.log("⏹️ Dashboard handleStopPolygonDrawing called");
//     if (workingMapRef.current && workingMapRef.current.stopPolygonDrawing) {
//       console.log("✅ Stopping polygon drawing...");
//       setIsPolygonDrawing(false);
//       workingMapRef.current.stopPolygonDrawing();
//     } else {
//       console.error("❌ workingMapRef or stopPolygonDrawing not available");
//     }
//   };

//   const handleClearAll = () => {
//     if (workingMapRef.current && workingMapRef.current.clearAll) {
//       saveToHistory("Clear All Data", { cleared: true });
//       workingMapRef.current.clearAll();
//       setPoints([]);
//       setPolygonPoints([]);
//       setIsDrawing(false);
//       setIsPolygonDrawing(false);
//       setTotalDistance(0);
//       setPolygonArea(0);
//       addLog("✂️ Cleared all measurements and data");
//     }
//   };

//   const handleShowElevation = () => {
//     const newValue = !showElevation;
//     console.log(
//       `🏔️ Dashboard handleShowElevation called: ${showElevation} -> ${newValue}`
//     );

//     if (newValue) {
//       // Starting elevation mode - clear previous markers and enable marker placement
//       setElevationMarkers([]);
//       setShowElevationChart(false);
//       setElevationData([]);
//       addLog("🏔️ Elevation mode activated - Click two points on the map");
//       saveToHistory("Start Elevation Mode", { showElevation: true });
//     } else {
//       // Stopping elevation mode
//       setElevationMarkers([]);
//       setShowElevationChart(false);
//       setElevationData([]);
//       addLog("🔴 Elevation mode deactivated");
//     }

//     setShowElevation(newValue);
//     if (workingMapRef.current && workingMapRef.current.setShowElevation) {
//       console.log("✅ Calling workingMapRef setShowElevation");
//       workingMapRef.current.setShowElevation(newValue);
//     } else {
//       console.error("❌ workingMapRef or setShowElevation not available");
//     }
//   };

//   // Handle elevation marker placement
//   const handleElevationMarkerAdd = (marker) => {
//     const newMarkers = [...elevationMarkers, marker];
//     setElevationMarkers(newMarkers);

//     addLog(`📍 Elevation marker ${newMarkers.length} placed`);

//     // When we have 2 markers, generate elevation profile
//     if (newMarkers.length === 2) {
//       generateElevationProfile(newMarkers);
//     }
//   };

//   // Generate elevation profile between two points
//   const generateElevationProfile = async (markers) => {
//     try {
//       // Mock elevation data generation (replace with real elevation API)
//       const elevationPoints = [];
//       const steps = 50;

//       for (let i = 0; i <= steps; i++) {
//         const ratio = i / steps;
//         const lat = markers[0].lat + (markers[1].lat - markers[0].lat) * ratio;
//         const lng = markers[0].lng + (markers[1].lng - markers[0].lng) * ratio;

//         // Mock elevation calculation (replace with real API call)
//         const elevation =
//           Math.random() * 1000 + 100 + Math.sin(ratio * Math.PI * 4) * 200;
//         const distance = ratio * calculateDistance(markers[0], markers[1]);

//         elevationPoints.push({
//           lat,
//           lng,
//           elevation: Math.round(elevation),
//           distance: Math.round(distance),
//           index: i
//         });
//       }

//       setElevationData(elevationPoints);
//       setShowElevationChart(true);
//       addLog(
//         `📈 Generated elevation profile with ${elevationPoints.length} data points`
//       );
//     } catch (error) {
//       console.error("Error generating elevation profile:", error);
//       addLog("❌ Failed to generate elevation profile");
//     }
//   };

//   // Calculate distance between two points (Haversine formula)
//   const calculateDistance = (point1, point2) => {
//     const R = 6371000; // Earth's radius in meters
//     const lat1Rad = (point1.lat * Math.PI) / 180;
//     const lat2Rad = (point2.lat * Math.PI) / 180;
//     const deltaLatRad = ((point2.lat - point1.lat) * Math.PI) / 180;
//     const deltaLngRad = ((point2.lng - point1.lng) * Math.PI) / 180;

//     const a =
//       Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
//       Math.cos(lat1Rad) *
//         Math.cos(lat2Rad) *
//         Math.sin(deltaLngRad / 2) *
//         Math.sin(deltaLngRad / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
//   };

//   const handleShowInfrastructure = () => {
//     const newValue = !showInfrastructure;
//     setShowInfrastructure(newValue);
//     if (workingMapRef.current && workingMapRef.current.setShowInfrastructure) {
//       workingMapRef.current.setShowInfrastructure(newValue);
//     }
//   };

//   const handleHistory = () => {
//     console.log("📂 History button clicked");
//     if (workingMapRef.current) {
//       console.log("✅ WorkingMapRef is available");

//       // Load the saved measurements first
//       if (workingMapRef.current.loadSavedMeasurements) {
//         console.log("🔄 Calling loadSavedMeasurements");
//         workingMapRef.current.loadSavedMeasurements();
//       }

//       // Open the history dialog
//       if (workingMapRef.current.setHistoryDialogOpen) {
//         console.log("📋 Opening history dialog");
//         workingMapRef.current.setHistoryDialogOpen(true);
//       }
//     } else {
//       console.error("❌ WorkingMapRef not available");
//     }
//   };

//   const handleSaveDistance = () => {
//     setSaveDialogOpen(true);
//   };

//   const handleSavePolygon = () => {
//     console.log("💾 Opening polygon save dialog...");
//     setPolygonSaveDialogOpen(true);
//   };

//   const confirmSaveDistance = () => {
//     if (workingMapRef.current && workingMapRef.current.saveMeasurement) {
//       workingMapRef.current.saveMeasurement(
//         measurementName || `Measurement ${Date.now()}`
//       );
//     }
//     setSaveDialogOpen(false);
//     setMeasurementName("");
//   };

//   const confirmSavePolygon = () => {
//     console.log("✅ Confirming polygon save with name:", polygonName);
//     if (workingMapRef.current && workingMapRef.current.savePolygonData) {
//       workingMapRef.current.savePolygonData(
//         polygonName || `Polygon ${Date.now()}`
//       );
//       console.log("✅ Polygon save function called");
//     } else {
//       console.error("❌ workingMapRef or savePolygonData not available");
//     }
//     setPolygonSaveDialogOpen(false);
//     setPolygonName("");
//   };

//   // Map control handlers
//   const handleZoomIn = () => {
//     if (workingMapRef.current?.zoomIn) {
//       workingMapRef.current.zoomIn();
//     }
//   };

//   const handleZoomOut = () => {
//     if (workingMapRef.current?.zoomOut) {
//       workingMapRef.current.zoomOut();
//     }
//   };

//   const handleMyLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           if (workingMapRef.current?.map) {
//             workingMapRef.current.map.setCenter({
//               lat: latitude,
//               lng: longitude
//             });
//             workingMapRef.current.map.setZoom(15);
//           }
//         },
//         (error) => {
//           console.warn("Location not available:", error);
//         }
//       );
//     }
//   };

//   const handleCenterIndia = () => {
//     if (workingMapRef.current?.centerOnIndia) {
//       workingMapRef.current.centerOnIndia();
//     }
//   };

//   const handleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     }
//   };

//   const handleIndiaBoundaryToggle = () => {
//     const newValue = !showIndiaBoundary;
//     setShowIndiaBoundary(newValue);
//     if (workingMapRef.current?.showIndiaBoundary) {
//       workingMapRef.current.showIndiaBoundary(newValue);
//     }
//     console.log(`🇮🇳 India boundary ${newValue ? "enabled" : "disabled"}`);
//   };

//   const handleCenterOnIndia = () => {
//     if (workingMapRef.current?.centerOnIndia) {
//       workingMapRef.current.centerOnIndia();
//     }
//     console.log("🗺️ Centered map on India");
//   };

//   // Unit conversion functions
//   const formatDistance = (meters) => {
//     if (selectedUnit === "imperial") {
//       const miles = meters * 0.000621371;
//       return miles >= 1
//         ? `${miles.toFixed(2)} mi`
//         : `${(meters * 3.28084).toFixed(0)} ft`;
//     } else {
//       return meters >= 1000
//         ? `${(meters / 1000).toFixed(2)} km`
//         : `${meters.toFixed(0)} m`;
//     }
//   };

//   const formatArea = (squareMeters) => {
//     if (selectedUnit === "imperial") {
//       const squareMiles = squareMeters * 0.000000386102;
//       return squareMiles >= 1
//         ? `${squareMiles.toFixed(2)} mi²`
//         : `${(squareMeters * 10.7639).toFixed(0)} ft²`;
//     } else {
//       return squareMeters >= 1000000
//         ? `${(squareMeters / 1000000).toFixed(2)} km²`
//         : `${squareMeters.toFixed(0)} m²`;
//     }
//   };

//   // Calculate dynamic scale based on zoom level
//   const getMapScale = (zoom) => {
//     // Approximate scale calculation based on zoom level
//     const earthCircumference = 40075000; // Earth's circumference in meters
//     const pixelsAtZoom = 256 * Math.pow(2, zoom);
//     const metersPerPixel = earthCircumference / pixelsAtZoom;
//     const scaleDistance = metersPerPixel * 100; // 100 pixels scale

//     if (selectedUnit === "imperial") {
//       const feet = scaleDistance * 3.28084;
//       const miles = scaleDistance * 0.000621371;
//       return miles >= 1 ? `${miles.toFixed(2)} mi` : `${feet.toFixed(0)} ft`;
//     } else {
//       return scaleDistance >= 1000
//         ? `${(scaleDistance / 1000).toFixed(2)} km`
//         : `${scaleDistance.toFixed(0)} m`;
//     }
//   };

//   const handleStreetView = () => {
//     if (workingMapRef.current?.toggleStreetView) {
//       workingMapRef.current.toggleStreetView();
//     }
//   };

//   // Bookmark handlers
//   const handleEditBookmark = (bookmark) => {
//     setEditingBookmark(bookmark);
//     setEditedBookmarkName(bookmark.name);
//     setBookmarkEditDialogOpen(true);
//   };

//   const handleSaveBookmarkEdit = () => {
//     if (editingBookmark && editedBookmarkName.trim()) {
//       setBookmarks((prev) =>
//         prev.map((b) =>
//           b.id === editingBookmark.id
//             ? { ...b, name: editedBookmarkName.trim() }
//             : b
//         )
//       );
//       setBookmarkEditDialogOpen(false);
//       setEditingBookmark(null);
//       setEditedBookmarkName("");
//       console.log(`🌎 Bookmark renamed to: ${editedBookmarkName}`);
//     }
//   };

//   const handleDeleteBookmark = (bookmark) => {
//     setBookmarkToDelete(bookmark);
//     setBookmarkDeleteDialogOpen(true);
//   };

//   const confirmDeleteBookmark = () => {
//     if (bookmarkToDelete) {
//       setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkToDelete.id));
//       setBookmarkDeleteDialogOpen(false);
//       setBookmarkToDelete(null);
//       console.log(`🗑️ Bookmark deleted: ${bookmarkToDelete.name}`);
//     }
//   };

//   // Add log function for debugging and user feedback
//   const addLog = (message) => {
//     const timestamp = new Date().toLocaleTimeString();
//     const logEntry = `[${timestamp}] ${message}`;
//     console.log(logEntry);

//     setDebugLogs((prev) => {
//       const newLogs = [...prev.slice(-49), logEntry]; // Keep last 50 logs
//       return newLogs;
//     });
//   };

//   // Keyboard shortcuts for undo/redo
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
//         e.preventDefault();
//         handleUndo();
//       } else if (
//         (e.ctrlKey || e.metaKey) &&
//         (e.key === "y" || (e.key === "z" && e.shiftKey))
//       ) {
//         e.preventDefault();
//         handleRedo();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [historyIndex, history]);

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         bgcolor: darkMode ? "grey.900" : "#f8f9fa",
//         transition: "background-color 0.3s ease"
//       }}
//     >
//       {/* Enhanced Navbar */}
//       <AppBar
//         position="fixed"
//         sx={{
//           zIndex: theme.zIndex.drawer + 1,
//           bgcolor: darkMode ? "grey.900" : "primary.main",
//           boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
//         }}
//       >
//         <Toolbar sx={{ minHeight: "64px !important" }}>
//           <IconButton
//             color="inherit"
//             onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
//             edge="start"
//             sx={{ mr: 2 }}
//           >
//             <Menu />
//           </IconButton>

//           <MapIcon sx={{ mr: 1, fontSize: 28 }} />
//           <Typography variant="h6" component="div" sx={{ mr: 2 }}>
//             GIS Professional
//           </Typography>
//           <Chip
//             label="Pro"
//             size="small"
//             color="secondary"
//             sx={{ mr: 3, fontWeight: "bold" }}
//           />

//           {/* Enhanced Search Bar */}
//           <TextField
//             variant="outlined"
//             size="small"
//             placeholder="Search places in India..."
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search sx={{ color: "rgba(255,255,255,0.7)" }} />
//                 </InputAdornment>
//               ),
//               sx: {
//                 bgcolor: "rgba(255,255,255,0.15)",
//                 color: "white",
//                 borderRadius: "25px",
//                 "& fieldset": { border: "none" },
//                 "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
//                 "&.Mui-focused": { bgcolor: "rgba(255,255,255,0.25)" }
//               }
//             }}
//             sx={{
//               width: 350,
//               mr: "auto",
//               "& input::placeholder": { color: "rgba(255,255,255,0.7)" }
//             }}
//           />

//           {/* Action Buttons */}
//           <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
//             <Tooltip title="Center on India">
//               <Button
//                 startIcon={<CenterFocusStrong />}
//                 onClick={handleCenterOnIndia}
//                 sx={{
//                   color: "white",
//                   borderColor: "rgba(255,255,255,0.3)"
//                 }}
//               >
//                 Center
//               </Button>
//             </Tooltip>
//           </ButtonGroup>

//           {/* Undo/Redo Controls */}
//           <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
//             <Tooltip title="Undo (Ctrl+Z)">
//               <Button
//                 startIcon={<Undo />}
//                 onClick={handleUndo}
//                 disabled={historyIndex <= 0}
//                 sx={{
//                   color: "white",
//                   borderColor: "rgba(255,255,255,0.3)",
//                   minWidth: "auto",
//                   px: 1
//                 }}
//               >
//                 Undo
//               </Button>
//             </Tooltip>
//             <Tooltip title="Redo (Ctrl+Y)">
//               <Button
//                 startIcon={<Redo />}
//                 onClick={handleRedo}
//                 disabled={historyIndex >= history.length - 1}
//                 sx={{
//                   color: "white",
//                   borderColor: "rgba(255,255,255,0.3)",
//                   minWidth: "auto",
//                   px: 1
//                 }}
//               >
//                 Redo
//               </Button>
//             </Tooltip>
//           </ButtonGroup>

//           <Tooltip title="Toggle Theme">
//             <IconButton
//               color="inherit"
//               onClick={() => setDarkMode(!darkMode)}
//               sx={{ mr: 1 }}
//             >
//               {darkMode ? <Brightness7 /> : <Brightness4 />}
//             </IconButton>
//           </Tooltip>

//           <Tooltip title="Toggle Right Panel">
//             <IconButton
//               color="inherit"
//               onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
//             >
//               <MoreVert />
//             </IconButton>
//           </Tooltip>
//         </Toolbar>
//       </AppBar>

//       <Box sx={{ display: "flex", flex: 1, pt: "64px" }}>
//         {/* Enhanced Left Sidebar */}
//         <Slide
//           direction="right"
//           in={leftSidebarOpen}
//           mountOnEnter
//           unmountOnExit
//         >
//           <Drawer
//             variant="persistent"
//             anchor="left"
//             open={leftSidebarOpen}
//             sx={{
//               width: leftDrawerWidth,
//               flexShrink: 0,
//               "& .MuiDrawer-paper": {
//                 width: leftDrawerWidth,
//                 boxSizing: "border-box",
//                 bgcolor: darkMode ? "#1a1a1a" : "#ffffff",
//                 color: darkMode ? "#ffffff" : "inherit",
//                 borderRight: `1px solid ${darkMode ? "#333" : "#e3f2fd"}`,
//                 boxShadow: darkMode
//                   ? "2px 0 12px rgba(0,0,0,0.5)"
//                   : "2px 0 12px rgba(0,0,0,0.1)",
//                 top: "64px",
//                 height: "calc(100vh - 64px)"
//               }
//             }}
//           >
//             {/* Compact Header */}
//             <Box
//               sx={{
//                 p: 1,
//                 background: `linear-gradient(135deg, ${
//                   darkMode ? "rgb(63,81,181)" : "#1976D2"
//                 } 0%, ${darkMode ? "rgb(48,63,159)" : "#1565C0"} 100%)`,
//                 color: "white",
//                 textAlign: "center",
//                 borderBottom: `1px solid ${darkMode ? "grey.700" : "#e3f2fd"}`
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
//               >
//                 📍 Professional Tools
//               </Typography>
//               <Chip
//                 label={`${activeLayersCount} Active`}
//                 size="small"
//                 sx={{
//                   mt: 0.25,
//                   bgcolor: "rgba(255,255,255,0.2)",
//                   color: "white",
//                   fontSize: "0.6rem",
//                   height: "18px"
//                 }}
//               />
//             </Box>

//             <Box sx={{ p: 1, overflow: "auto", height: "calc(100vh - 140px)" }}>
//               {/* Compact Stats Bar */}
//               <Paper
//                 sx={{
//                   p: 0.5,
//                   mb: 0.5,
//                   bgcolor: darkMode
//                     ? "rgba(66, 165, 245, 0.1)"
//                     : alpha(theme.palette.primary.main, 0.05),
//                   borderRadius: 2,
//                   border: darkMode ? "1px solid #333" : "none"
//                 }}
//               >
//                 <Grid container spacing={0.5}>
//                   <Grid item xs={4}>
//                     <Box sx={{ textAlign: "center" }}>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontSize: "0.8rem",
//                           fontWeight: "bold",
//                           color: "#1976D2"
//                         }}
//                       >
//                         {activeLayersCount}
//                       </Typography>
//                       <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
//                         Layers
//                       </Typography>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Box sx={{ textAlign: "center" }}>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontSize: "0.8rem",
//                           fontWeight: "bold",
//                           color: "#1976D2"
//                         }}
//                       >
//                         {points.length}
//                       </Typography>
//                       <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
//                         Points
//                       </Typography>
//                     </Box>
//                   </Grid>
//                   <Grid item xs={4}>
//                     <Box sx={{ textAlign: "center" }}>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontSize: "0.8rem",
//                           fontWeight: "bold",
//                           color: "#1976D2"
//                         }}
//                       >
//                         {polygonPoints.length}
//                       </Typography>
//                       <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
//                         Polygon
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Paper>

//               {/* 🛠️ PROFESSIONAL TOOLS */}
//               <Accordion
//                 defaultExpanded
//                 sx={{
//                   mb: 0.25,
//                   boxShadow: "none",
//                   border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
//                   bgcolor: darkMode ? "#2a2a2a" : "inherit"
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMore />}
//                   sx={{
//                     minHeight: 28,
//                     py: 0.25,
//                     "& .MuiAccordionSummary-content": { margin: "2px 0" }
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle1"
//                     sx={{
//                       fontWeight: "bold",
//                       color: "#1976D2",
//                       fontSize: "0.85rem"
//                     }}
//                   >
//                     🛐️ Professional Tools
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
//                   <Grid container spacing={0.5}>
//                     {/* Row 1: Distance & Polygon - EXACT SAME WIDTH */}
//                     <Grid item xs={6}>
//                       <Button
//                         variant={isDrawing ? "contained" : "outlined"}
//                         fullWidth
//                         size="small"
//                         startIcon={isDrawing ? <Stop /> : <PlayArrow />}
//                         onClick={() =>
//                           isDrawing ? handleStopDrawing() : handleStartDrawing()
//                         }
//                         disabled={!loaded}
//                         sx={{
//                           fontWeight: "bold",
//                           textTransform: "none",
//                           fontSize: "0.7rem",
//                           py: 1,
//                           px: 0.5,
//                           minHeight: 38,
//                           maxHeight: 38,
//                           width: "100%", // EXACT SAME WIDTH
//                           borderRadius: 2,
//                           background: isDrawing
//                             ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
//                             : "transparent",
//                           color: isDrawing ? "white" : "#2196F3",
//                           borderColor: isDrawing ? "#4CAF50" : "#2196F3",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             transform: "translateY(-1px)",
//                             boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)"
//                           }
//                         }}
//                       >
//                         {isDrawing ? "Stop" : "Distance"}
//                       </Button>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <Button
//                         variant={isPolygonDrawing ? "contained" : "outlined"}
//                         fullWidth
//                         size="small"
//                         startIcon={isPolygonDrawing ? <Stop /> : <Crop />}
//                         onClick={() =>
//                           isPolygonDrawing
//                             ? handleStopPolygonDrawing()
//                             : handleStartPolygonDrawing()
//                         }
//                         disabled={!loaded}
//                         sx={{
//                           fontWeight: "bold",
//                           textTransform: "none",
//                           fontSize: "0.7rem",
//                           py: 1,
//                           px: 0.5,
//                           minHeight: 38,
//                           maxHeight: 38,
//                           width: "100%", // EXACT SAME WIDTH
//                           borderRadius: 2,
//                           background: isPolygonDrawing
//                             ? "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
//                             : "transparent",
//                           color: isPolygonDrawing ? "white" : "#9C27B0",
//                           borderColor: "#9C27B0",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             transform: "translateY(-1px)",
//                             boxShadow: "0 4px 12px rgba(156, 39, 176, 0.3)"
//                           }
//                         }}
//                       >
//                         {isPolygonDrawing ? "Stop" : "Polygon"}
//                       </Button>
//                     </Grid>

//                     {/* Row 2: Elevation & Infrastructure - EXACT SAME WIDTH */}
//                     <Grid item xs={6}>
//                       <Button
//                         variant={showElevation ? "contained" : "outlined"}
//                         fullWidth
//                         size="small"
//                         startIcon={showElevation ? <Stop /> : <TrendingUp />}
//                         onClick={handleShowElevation}
//                         disabled={!loaded}
//                         sx={{
//                           fontWeight: "bold",
//                           textTransform: "none",
//                           fontSize: "0.7rem",
//                           py: 1,
//                           px: 0.5,
//                           minHeight: 38,
//                           maxHeight: 38,
//                           width: "100%", // EXACT SAME WIDTH
//                           borderRadius: 2,
//                           background: showElevation
//                             ? "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
//                             : "transparent",
//                           color: showElevation ? "white" : "#FF9800",
//                           borderColor: "#FF9800",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             transform: "translateY(-1px)",
//                             boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)"
//                           }
//                         }}
//                       >
//                         {showElevation ? "Stop" : "Elevation"}
//                       </Button>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <Button
//                         variant={showInfrastructure ? "contained" : "outlined"}
//                         fullWidth
//                         size="small"
//                         startIcon={showInfrastructure ? <Stop /> : <Business />}
//                         onClick={handleShowInfrastructure}
//                         disabled={!loaded}
//                         sx={{
//                           fontWeight: "bold",
//                           textTransform: "none",
//                           fontSize: "0.7rem",
//                           py: 1,
//                           px: 0.5,
//                           minHeight: 38,
//                           maxHeight: 38,
//                           width: "100%", // EXACT SAME WIDTH
//                           borderRadius: 2,
//                           background: showInfrastructure
//                             ? "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"
//                             : "transparent",
//                           color: showInfrastructure ? "white" : "#2196F3",
//                           borderColor: "#2196F3",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             transform: "translateY(-1px)",
//                             boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)"
//                           }
//                         }}
//                       >
//                         {showInfrastructure ? "Stop" : "Infrastructure"}
//                       </Button>
//                     </Grid>

//                     {/* Row 3: History & Clear All - EXACT SAME WIDTH */}
//                     <Grid item xs={6}>
//                       <Button
//                         variant="outlined"
//                         fullWidth
//                         size="small"
//                         startIcon={<History />}
//                         onClick={handleHistory}
//                         disabled={!loaded}
//                         sx={{
//                           fontWeight: "bold",
//                           textTransform: "none",
//                           fontSize: "0.7rem",
//                           py: 1,
//                           px: 0.5,
//                           minHeight: 38,
//                           maxHeight: 38,
//                           width: "100%", // EXACT SAME WIDTH
//                           borderRadius: 2,
//                           borderColor: "#607D8B",
//                           color: "#607D8B",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             backgroundColor: "rgba(96, 125, 139, 0.08)",
//                             transform: "translateY(-1px)"
//                           },
//                           "&:disabled": {
//                             opacity: 0.5
//                           }
//                         }}
//                       >
//                         📂 History
//                       </Button>
//                     </Grid>

//                     <Grid item xs={6}>
//                       <Button
//                         variant="outlined"
//                         fullWidth
//                         size="small"
//                         startIcon={<Clear />}
//                         onClick={handleClearAll}
//                         disabled={
//                           !loaded ||
//                           (points.length === 0 && polygonPoints.length === 0)
//                         }
//                         sx={{
//                           fontWeight: "bold",
//                           textTransform: "none",
//                           fontSize: "0.7rem",
//                           py: 1,
//                           px: 0.5,
//                           minHeight: 38,
//                           maxHeight: 38,
//                           width: "100%", // EXACT SAME WIDTH
//                           borderRadius: 2,
//                           borderColor: "#FF5722",
//                           color: "#FF5722",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             backgroundColor: "rgba(255, 87, 34, 0.08)",
//                             transform: "translateY(-1px)"
//                           },
//                           "&:disabled": {
//                             opacity: 0.5
//                           }
//                         }}
//                       >
//                         🧧 Clear
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </AccordionDetails>
//               </Accordion>

//               {/* 🎯 DATA MANAGER */}
//               <Accordion
//                 defaultExpanded
//                 sx={{
//                   mb: 0.25,
//                   boxShadow: "none",
//                   border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
//                   bgcolor: darkMode ? "#2a2a2a" : "inherit"
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMore />}
//                   sx={{
//                     minHeight: 32,
//                     py: 0.5,
//                     "& .MuiAccordionSummary-content": { margin: "4px 0" }
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle1"
//                     sx={{
//                       fontWeight: "bold",
//                       color: "#1976D2",
//                       fontSize: "0.9rem"
//                     }}
//                   >
//                     🎯 Data Manager
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
//                   <Stack spacing={0.75}>
//                     {/* Save Actions Grid */}
//                     <Box
//                       sx={{
//                         p: 1,
//                         bgcolor: alpha(theme.palette.primary.main, 0.05),
//                         borderRadius: 2
//                       }}
//                     >
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontWeight: "bold",
//                           color: "primary.main",
//                           mb: 1,
//                           fontSize: "0.7rem"
//                         }}
//                       >
//                         💾 Quick Save
//                       </Typography>
//                       <Grid container spacing={0.5}>
//                         <Grid item xs={6}>
//                           <Button
//                             variant={
//                               points.length >= 2 ? "contained" : "outlined"
//                             }
//                             fullWidth
//                             size="small"
//                             startIcon={<Save />}
//                             onClick={handleSaveDistance}
//                             disabled={!loaded || points.length < 2}
//                             sx={{
//                               fontSize: "0.65rem",
//                               py: 0.8,
//                               minHeight: 32,
//                               bgcolor:
//                                 points.length >= 2 ? "#4CAF50" : "transparent",
//                               borderColor: "#4CAF50",
//                               color: points.length >= 2 ? "white" : "#4CAF50",
//                               "&:hover": {
//                                 bgcolor:
//                                   points.length >= 2
//                                     ? "#2E7D32"
//                                     : "rgba(76, 175, 80, 0.08)"
//                               },
//                               "&:disabled": { opacity: 0.3 }
//                             }}
//                           >
//                             Distance
//                           </Button>
//                         </Grid>
//                         <Grid item xs={6}>
//                           <Button
//                             variant={
//                               polygonPoints.length >= 3
//                                 ? "contained"
//                                 : "outlined"
//                             }
//                             fullWidth
//                             size="small"
//                             startIcon={<Save />}
//                             onClick={handleSavePolygon}
//                             disabled={!loaded || polygonPoints.length < 3}
//                             sx={{
//                               fontSize: "0.65rem",
//                               py: 0.8,
//                               minHeight: 32,
//                               bgcolor:
//                                 polygonPoints.length >= 3
//                                   ? "#9C27B0"
//                                   : "transparent",
//                               borderColor: "#9C27B0",
//                               color:
//                                 polygonPoints.length >= 3 ? "white" : "#9C27B0",
//                               "&:hover": {
//                                 bgcolor:
//                                   polygonPoints.length >= 3
//                                     ? "#7B1FA2"
//                                     : "rgba(156, 39, 176, 0.08)"
//                               },
//                               "&:disabled": { opacity: 0.3 }
//                             }}
//                           >
//                             Polygon
//                           </Button>
//                         </Grid>
//                       </Grid>
//                     </Box>

//                     {/* View Saved Data with Modern Tabs */}
//                     <Paper
//                       sx={{
//                         p: 1.5,
//                         bgcolor: "#f8f9fa",
//                         borderRadius: 2,
//                         border: "1px solid #e3f2fd"
//                       }}
//                     >
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontWeight: "bold",
//                           color: "text.primary",
//                           mb: 1.5,
//                           fontSize: "0.7rem",
//                           display: "flex",
//                           alignItems: "center"
//                         }}
//                       >
//                         <Visibility sx={{ mr: 0.5, fontSize: 14 }} />
//                         Saved Data Library
//                       </Typography>

//                       {/* Data Type Toggle */}
//                       <ToggleButtonGroup
//                         value="both"
//                         exclusive
//                         onChange={() => {}}
//                         size="small"
//                         fullWidth
//                         sx={{ mb: 1.5, height: 30 }}
//                       >
//                         <ToggleButton
//                           value="distance"
//                           sx={{ px: 1, py: 0.25, fontSize: "0.65rem", flex: 1 }}
//                         >
//                           📏 Distances
//                         </ToggleButton>
//                         <ToggleButton
//                           value="polygon"
//                           sx={{ px: 1, py: 0.25, fontSize: "0.65rem", flex: 1 }}
//                         >
//                           🔷 Polygons
//                         </ToggleButton>
//                         <ToggleButton
//                           value="both"
//                           sx={{ px: 1, py: 0.25, fontSize: "0.65rem", flex: 1 }}
//                         >
//                           📊 All Data
//                         </ToggleButton>
//                       </ToggleButtonGroup>

//                       {/* View Button */}
//                       <Button
//                         variant="outlined"
//                         fullWidth
//                         size="small"
//                         startIcon={<History />}
//                         onClick={handleHistory}
//                         disabled={!loaded}
//                         sx={{
//                           fontWeight: "bold",
//                           textTransform: "none",
//                           fontSize: "0.7rem",
//                           py: 1,
//                           borderRadius: 2,
//                           borderColor: "#1976D2",
//                           color: "#1976D2",
//                           background:
//                             "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             background:
//                               "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.15) 100%)",
//                             transform: "translateY(-1px)",
//                             boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)"
//                           },
//                           "&:disabled": {
//                             opacity: 0.5
//                           }
//                         }}
//                       >
//                         🔍 Browse & Manage Saved Data
//                       </Button>

//                       <Typography
//                         variant="caption"
//                         sx={{
//                           display: "block",
//                           textAlign: "center",
//                           color: "text.secondary",
//                           mt: 0.75,
//                           fontSize: "0.6rem",
//                           fontStyle: "italic"
//                         }}
//                       >
//                         Load, edit, delete, and export your measurements
//                       </Typography>
//                     </Paper>
//                   </Stack>
//                 </AccordionDetails>
//               </Accordion>

//               {/* 📎 UNITS & EXPORT */}
//               <Accordion
//                 sx={{
//                   mb: 0.25,
//                   boxShadow: "none",
//                   border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
//                   bgcolor: darkMode ? "#2a2a2a" : "inherit"
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMore />}
//                   sx={{
//                     minHeight: 32,
//                     py: 0.5,
//                     "& .MuiAccordionSummary-content": { margin: "4px 0" }
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle1"
//                     sx={{
//                       fontWeight: "bold",
//                       color: "#1976D2",
//                       fontSize: "0.9rem"
//                     }}
//                   >
//                     📏 Units & Export
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
//                   <Stack spacing={1}>
//                     {/* Unit Toggle */}
//                     <Paper
//                       sx={{
//                         p: 1,
//                         bgcolor: alpha(theme.palette.info.main, 0.05),
//                         borderRadius: 2
//                       }}
//                     >
//                       <Stack
//                         direction="row"
//                         alignItems="center"
//                         justifyContent="space-between"
//                       >
//                         <Typography
//                           variant="body2"
//                           sx={{ fontWeight: "bold", color: "info.main" }}
//                         >
//                           📏 Measurement Units
//                         </Typography>
//                         <ToggleButtonGroup
//                           value={selectedUnit}
//                           exclusive
//                           onChange={(e, newUnit) => {
//                             if (newUnit) {
//                               setSelectedUnit(newUnit);
//                               console.log(`📏 Units changed to: ${newUnit}`);
//                             }
//                           }}
//                           size="small"
//                           sx={{ height: 28 }}
//                         >
//                           <ToggleButton
//                             value="metric"
//                             sx={{ px: 1, py: 0.5, fontSize: "0.7rem" }}
//                           >
//                             Metric
//                           </ToggleButton>
//                           <ToggleButton
//                             value="imperial"
//                             sx={{ px: 1, py: 0.5, fontSize: "0.7rem" }}
//                           >
//                             Imperial
//                           </ToggleButton>
//                         </ToggleButtonGroup>
//                       </Stack>
//                       <Typography
//                         variant="caption"
//                         sx={{ color: "text.secondary", fontSize: "0.65rem" }}
//                       >
//                         Distance: km/m • Area: km²/m²
//                       </Typography>
//                     </Paper>

//                     {/* Export Options */}
//                     <ButtonGroup variant="outlined" fullWidth size="small">
//                       <Button
//                         startIcon={<Download />}
//                         onClick={() => {
//                           const exportData = {
//                             timestamp: new Date().toISOString(),
//                             measurements: {
//                               distance: {
//                                 value: totalDistance,
//                                 formatted: `${(totalDistance / 1000).toFixed(
//                                   2
//                                 )} km`,
//                                 points: points.length
//                               },
//                               area: {
//                                 value: polygonArea,
//                                 formatted: `${(polygonArea / 1000000).toFixed(
//                                   2
//                                 )} km²`,
//                                 points: polygonPoints.length
//                               }
//                             },
//                             coordinates: points.concat(polygonPoints),
//                             metadata: {
//                               layers: activeLayers,
//                               baseMap: selectedBaseMap
//                             }
//                           };
//                           const blob = new Blob(
//                             [JSON.stringify(exportData, null, 2)],
//                             { type: "application/json" }
//                           );
//                           const url = URL.createObjectURL(blob);
//                           const a = document.createElement("a");
//                           a.href = url;
//                           a.download = `gis-export-${Date.now()}.json`;
//                           a.click();
//                           URL.revokeObjectURL(url);
//                         }}
//                         sx={{ fontSize: "0.7rem" }}
//                       >
//                         JSON
//                       </Button>
//                       <Button
//                         startIcon={<Upload />}
//                         onClick={() => {
//                           const csvHeader =
//                             "Type,Name,Latitude,Longitude,Value,Unit\n";
//                           const csvRows = [];
//                           points.forEach((point, index) => {
//                             csvRows.push(
//                               `Distance,Point ${index + 1},${point.lat},${
//                                 point.lng
//                               },${totalDistance},meters`
//                             );
//                           });
//                           polygonPoints.forEach((point, index) => {
//                             csvRows.push(
//                               `Polygon,Point ${index + 1},${point.lat},${
//                                 point.lng
//                               },${polygonArea},square_meters`
//                             );
//                           });
//                           const csvContent = csvHeader + csvRows.join("\n");
//                           const blob = new Blob([csvContent], {
//                             type: "text/csv"
//                           });
//                           const url = URL.createObjectURL(blob);
//                           const a = document.createElement("a");
//                           a.href = url;
//                           a.download = `gis-coordinates-${Date.now()}.csv`;
//                           a.click();
//                           URL.revokeObjectURL(url);
//                         }}
//                         sx={{ fontSize: "0.7rem" }}
//                       >
//                         CSV
//                       </Button>
//                     </ButtonGroup>
//                   </Stack>
//                 </AccordionDetails>
//               </Accordion>

//               {/* 🗺️ BASE MAPS - Compact Version */}
//               <Accordion
//                 defaultExpanded
//                 sx={{
//                   mb: 0.25,
//                   boxShadow: "none",
//                   border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
//                   bgcolor: darkMode ? "#2a2a2a" : "inherit"
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMore />}
//                   sx={{
//                     minHeight: 28,
//                     py: 0.25,
//                     "& .MuiAccordionSummary-content": { margin: "2px 0" }
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle1"
//                     sx={{
//                       fontWeight: "bold",
//                       color: "#1976D2",
//                       fontSize: "0.85rem"
//                     }}
//                   >
//                     🗺️ Base Maps
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
//                   <ToggleButtonGroup
//                     value={selectedBaseMap}
//                     exclusive
//                     onChange={(e, newMap) => {
//                       if (newMap) setSelectedBaseMap(newMap);
//                     }}
//                     orientation="vertical"
//                     fullWidth
//                     size="small"
//                   >
//                     {baseMaps.map((map) => (
//                       <ToggleButton
//                         key={map.id}
//                         value={map.id}
//                         sx={{
//                           justifyContent: "flex-start",
//                           textAlign: "left",
//                           py: 0.5,
//                           minHeight: 32,
//                           border: "1px solid #e0e0e0 !important",
//                           "&.Mui-selected": {
//                             bgcolor: alpha(theme.palette.primary.main, 0.1),
//                             borderColor: `${theme.palette.primary.main} !important`
//                           }
//                         }}
//                       >
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             width: "100%"
//                           }}
//                         >
//                           <Typography sx={{ mr: 1, fontSize: "1rem" }}>
//                             {map.icon}
//                           </Typography>
//                           <Box sx={{ textAlign: "left" }}>
//                             <Typography
//                               variant="body2"
//                               fontWeight="bold"
//                               textTransform="none"
//                               sx={{ fontSize: "0.75rem" }}
//                             >
//                               {map.name}
//                             </Typography>
//                             <Typography
//                               variant="caption"
//                               color="text.secondary"
//                               textTransform="none"
//                               sx={{ fontSize: "0.6rem" }}
//                             >
//                               {map.description}
//                             </Typography>
//                           </Box>
//                         </Box>
//                       </ToggleButton>
//                     ))}
//                   </ToggleButtonGroup>
//                 </AccordionDetails>
//               </Accordion>

//               {/* 🐛 DEBUG CONTROLS */}
//               <Accordion
//                 sx={{
//                   mb: 0.25,
//                   boxShadow: "none",
//                   border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
//                   bgcolor: darkMode ? "#2a2a2a" : "inherit"
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMore />}
//                   sx={{
//                     minHeight: 32,
//                     py: 0.5,
//                     "& .MuiAccordionSummary-content": { margin: "4px 0" }
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle1"
//                     sx={{
//                       fontWeight: "bold",
//                       color: "#1976D2",
//                       fontSize: "0.9rem"
//                     }}
//                   >
//                     🐛 Debug Tools
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
//                   <Stack direction="row" spacing={0.5}>
//                     <Button
//                       variant={showDebugLogs ? "contained" : "outlined"}
//                       fullWidth
//                       size="small"
//                       startIcon={showDebugLogs ? <Visibility /> : <Code />}
//                       onClick={() => {
//                         setShowDebugLogs(!showDebugLogs);
//                         console.log(
//                           `🐛 Debug logs ${
//                             !showDebugLogs ? "enabled" : "disabled"
//                           }`
//                         );
//                       }}
//                       sx={{
//                         textTransform: "none",
//                         fontSize: "0.7rem",
//                         py: 1,
//                         borderRadius: 2,
//                         borderColor: showDebugLogs ? "#4CAF50" : "#6c757d",
//                         color: showDebugLogs ? "white" : "#6c757d",
//                         backgroundColor: showDebugLogs
//                           ? "#4CAF50"
//                           : "transparent",
//                         "&:hover": {
//                           backgroundColor: showDebugLogs
//                             ? "#388E3C"
//                             : "rgba(108, 117, 125, 0.1)",
//                           borderColor: showDebugLogs ? "#388E3C" : "#495057"
//                         }
//                       }}
//                     >
//                       {showDebugLogs ? "Hide Logs" : "Show Logs"}
//                     </Button>
//                   </Stack>
//                 </AccordionDetails>
//               </Accordion>

//               {/* 📖 BOOKMARKS */}
//               <Accordion
//                 defaultExpanded
//                 sx={{
//                   mb: 0.25,
//                   boxShadow: "none",
//                   border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
//                   bgcolor: darkMode ? "#2a2a2a" : "inherit"
//                 }}
//               >
//                 <AccordionSummary
//                   expandIcon={<ExpandMore />}
//                   sx={{
//                     minHeight: 32,
//                     py: 0.5,
//                     "& .MuiAccordionSummary-content": { margin: "4px 0" }
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle1"
//                     sx={{
//                       fontWeight: "bold",
//                       color: "#1976D2",
//                       fontSize: "0.9rem"
//                     }}
//                   >
//                     🔖 Quick Bookmarks ({bookmarks.length})
//                   </Typography>
//                 </AccordionSummary>
//                 <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
//                   <Stack spacing={1}>
//                     {/* Add Current Location Button */}
//                     <Button
//                       variant="outlined"
//                       fullWidth
//                       size="small"
//                       startIcon={<Place />}
//                       onClick={() => {
//                         // Add current center point as bookmark using live coordinates
//                         const newBookmark = {
//                           id: Date.now(),
//                           name: `Location ${bookmarks.length + 1}`,
//                           coords: {
//                             lat: liveCoordinates.lat,
//                             lng: liveCoordinates.lng
//                           },
//                           timestamp: new Date().toLocaleString(),
//                           zoom: mapZoom
//                         };
//                         setBookmarks((prev) => [...prev, newBookmark]);
//                         console.log(
//                           `🔖 Bookmark saved at: ${liveCoordinates.lat.toFixed(
//                             6
//                           )}, ${liveCoordinates.lng.toFixed(6)}`
//                         );
//                       }}
//                       sx={{
//                         textTransform: "none",
//                         fontSize: "0.7rem",
//                         py: 0.8,
//                         borderColor: "#4CAF50",
//                         color: "#4CAF50",
//                         "&:hover": {
//                           backgroundColor: "rgba(76, 175, 80, 0.08)",
//                           borderColor: "#2E7D32"
//                         }
//                       }}
//                     >
//                       Add Current View
//                     </Button>

//                     {bookmarks.length === 0 ? (
//                       <Paper
//                         sx={{
//                           p: 2,
//                           bgcolor: alpha(theme.palette.info.main, 0.05),
//                           borderRadius: 2,
//                           textAlign: "center"
//                         }}
//                       >
//                         <Bookmark
//                           sx={{ fontSize: 32, color: "info.main", mb: 1 }}
//                         />
//                         <Typography variant="body2" color="text.secondary">
//                           No bookmarks yet. Click "Add Current View" to save
//                           locations.
//                         </Typography>
//                       </Paper>
//                     ) : (
//                       <Stack spacing={0.5}>
//                         {bookmarks.map((bookmark) => (
//                           <Paper
//                             key={bookmark.id}
//                             variant="outlined"
//                             sx={{
//                               p: 1,
//                               borderRadius: 2,
//                               cursor: "pointer",
//                               transition: "all 0.2s ease",
//                               "&:hover": {
//                                 bgcolor: alpha(
//                                   theme.palette.primary.main,
//                                   0.05
//                                 ),
//                                 borderColor: "primary.main",
//                                 transform: "translateY(-1px)",
//                                 boxShadow: "0 2px 8px rgba(33, 150, 243, 0.2)"
//                               }
//                             }}
//                             onClick={() => {
//                               console.log(
//                                 `🎯 Navigating to bookmark: ${bookmark.name}`
//                               );
//                               console.log(
//                                 `🗺 Coordinates: ${bookmark.coords.lat}, ${bookmark.coords.lng}`
//                               );
//                               // Navigate to the exact bookmark location
//                               if (workingMapRef.current?.map) {
//                                 workingMapRef.current.map.panTo(
//                                   bookmark.coords
//                                 );
//                                 workingMapRef.current.map.setZoom(
//                                   bookmark.zoom || 12
//                                 );
//                                 console.log(
//                                   `✅ Map navigated to bookmark location`
//                                 );
//                               } else {
//                                 console.error(
//                                   "❌ WorkingMapRef not available for navigation"
//                                 );
//                               }
//                             }}
//                           >
//                             <Stack
//                               direction="row"
//                               alignItems="center"
//                               spacing={1}
//                             >
//                               <Bookmark color="primary" sx={{ fontSize: 16 }} />
//                               <Box sx={{ flex: 1, minWidth: 0 }}>
//                                 <Typography
//                                   variant="body2"
//                                   fontWeight="medium"
//                                   noWrap
//                                 >
//                                   {bookmark.name}
//                                 </Typography>
//                                 <Typography
//                                   variant="caption"
//                                   color="text.secondary"
//                                   sx={{ fontSize: "0.65rem" }}
//                                 >
//                                   {bookmark.coords.lat.toFixed(4)}°,{" "}
//                                   {bookmark.coords.lng.toFixed(4)}°
//                                 </Typography>
//                               </Box>
//                               <Stack direction="row" spacing={0.5}>
//                                 <Tooltip title="Edit bookmark">
//                                   <IconButton
//                                     size="small"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleEditBookmark(bookmark);
//                                     }}
//                                     sx={{
//                                       color: "primary.main",
//                                       opacity: 0.7,
//                                       "&:hover": { opacity: 1 }
//                                     }}
//                                   >
//                                     <Settings sx={{ fontSize: 14 }} />
//                                   </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title="Delete bookmark">
//                                   <IconButton
//                                     size="small"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleDeleteBookmark(bookmark);
//                                     }}
//                                     sx={{
//                                       color: "error.main",
//                                       opacity: 0.7,
//                                       "&:hover": { opacity: 1 }
//                                     }}
//                                   >
//                                     <Clear sx={{ fontSize: 14 }} />
//                                   </IconButton>
//                                 </Tooltip>
//                               </Stack>
//                             </Stack>
//                           </Paper>
//                         ))}
//                       </Stack>
//                     )}
//                   </Stack>
//                 </AccordionDetails>
//               </Accordion>
//             </Box>
//           </Drawer>
//         </Slide>

//         {/* Main Map Area */}
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 1,
//             display: "flex",
//             position: "relative",
//             ml: leftSidebarOpen ? 0 : `-${leftDrawerWidth}px`,
//             mr: rightSidebarOpen ? `${rightDrawerWidth}px` : 0,
//             transition: theme.transitions.create(["margin"], {
//               easing: theme.transitions.easing.sharp,
//               duration: theme.transitions.duration.leavingScreen
//             }),
//             overflow: "hidden"
//           }}
//         >
//           {/* Enhanced Map with Integrated Search */}
//           <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
//             <WorkingMeasurementMap
//               ref={workingMapRef}
//               hideControls={true}
//               hideHeader={true}
//               isDrawing={isDrawing}
//               isPolygonDrawing={isPolygonDrawing}
//               showElevation={showElevation}
//               showInfrastructure={showInfrastructure}
//               selectedBaseMap={selectedBaseMap}
//               onDrawingChange={setIsDrawing}
//               onPolygonDrawingChange={setIsPolygonDrawing}
//               onPointsChange={setPoints}
//               onPolygonPointsChange={setPolygonPoints}
//               onTotalDistanceChange={setTotalDistance}
//               onPolygonAreaChange={setPolygonArea}
//               onCoordinatesChange={setLiveCoordinates}
//               onZoomChange={setMapZoom}
//               onLogsChange={setDebugLogs}
//               onMouseCoordinatesChange={setMouseCoordinates}
//               showDebugLogs={showDebugLogs}
//             />
//           </Box>

//           {/* Map Controls Overlay - Toggle with sidebar */}
//           {!leftSidebarOpen && (
//             <Fade in={!leftSidebarOpen}>
//               <Paper
//                 sx={{
//                   position: "absolute",
//                   top: 16,
//                   right: 16,
//                   borderRadius: 2,
//                   overflow: "hidden",
//                   bgcolor: "rgba(255,255,255,0.95)",
//                   backdropFilter: "blur(10px)",
//                   zIndex: 1200
//                 }}
//               >
//                 <Stack spacing={0}>
//                   <Tooltip title="Zoom In" placement="left">
//                     <IconButton size="small" onClick={handleZoomIn}>
//                       <ZoomIn />
//                     </IconButton>
//                   </Tooltip>
//                   <Divider />
//                   <Tooltip title="Zoom Out" placement="left">
//                     <IconButton size="small" onClick={handleZoomOut}>
//                       <ZoomOut />
//                     </IconButton>
//                   </Tooltip>
//                   <Divider />
//                   <Tooltip title="My Location" placement="left">
//                     <IconButton size="small" onClick={handleMyLocation}>
//                       <MyLocation />
//                     </IconButton>
//                   </Tooltip>
//                   <Divider />
//                   <Tooltip title="Center on India" placement="left">
//                     <IconButton size="small" onClick={handleCenterIndia}>
//                       <CenterFocusStrong />
//                     </IconButton>
//                   </Tooltip>
//                   <Divider />
//                   <Tooltip title="Fullscreen" placement="left">
//                     <IconButton size="small" onClick={handleFullscreen}>
//                       <Fullscreen />
//                     </IconButton>
//                   </Tooltip>
//                 </Stack>
//               </Paper>
//             </Fade>
//           )}

//           {/* Enhanced Distance & Area Panel - Bottom Center */}
//           {(totalDistance > 0 || polygonArea > 0) && (
//             <Paper
//               sx={{
//                 position: "absolute",
//                 bottom: 80,
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 p: 2,
//                 bgcolor: darkMode
//                   ? "rgba(0, 0, 0, 0.9)"
//                   : "rgba(255, 255, 255, 0.98)",
//                 color: darkMode ? "#fff" : "inherit",
//                 backdropFilter: "blur(20px)",
//                 zIndex: 1000,
//                 border: `2px solid ${
//                   totalDistance > 0
//                     ? "rgba(76, 175, 80, 0.8)"
//                     : "rgba(156, 39, 176, 0.8)"
//                 }`,
//                 borderRadius: 3,
//                 boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
//                 minWidth: 280
//               }}
//             >
//               <Stack spacing={1}>
//                 <Stack
//                   direction="row"
//                   alignItems="center"
//                   spacing={1}
//                   justifyContent="center"
//                 >
//                   <Straighten sx={{ fontSize: 20, color: "success.main" }} />
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: "bold", color: "success.main" }}
//                   >
//                     Live Measurements
//                   </Typography>
//                 </Stack>

//                 {totalDistance > 0 && (
//                   <Box
//                     sx={{
//                       textAlign: "center",
//                       p: 1,
//                       bgcolor: darkMode
//                         ? "rgba(25, 118, 210, 0.1)"
//                         : "rgba(25, 118, 210, 0.05)",
//                       borderRadius: 2
//                     }}
//                   >
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         fontSize: "0.8rem",
//                         color: "primary.main",
//                         fontWeight: "bold"
//                       }}
//                     >
//                       DISTANCE
//                     </Typography>
//                     <Typography
//                       variant="h5"
//                       sx={{
//                         fontWeight: "bold",
//                         color: "primary.main",
//                         fontFamily: "monospace"
//                       }}
//                     >
//                       {formatDistance(totalDistance)}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       sx={{ fontSize: "0.7rem", opacity: 0.7 }}
//                     >
//                       {points.length} measurement points
//                     </Typography>
//                   </Box>
//                 )}

//                 {polygonArea > 0 && (
//                   <Box
//                     sx={{
//                       textAlign: "center",
//                       p: 1,
//                       bgcolor: darkMode
//                         ? "rgba(156, 39, 176, 0.1)"
//                         : "rgba(156, 39, 176, 0.05)",
//                       borderRadius: 2
//                     }}
//                   >
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         fontSize: "0.8rem",
//                         color: "secondary.main",
//                         fontWeight: "bold"
//                       }}
//                     >
//                       AREA
//                     </Typography>
//                     <Typography
//                       variant="h5"
//                       sx={{
//                         fontWeight: "bold",
//                         color: "secondary.main",
//                         fontFamily: "monospace"
//                       }}
//                     >
//                       {formatArea(polygonArea)}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       sx={{ fontSize: "0.7rem", opacity: 0.7 }}
//                     >
//                       {polygonPoints.length} polygon vertices
//                     </Typography>
//                   </Box>
//                 )}

//                 <Stack direction="row" spacing={1} justifyContent="center">
//                   <Chip
//                     label={`Unit: ${
//                       selectedUnit === "metric" ? "Metric" : "Imperial"
//                     }`}
//                     size="small"
//                     variant="outlined"
//                     sx={{ fontSize: "0.7rem", height: 24 }}
//                   />
//                   <Chip
//                     label="Real-time"
//                     size="small"
//                     color="success"
//                     sx={{ fontSize: "0.7rem", height: 24 }}
//                   />
//                 </Stack>
//               </Stack>
//             </Paper>
//           )}

//           {/* Scale Bar - Bottom Left */}
//           <Paper
//             sx={{
//               position: "absolute",
//               bottom: 16,
//               left: 16,
//               p: 1,
//               bgcolor: darkMode
//                 ? "rgba(0, 0, 0, 0.85)"
//                 : "rgba(255, 255, 255, 0.95)",
//               color: darkMode ? "#fff" : "inherit",
//               zIndex: 1000,
//               borderRadius: 2
//             }}
//           >
//             <Typography variant="caption" sx={{ fontWeight: "bold" }}>
//               {getMapScale(mapZoom)}
//             </Typography>
//           </Paper>

//           {/* Live Coordinates and Zoom Display - Top Right */}
//           <Paper
//             sx={{
//               position: "absolute",
//               top: 80,
//               right: 16,
//               p: 1,
//               bgcolor: darkMode
//                 ? "rgba(0, 0, 0, 0.85)"
//                 : "rgba(255, 255, 255, 0.95)",
//               color: darkMode ? "#fff" : "inherit",
//               zIndex: 1000,
//               borderRadius: 2,
//               minWidth: 200
//             }}
//           >
//             <Typography
//               variant="caption"
//               sx={{ fontWeight: "bold", display: "block" }}
//             >
//               📍 Map Center
//             </Typography>
//             <Typography
//               variant="caption"
//               sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
//             >
//               Lat: {liveCoordinates.lat.toFixed(6)}°
//             </Typography>
//             <br />
//             <Typography
//               variant="caption"
//               sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
//             >
//               Lng: {liveCoordinates.lng.toFixed(6)}°
//             </Typography>
//             <br />
//             <Typography
//               variant="caption"
//               sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
//             >
//               🔍 Zoom: {mapZoom}
//             </Typography>
//             {hoverCoordinates && (
//               <>
//                 <br />
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     fontWeight: "bold",
//                     display: "block",
//                     mt: 1,
//                     color: "primary.main"
//                   }}
//                 >
//                   💁 Mouse Position
//                 </Typography>
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     fontFamily: "monospace",
//                     fontSize: "0.75rem",
//                     color: "primary.main"
//                   }}
//                 >
//                   Lat: {hoverCoordinates.lat.toFixed(6)}°
//                 </Typography>
//                 <br />
//                 <Typography
//                   variant="caption"
//                   sx={{
//                     fontFamily: "monospace",
//                     fontSize: "0.75rem",
//                     color: "primary.main"
//                   }}
//                 >
//                   Lng: {hoverCoordinates.lng.toFixed(6)}°
//                 </Typography>
//               </>
//             )}
//           </Paper>

//           {/* Debug Logs Overlay - Always show when enabled */}
//           {showDebugLogs && (
//             <Paper
//               sx={{
//                 position: "absolute",
//                 top: 16,
//                 left: 16,
//                 maxWidth: 400,
//                 maxHeight: 300,
//                 p: 1,
//                 bgcolor: "rgba(0, 0, 0, 0.85)",
//                 color: "#00FF00",
//                 zIndex: 1000,
//                 borderRadius: 2,
//                 fontFamily: "monospace",
//                 border: "1px solid #333"
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   mb: 1,
//                   borderBottom: "1px solid #333",
//                   pb: 0.5
//                 }}
//               >
//                 <Typography
//                   variant="caption"
//                   sx={{ color: "#00FF00", fontWeight: "bold" }}
//                 >
//                   🐛 DEBUG LOGS ({debugLogs.length})
//                 </Typography>
//                 <IconButton
//                   size="small"
//                   onClick={() => setShowDebugLogs(false)}
//                   sx={{ color: "#FF5722", p: 0.25 }}
//                 >
//                   <Close sx={{ fontSize: 14 }} />
//                 </IconButton>
//               </Box>
//               <Box
//                 sx={{
//                   maxHeight: 250,
//                   overflow: "auto",
//                   fontSize: "0.7rem",
//                   lineHeight: 1.2,
//                   "&::-webkit-scrollbar": {
//                     width: 4
//                   },
//                   "&::-webkit-scrollbar-track": {
//                     background: "#1a1a1a"
//                   },
//                   "&::-webkit-scrollbar-thumb": {
//                     background: "#333",
//                     borderRadius: 2
//                   }
//                 }}
//               >
//                 {debugLogs.length === 0 ? (
//                   <Typography
//                     variant="caption"
//                     sx={{ color: "#666", fontStyle: "italic" }}
//                   >
//                     📝 No debug logs yet...
//                   </Typography>
//                 ) : (
//                   debugLogs.slice(-20).map((log, index) => (
//                     <Typography
//                       key={`debug-log-${
//                         debugLogs.length - 20 + index
//                       }-${index}`}
//                       variant="caption"
//                       sx={{
//                         display: "block",
//                         color: log.includes("❌")
//                           ? "#FF5722"
//                           : log.includes("⚠️")
//                           ? "#FF9800"
//                           : log.includes("✅")
//                           ? "#4CAF50"
//                           : "#00FF00",
//                         fontSize: "0.7rem",
//                         fontFamily: "monospace",
//                         lineHeight: 1.3,
//                         mb: 0.25
//                       }}
//                     >
//                       {log}
//                     </Typography>
//                   ))
//                 )}
//               </Box>
//             </Paper>
//           )}

//           {/* Full-width Elevation Chart Overlay */}
//           {showElevationChart && (
//             <Paper
//               sx={{
//                 position: "absolute",
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 height: 300,
//                 bgcolor: darkMode
//                   ? "rgba(0, 0, 0, 0.95)"
//                   : "rgba(255, 255, 255, 0.98)",
//                 color: darkMode ? "#fff" : "inherit",
//                 zIndex: 1500,
//                 borderTopLeftRadius: 16,
//                 borderTopRightRadius: 16,
//                 boxShadow: "0 -8px 32px rgba(0,0,0,0.3)",
//                 backdropFilter: "blur(20px)"
//               }}
//             >
//               <Box sx={{ p: 2, height: "100%" }}>
//                 <Stack
//                   direction="row"
//                   alignItems="center"
//                   justifyContent="space-between"
//                   sx={{ mb: 2 }}
//                 >
//                   <Stack direction="row" alignItems="center" spacing={2}>
//                     <TrendingUp sx={{ fontSize: 24, color: "primary.main" }} />
//                     <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                       Elevation Profile
//                     </Typography>
//                     <Chip
//                       label={`${elevationData.length} Points`}
//                       size="small"
//                       color="primary"
//                       variant="outlined"
//                     />
//                   </Stack>

//                   <Stack direction="row" spacing={1}>
//                     <Chip
//                       label={`Distance: ${
//                         elevationData.length > 0
//                           ? formatDistance(
//                               elevationData[elevationData.length - 1]
//                                 ?.distance || 0
//                             )
//                           : "0"
//                       }`}
//                       size="small"
//                       sx={{
//                         bgcolor: darkMode
//                           ? "rgba(25, 118, 210, 0.2)"
//                           : "rgba(25, 118, 210, 0.1)"
//                       }}
//                     />
//                     <Chip
//                       label={`Max Elevation: ${Math.max(
//                         ...elevationData.map((d) => d.elevation)
//                       )}m`}
//                       size="small"
//                       sx={{
//                         bgcolor: darkMode
//                           ? "rgba(76, 175, 80, 0.2)"
//                           : "rgba(76, 175, 80, 0.1)"
//                       }}
//                     />
//                     <IconButton
//                       size="small"
//                       onClick={() => {
//                         setShowElevationChart(false);
//                         setShowElevation(false);
//                         setElevationMarkers([]);
//                         setElevationData([]);
//                       }}
//                       sx={{ color: "text.secondary" }}
//                     >
//                       <Close />
//                     </IconButton>
//                   </Stack>
//                 </Stack>

//                 {/* Simple ASCII-style elevation chart */}
//                 <Box
//                   sx={{
//                     height: 200,
//                     bgcolor: darkMode ? "#1a1a1a" : "#f5f5f5",
//                     borderRadius: 2,
//                     p: 2,
//                     border: darkMode ? "1px solid #333" : "1px solid #ddd",
//                     display: "flex",
//                     alignItems: "end",
//                     justifyContent: "space-between"
//                   }}
//                 >
//                   {elevationData.map((point, index) => {
//                     const maxElevation = Math.max(
//                       ...elevationData.map((d) => d.elevation)
//                     );
//                     const minElevation = Math.min(
//                       ...elevationData.map((d) => d.elevation)
//                     );
//                     const heightPercentage =
//                       ((point.elevation - minElevation) /
//                         (maxElevation - minElevation)) *
//                       100;

//                     return (
//                       <Box
//                         key={index}
//                         sx={{
//                           width: `calc(100% / ${elevationData.length})`,
//                           height: `${Math.max(heightPercentage, 5)}%`,
//                           bgcolor: `hsl(${
//                             120 - heightPercentage * 0.8
//                           }, 70%, 50%)`,
//                           mx: 0.1,
//                           borderRadius: "2px 2px 0 0",
//                           position: "relative",
//                           cursor: "pointer",
//                           transition: "all 0.2s",
//                           "&:hover": {
//                             transform: "scaleX(2)",
//                             zIndex: 10,
//                             bgcolor: "primary.main"
//                           }
//                         }}
//                         title={`Distance: ${formatDistance(
//                           point.distance
//                         )}, Elevation: ${point.elevation}m`}
//                       />
//                     );
//                   })}
//                 </Box>

//                 <Stack
//                   direction="row"
//                   justifyContent="space-between"
//                   sx={{ mt: 1, fontSize: "0.8rem", color: "text.secondary" }}
//                 >
//                   <Typography>Start</Typography>
//                   <Typography>
//                     Distance:{" "}
//                     {elevationData.length > 0
//                       ? formatDistance(
//                           elevationData[elevationData.length - 1]?.distance || 0
//                         )
//                       : "0"}
//                   </Typography>
//                   <Typography>End</Typography>
//                 </Stack>
//               </Box>
//             </Paper>
//           )}
//         </Box>

//         {/* Enhanced Right Sidebar with Smooth Animation */}
//         <Slide
//           direction="left"
//           in={rightSidebarOpen}
//           mountOnEnter
//           unmountOnExit
//         >
//           <Drawer
//             variant="persistent"
//             anchor="right"
//             open={rightSidebarOpen}
//             sx={{
//               width: rightDrawerWidth,
//               flexShrink: 0,
//               position: "absolute",
//               right: 0,
//               top: 0,
//               bottom: 0,
//               "& .MuiDrawer-paper": {
//                 position: "absolute",
//                 width: rightDrawerWidth,
//                 boxSizing: "border-box",
//                 bgcolor: darkMode ? "#1a1a1a" : "#ffffff",
//                 color: darkMode ? "#ffffff" : "inherit",
//                 borderLeft: `1px solid ${darkMode ? "#333" : "#e3f2fd"}`,
//                 boxShadow: darkMode
//                   ? "-2px 0 12px rgba(0,0,0,0.5)"
//                   : "-2px 0 12px rgba(0,0,0,0.1)",
//                 top: "64px",
//                 height: "calc(100vh - 64px)",
//                 margin: 0
//               }
//             }}
//           >
//             {/* Right Sidebar Header */}
//             <Box
//               sx={{
//                 p: 1,
//                 background: `linear-gradient(135deg, ${
//                   darkMode ? "rgb(156,39,176)" : "#9C27B0"
//                 } 0%, ${darkMode ? "rgb(123,31,162)" : "#7B1FA2"} 100%)`,
//                 color: "white",
//                 textAlign: "center",
//                 borderBottom: `1px solid ${darkMode ? "grey.700" : "#e3f2fd"}`
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
//               >
//                 ⚙️ Advanced Settings
//               </Typography>
//               <Chip
//                 label="Pro Tools"
//                 size="small"
//                 sx={{
//                   mt: 0.25,
//                   bgcolor: "rgba(255,255,255,0.2)",
//                   color: "white",
//                   fontSize: "0.6rem",
//                   height: "18px"
//                 }}
//               />
//             </Box>

//             <Box sx={{ p: 1.5, overflow: "auto" }}>
//               {/* Theme Controls */}
//               <Paper
//                 sx={{
//                   p: 1.5,
//                   mb: 2,
//                   borderRadius: 2,
//                   bgcolor: darkMode ? "#2a2a2a" : "inherit",
//                   border: darkMode ? "1px solid #333" : "none"
//                 }}
//               >
//                 <Typography
//                   variant="subtitle2"
//                   sx={{ fontWeight: "bold", mb: 1.5 }}
//                 >
//                   🎨 Appearance
//                 </Typography>
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={darkMode}
//                       onChange={() => setDarkMode(!darkMode)}
//                     />
//                   }
//                   label="Dark Mode"
//                 />
//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={compactMode}
//                       onChange={() => setCompactMode(!compactMode)}
//                     />
//                   }
//                   label="Compact Layout"
//                 />
//               </Paper>

//               {/* Debug Information */}
//               <Paper
//                 sx={{
//                   p: 1.5,
//                   mb: 2,
//                   borderRadius: 2,
//                   bgcolor: darkMode ? "#2a2a2a" : "inherit",
//                   border: darkMode ? "1px solid #333" : "none"
//                 }}
//               >
//                 <Typography
//                   variant="subtitle2"
//                   sx={{ fontWeight: "bold", mb: 1.5 }}
//                 >
//                   🐛 Debug Information
//                 </Typography>
//                 <Stack spacing={1}>
//                   <Box>
//                     <Typography variant="caption" color="text.secondary">
//                       Points:
//                     </Typography>
//                     <Typography variant="body2">
//                       {points.length} active
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography variant="caption" color="text.secondary">
//                       Polygon Points:
//                     </Typography>
//                     <Typography variant="body2">
//                       {polygonPoints.length} active
//                     </Typography>
//                   </Box>
//                   <Box>
//                     <Typography variant="caption" color="text.secondary">
//                       Map Zoom:
//                     </Typography>
//                     <Typography variant="body2">{mapZoom}</Typography>
//                   </Box>
//                   <Box>
//                     <Typography variant="caption" color="text.secondary">
//                       Coordinates:
//                     </Typography>
//                     <Typography variant="caption" fontFamily="monospace">
//                       {liveCoordinates.lat.toFixed(6)},{" "}
//                       {liveCoordinates.lng.toFixed(6)}
//                     </Typography>
//                   </Box>
//                 </Stack>
//               </Paper>

//               {/* Quick Actions */}
//               <Paper
//                 sx={{
//                   p: 1.5,
//                   borderRadius: 2,
//                   bgcolor: darkMode ? "#2a2a2a" : "inherit",
//                   border: darkMode ? "1px solid #333" : "none"
//                 }}
//               >
//                 <Typography
//                   variant="subtitle2"
//                   sx={{ fontWeight: "bold", mb: 1.5 }}
//                 >
//                   ⚡ Quick Actions
//                 </Typography>
//                 <Stack spacing={1}>
//                   <Button
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     startIcon={<CenterFocusStrong />}
//                     onClick={handleCenterOnIndia}
//                     sx={{ textTransform: "none" }}
//                   >
//                     Center on India
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     startIcon={<Clear />}
//                     onClick={handleClearAll}
//                     disabled={points.length === 0 && polygonPoints.length === 0}
//                     sx={{ textTransform: "none" }}
//                   >
//                     Clear All Data
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     fullWidth
//                     size="small"
//                     startIcon={<History />}
//                     onClick={handleHistory}
//                     sx={{ textTransform: "none" }}
//                   >
//                     View History
//                   </Button>
//                 </Stack>
//               </Paper>
//             </Box>
//           </Drawer>
//         </Slide>
//       </Box>

//       {/* Save Distance Dialog */}
//       <Dialog
//         open={saveDialogOpen}
//         onClose={() => setSaveDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
//             color: "white",
//             fontWeight: "bold"
//           }}
//         >
//           💾 Save Distance Measurement
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <TextField
//             autoFocus
//             fullWidth
//             label="Measurement Name"
//             variant="outlined"
//             value={measurementName}
//             onChange={(e) => setMeasurementName(e.target.value)}
//             placeholder={`Distance Measurement ${Date.now()}`}
//             sx={{ mb: 2 }}
//           />
//         </DialogContent>
//         <DialogActions sx={{ p: 3, gap: 2 }}>
//           <Button
//             onClick={() => setSaveDialogOpen(false)}
//             variant="outlined"
//             sx={{ borderRadius: 2, px: 3 }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={confirmSaveDistance}
//             variant="contained"
//             sx={{
//               borderRadius: 2,
//               px: 3,
//               background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)"
//               }
//             }}
//           >
//             Save Measurement
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Save Polygon Dialog */}
//       <Dialog
//         open={polygonSaveDialogOpen}
//         onClose={() => setPolygonSaveDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
//             color: "white",
//             fontWeight: "bold"
//           }}
//         >
//           💾 Save Polygon Area
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <TextField
//             autoFocus
//             fullWidth
//             label="Polygon Name"
//             variant="outlined"
//             value={polygonName}
//             onChange={(e) => setPolygonName(e.target.value)}
//             placeholder={`Polygon Area ${Date.now()}`}
//             sx={{ mb: 2 }}
//           />
//         </DialogContent>
//         <DialogActions sx={{ p: 3, gap: 2 }}>
//           <Button
//             onClick={() => setPolygonSaveDialogOpen(false)}
//             variant="outlined"
//             sx={{ borderRadius: 2, px: 3 }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={confirmSavePolygon}
//             variant="contained"
//             sx={{
//               borderRadius: 2,
//               px: 3,
//               background: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #7B1FA2 0%, #4A148C 100%)"
//               }
//             }}
//           >
//             Save Polygon
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bookmark Edit Dialog */}
//       <Dialog
//         open={bookmarkEditDialogOpen}
//         onClose={() => setBookmarkEditDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
//             color: "white",
//             fontWeight: "bold"
//           }}
//         >
//           🔖 Edit Bookmark
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <TextField
//             autoFocus
//             fullWidth
//             label="Bookmark Name"
//             variant="outlined"
//             value={editedBookmarkName}
//             onChange={(e) => setEditedBookmarkName(e.target.value)}
//             placeholder="Enter bookmark name"
//             sx={{ mb: 2 }}
//           />
//         </DialogContent>
//         <DialogActions sx={{ p: 3, gap: 2 }}>
//           <Button
//             onClick={() => setBookmarkEditDialogOpen(false)}
//             variant="outlined"
//             sx={{ borderRadius: 2, px: 3 }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSaveBookmarkEdit}
//             variant="contained"
//             disabled={!editedBookmarkName.trim()}
//             sx={{
//               borderRadius: 2,
//               px: 3,
//               background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)"
//               }
//             }}
//           >
//             Save Changes
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bookmark Delete Confirmation Dialog */}
//       <Dialog
//         open={bookmarkDeleteDialogOpen}
//         onClose={() => setBookmarkDeleteDialogOpen(false)}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle
//           sx={{
//             background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
//             color: "white",
//             fontWeight: "bold"
//           }}
//         >
//           🗑️ Delete Bookmark
//         </DialogTitle>
//         <DialogContent sx={{ pt: 3 }}>
//           <Typography variant="body1" sx={{ mb: 2 }}>
//             Are you sure you want to delete this bookmark?
//           </Typography>
//           {bookmarkToDelete && (
//             <Paper
//               sx={{ p: 2, bgcolor: "rgba(244, 67, 54, 0.1)", borderRadius: 2 }}
//             >
//               <Typography
//                 variant="h6"
//                 color="primary"
//                 sx={{ fontWeight: "bold" }}
//               >
//                 {bookmarkToDelete.name}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {bookmarkToDelete.coords.lat.toFixed(6)}°,{" "}
//                 {bookmarkToDelete.coords.lng.toFixed(6)}°
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Created: {bookmarkToDelete.timestamp}
//               </Typography>
//             </Paper>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ p: 3, gap: 2 }}>
//           <Button
//             onClick={() => setBookmarkDeleteDialogOpen(false)}
//             variant="outlined"
//             sx={{ borderRadius: 2, px: 3 }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={confirmDeleteBookmark}
//             variant="contained"
//             sx={{
//               borderRadius: 2,
//               px: 3,
//               background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)"
//               }
//             }}
//           >
//             Delete Bookmark
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default GISProfessionalDashboard;

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Card,
  CardContent,
  Badge,
  IconButton,
  Tooltip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  ListItemSecondaryAction,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ButtonGroup,
  Grid,
  AppBar,
  Toolbar,
  InputAdornment,
  Fade,
  Slide,
  Collapse,
  Fab,
  Grow
} from "@mui/material";
import {
  PanTool,
  CropFree,
  Timeline,
  Straighten,
  Business,
  TrendingUp,
  Place,
  Layers,
  Map as MapIcon,
  Satellite,
  Terrain,
  LayersClear,
  Bookmark,
  Settings,
  Fullscreen,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  MyLocation,
  PlayArrow,
  Stop,
  Crop,
  Clear,
  Save,
  History,
  ExpandMore,
  Visibility,
  Upload,
  Download,
  BugReport,
  Code,
  LocationOn,
  Delete,
  Close,
  Search,
  ChevronLeft,
  ChevronRight,
  Public,
  BorderAll,
  Menu,
  MoreVert,
  Brightness4,
  Brightness7,
  Undo,
  Redo
} from "@mui/icons-material";
import WorkingMeasurementMap from "./WorkingMeasurementMap";
import MapSearchBox from "./MapSearchBox";

const GISProfessionalDashboard = () => {
  const theme = useTheme();
  const [activeDrawingTool, setActiveDrawingTool] = useState("pan");
  const [activeLayers, setActiveLayers] = useState({
    boundaries: true,
    roads: false,
    buildings: false,
    terrain: false,
    infrastructure: true
  });
  const [selectedBaseMap, setSelectedBaseMap] = useState("satellite");
  const [bookmarks, setBookmarks] = useState([
    { id: 1, name: "Delhi Metro Area", coords: { lat: 28.6139, lng: 77.209 } },
    { id: 2, name: "Mumbai Central", coords: { lat: 19.076, lng: 72.8777 } },
    { id: 3, name: "Bangalore IT Hub", coords: { lat: 12.9716, lng: 77.5946 } }
  ]);

  // Enhanced UI state
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showIndiaBoundary, setShowIndiaBoundary] = useState(false);
  const [compactMode, setCompactMode] = useState(true);

  // Compact sidebar width for more map space
  const leftDrawerWidth = 250; // Reduced from 280
  const rightDrawerWidth = 320;

  // State for actual WorkingMeasurementMap functionality
  /* The above code is using React hooks to manage state in a functional component. Here is a breakdown
of what each useState hook is doing: */
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPolygonDrawing, setIsPolygonDrawing] = useState(false);
  const [showElevation, setShowElevation] = useState(false);
  const [elevationMarkers, setElevationMarkers] = useState([]);
  const [showElevationChart, setShowElevationChart] = useState(false);
  const [elevationData, setElevationData] = useState([]);
  const [showInfrastructure, setShowInfrastructure] = useState(false);
  const [points, setPoints] = useState([]);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [loaded, setLoaded] = useState(true);

  // Additional states for functionality
  /* The above code snippet is using React's `useState` hook to manage state in a functional component.
 It initializes multiple state variables with their initial values: */
  const [totalDistance, setTotalDistance] = useState(0);
  const [polygonArea, setPolygonArea] = useState(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [polygonSaveDialogOpen, setPolygonSaveDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [measurementName, setMeasurementName] = useState("");
  const [polygonName, setPolygonName] = useState("");
  const [savedPolygons, setSavedPolygons] = useState([]);
  const [savedDataTab, setSavedDataTab] = useState("distance");
  const [polygonDialogOpen, setPolygonDialogOpen] = useState(false);
  const [polygonHistoryDialogOpen, setPolygonHistoryDialogOpen] =
    useState(false);

  // Live coordinates state
  const [liveCoordinates, setLiveCoordinates] = useState({
    lat: 20.5937,
    lng: 78.9629
  });
  const [mapZoom, setMapZoom] = useState(6);
  const [mouseCoordinates, setMouseCoordinates] = useState(null);
  const [hoverCoordinates, setHoverCoordinates] = useState(null);

  // Units and export state
  const [selectedUnit, setSelectedUnit] = useState("metric");

  // Debug logs state
  const [debugLogs, setDebugLogs] = useState([]);
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  // Undo/Redo state management
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [actionHistory, setActionHistory] = useState([]);

  // 2. Add useEffect to load polygons from localStorage (reload when polygonSaveDialogOpen closes):
  useEffect(() => {
    const polygons = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("polygon_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          polygons.push({ key, ...data });
        } catch {}
      }
    }
    setSavedPolygons(
      polygons
        .sort(
          (a, b) =>
            new Date(b.date || b.timestamp || 0) -
            new Date(a.date || a.timestamp || 0)
        )
        .reverse()
    );
  }, [polygonDialogOpen]);

  // Save current state to history
  const saveToHistory = (action, data) => {
    const newState = {
      points: [...points],
      polygonPoints: [...polygonPoints],
      bookmarks: [...bookmarks],
      action,
      timestamp: Date.now(),
      data
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Limit history to 50 items
    if (newHistory.length > 50) {
      setHistory(newHistory.slice(-50));
      setHistoryIndex(49);
    }
  };

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      setPoints(previousState.points);
      setPolygonPoints(previousState.polygonPoints);
      setBookmarks(previousState.bookmarks);
      setHistoryIndex(historyIndex - 1);
      addLog(`↶ Undid: ${previousState.action}`);
    }
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setPoints(nextState.points);
      setPolygonPoints(nextState.polygonPoints);
      setBookmarks(nextState.bookmarks);
      setHistoryIndex(historyIndex + 1);
      addLog(`↷ Redid: ${nextState.action}`);
    }
  };

  // Bookmark editing state
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [bookmarkEditDialogOpen, setBookmarkEditDialogOpen] = useState(false);
  const [editedBookmarkName, setEditedBookmarkName] = useState("");
  const [bookmarkDeleteDialogOpen, setBookmarkDeleteDialogOpen] =
    useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);

  // Ref to access child component functions
  const workingMapRef = useRef(null);

  const baseMaps = [
    {
      id: "satellite",
      name: "SATELLITE",
      description: "HIGH RESOLUTION SATELLITE IMAGERY",
      icon: "🛰️"
    },
    {
      id: "street",
      name: "STREET MAP",
      description: "DETAILED STREET AND ROAD NETWORK",
      icon: "🗺️"
    },
    {
      id: "terrain",
      name: "TERRAIN",
      description: "TOPOGRAPHIC AND ELEVATION DATA",
      icon: "🏔️"
    }
  ];

  const handleLayerToggle = (layerName) => {
    const newValue = !activeLayers[layerName];
    setActiveLayers((prev) => ({
      ...prev,
      [layerName]: newValue
    }));

    // Pass layer changes to WorkingMeasurementMap
    if (workingMapRef.current && workingMapRef.current.toggleLayer) {
      workingMapRef.current.toggleLayer(layerName, newValue);
    }

    console.log(`🌍 Layer ${layerName} toggled to: ${newValue}`);
  };

  const activeLayersCount = Object.values(activeLayers).filter(Boolean).length;

  // Real functionality handlers
  const handleStartDrawing = () => {
    if (workingMapRef.current && workingMapRef.current.startDrawing) {
      saveToHistory("Start Distance Drawing", { isDrawing: true });
      setIsDrawing(true);
      setIsPolygonDrawing(false);
      workingMapRef.current.startDrawing();
      addLog("📏 Started distance measurement");
    }
  };

  const handleStopDrawing = () => {
    if (workingMapRef.current && workingMapRef.current.stopDrawing) {
      setIsDrawing(false);
      workingMapRef.current.stopDrawing();
    }
  };

  const handleStartPolygonDrawing = () => {
    console.log("📐 Dashboard handleStartPolygonDrawing called");
    if (workingMapRef.current && workingMapRef.current.startPolygonDrawing) {
      console.log("✅ Starting polygon drawing...");
      setIsPolygonDrawing(true);
      setIsDrawing(false);
      workingMapRef.current.startPolygonDrawing();
    } else {
      console.error("❌ workingMapRef or startPolygonDrawing not available");
    }
  };

  const handleStopPolygonDrawing = () => {
    console.log("⏹️ Dashboard handleStopPolygonDrawing called");
    if (workingMapRef.current && workingMapRef.current.stopPolygonDrawing) {
      console.log("✅ Stopping polygon drawing...");
      setIsPolygonDrawing(false);
      workingMapRef.current.stopPolygonDrawing();
    } else {
      console.error("❌ workingMapRef or stopPolygonDrawing not available");
    }
  };

  const handleClearAll = () => {
    if (workingMapRef.current && workingMapRef.current.clearAll) {
      saveToHistory("Clear All Data", { cleared: true });
      workingMapRef.current.clearAll();
      setPoints([]);
      setPolygonPoints([]);
      setIsDrawing(false);
      setIsPolygonDrawing(false);
      setTotalDistance(0);
      setPolygonArea(0);
      addLog("✂️ Cleared all measurements and data");
    }
  };

  const handleShowElevation = () => {
    const newValue = !showElevation;
    console.log(
      `🏔️ Dashboard handleShowElevation called: ${showElevation} -> ${newValue}`
    );

    if (newValue) {
      // Starting elevation mode - clear previous markers and enable marker placement
      setElevationMarkers([]);
      setShowElevationChart(false);
      setElevationData([]);
      addLog("🏔️ Elevation mode activated - Click two points on the map");
      saveToHistory("Start Elevation Mode", { showElevation: true });
    } else {
      // Stopping elevation mode
      setElevationMarkers([]);
      setShowElevationChart(false);
      setElevationData([]);
      addLog("🔴 Elevation mode deactivated");
    }

    setShowElevation(newValue);
    if (workingMapRef.current && workingMapRef.current.setShowElevation) {
      console.log("✅ Calling workingMapRef setShowElevation");
      workingMapRef.current.setShowElevation(newValue);
    } else {
      console.error("❌ workingMapRef or setShowElevation not available");
    }
  };

  // Handle elevation marker placement
  const handleElevationMarkerAdd = (marker) => {
    const newMarkers = [...elevationMarkers, marker];
    setElevationMarkers(newMarkers);

    addLog(`📍 Elevation marker ${newMarkers.length} placed`);

    // When we have 2 markers, generate elevation profile
    if (newMarkers.length === 2) {
      generateElevationProfile(newMarkers);
    }
  };

  // Generate elevation profile between two points
  const generateElevationProfile = async (markers) => {
    try {
      // Mock elevation data generation (replace with real elevation API)
      const elevationPoints = [];
      const steps = 50;

      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;
        const lat = markers[0].lat + (markers[1].lat - markers[0].lat) * ratio;
        const lng = markers[0].lng + (markers[1].lng - markers[0].lng) * ratio;

        // Mock elevation calculation (replace with real API call)
        const elevation =
          Math.random() * 1000 + 100 + Math.sin(ratio * Math.PI * 4) * 200;
        const distance = ratio * calculateDistance(markers[0], markers[1]);

        elevationPoints.push({
          lat,
          lng,
          elevation: Math.round(elevation),
          distance: Math.round(distance),
          index: i
        });
      }

      setElevationData(elevationPoints);
      setShowElevationChart(true);
      addLog(
        `📈 Generated elevation profile with ${elevationPoints.length} data points`
      );
    } catch (error) {
      console.error("Error generating elevation profile:", error);
      addLog("❌ Failed to generate elevation profile");
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (point1, point2) => {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = (point1.lat * Math.PI) / 180;
    const lat2Rad = (point2.lat * Math.PI) / 180;
    const deltaLatRad = ((point2.lat - point1.lat) * Math.PI) / 180;
    const deltaLngRad = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLngRad / 2) *
        Math.sin(deltaLngRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  /**
   * The function `handleShowInfrastructure` toggles the visibility of infrastructure on a map and
   * updates the state accordingly.
   */
  const handleShowInfrastructure = () => {
    const newValue = !showInfrastructure;
    setShowInfrastructure(newValue);
    if (workingMapRef.current && workingMapRef.current.setShowInfrastructure) {
      workingMapRef.current.setShowInfrastructure(newValue);
    }
  };

  /**
   * The `handleHistory` function logs messages and interacts with `workingMapRef` to load saved
   * measurements and open a history dialog if available.
   */

  const handleHistory = () => {
    console.log("📂 History button clicked");
    if (workingMapRef.current) {
      console.log("✅ WorkingMapRef is available");

      // Load the saved measurements first
      if (workingMapRef.current.loadSavedMeasurements) {
        console.log("🔄 Calling loadSavedMeasurements");
        workingMapRef.current.loadSavedMeasurements();
      }

      // Open the history dialog
      if (workingMapRef.current.setHistoryDialogOpen) {
        console.log("📋 Opening history dialog");
        workingMapRef.current.setHistoryDialogOpen(true);
      }
    } else {
      console.error("❌ WorkingMapRef not available");
    }
  };

  /**
   * The function `handleSaveDistance` sets the state to open a save dialog.
   */
  const handleSaveDistance = () => {
    setSaveDialogOpen(true);
  };

  /**
   * The function `handleSavePolygon` logs a message and sets a state to open a polygon save dialog.
   */
  const handleSavePolygon = () => {
    console.log("💾 Opening polygon save dialog...");
    setPolygonSaveDialogOpen(true);
  };

  /**
   * The function `confirmSaveDistance` saves a measurement on a map and closes a dialog box.
   */
  const confirmSaveDistance = () => {
    if (workingMapRef.current && workingMapRef.current.saveMeasurement) {
      workingMapRef.current.saveMeasurement(
        measurementName || `Measurement ${Date.now()}`
      );
    }
    setSaveDialogOpen(false);
    setMeasurementName("");
  };

  const confirmSavePolygon = () => {
    console.log("✅ Confirming polygon save with name:", polygonName);
    if (workingMapRef.current && workingMapRef.current.savePolygonData) {
      workingMapRef.current.savePolygonData(
        polygonName || `Polygon ${Date.now()}`
      );
      console.log("✅ Polygon save function called");
    } else {
      console.error("❌ workingMapRef or savePolygonData not available");
    }
    setPolygonSaveDialogOpen(false);
    setPolygonName("");
  };

  // Map control handlers
  const handleZoomIn = () => {
    if (workingMapRef.current?.zoomIn) {
      workingMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (workingMapRef.current?.zoomOut) {
      workingMapRef.current.zoomOut();
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (workingMapRef.current?.map) {
            workingMapRef.current.map.setCenter({
              lat: latitude,
              lng: longitude
            });
            workingMapRef.current.map.setZoom(15);
          }
        },
        (error) => {
          console.warn("Location not available:", error);
        }
      );
    }
  };

  const handleCenterIndia = () => {
    if (workingMapRef.current?.centerOnIndia) {
      workingMapRef.current.centerOnIndia();
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleIndiaBoundaryToggle = () => {
    const newValue = !showIndiaBoundary;
    setShowIndiaBoundary(newValue);
    if (workingMapRef.current?.showIndiaBoundary) {
      workingMapRef.current.showIndiaBoundary(newValue);
    }
    console.log(`🇮🇳 India boundary ${newValue ? "enabled" : "disabled"}`);
  };

  const handleCenterOnIndia = () => {
    if (workingMapRef.current?.centerOnIndia) {
      workingMapRef.current.centerOnIndia();
    }
    console.log("🗺️ Centered map on India");
  };

  // Unit conversion functions
  const formatDistance = (meters) => {
    if (selectedUnit === "imperial") {
      const miles = meters * 0.000621371;
      return miles >= 1
        ? `${miles.toFixed(2)} mi`
        : `${(meters * 3.28084).toFixed(0)} ft`;
    } else {
      return meters >= 1000
        ? `${(meters / 1000).toFixed(2)} km`
        : `${meters.toFixed(0)} m`;
    }
  };

  const formatArea = (squareMeters) => {
    if (selectedUnit === "imperial") {
      const squareMiles = squareMeters * 0.000000386102;
      return squareMiles >= 1
        ? `${squareMiles.toFixed(2)} mi²`
        : `${(squareMeters * 10.7639).toFixed(0)} ft²`;
    } else {
      return squareMeters >= 1000000
        ? `${(squareMeters / 1000000).toFixed(2)} km²`
        : `${squareMeters.toFixed(0)} m²`;
    }
  };

  // Calculate dynamic scale based on zoom level
  const getMapScale = (zoom) => {
    // Approximate scale calculation based on zoom level
    const earthCircumference = 40075000; // Earth's circumference in meters
    const pixelsAtZoom = 256 * Math.pow(2, zoom);
    const metersPerPixel = earthCircumference / pixelsAtZoom;
    const scaleDistance = metersPerPixel * 100; // 100 pixels scale

    if (selectedUnit === "imperial") {
      const feet = scaleDistance * 3.28084;
      const miles = scaleDistance * 0.000621371;
      return miles >= 1 ? `${miles.toFixed(2)} mi` : `${feet.toFixed(0)} ft`;
    } else {
      return scaleDistance >= 1000
        ? `${(scaleDistance / 1000).toFixed(2)} km`
        : `${scaleDistance.toFixed(0)} m`;
    }
  };

  const handleStreetView = () => {
    if (workingMapRef.current?.toggleStreetView) {
      workingMapRef.current.toggleStreetView();
    }
  };

  // Bookmark handlers
  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setEditedBookmarkName(bookmark.name);
    setBookmarkEditDialogOpen(true);
  };

  const handleSaveBookmarkEdit = () => {
    if (editingBookmark && editedBookmarkName.trim()) {
      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === editingBookmark.id
            ? { ...b, name: editedBookmarkName.trim() }
            : b
        )
      );
      setBookmarkEditDialogOpen(false);
      setEditingBookmark(null);
      setEditedBookmarkName("");
      console.log(`🌎 Bookmark renamed to: ${editedBookmarkName}`);
    }
  };

  const handleDeleteBookmark = (bookmark) => {
    setBookmarkToDelete(bookmark);
    setBookmarkDeleteDialogOpen(true);
  };

  const confirmDeleteBookmark = () => {
    if (bookmarkToDelete) {
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkToDelete.id));
      setBookmarkDeleteDialogOpen(false);
      setBookmarkToDelete(null);
      console.log(`🗑️ Bookmark deleted: ${bookmarkToDelete.name}`);
    }
  };

  // Add log function for debugging and user feedback
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);

    setDebugLogs((prev) => {
      const newLogs = [...prev.slice(-49), logEntry]; // Keep last 50 logs
      return newLogs;
    });
  };

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [historyIndex, history]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: darkMode ? "grey.900" : "#f8f9fa",
        transition: "background-color 0.3s ease"
      }}
    >
      {/* Enhanced Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: darkMode ? "grey.900" : "primary.main",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important" }}>
          <IconButton
            color="inherit"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <Menu />
          </IconButton>

          <MapIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" component="div" sx={{ mr: 2 }}>
            GIS Professional
          </Typography>
          <Chip
            label="Pro"
            size="small"
            color="secondary"
            sx={{ mr: 3, fontWeight: "bold" }}
          />

          {/* Enhanced Search Bar */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search places in India..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "rgba(255,255,255,0.7)" }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "rgba(255,255,255,0.15)",
                color: "white",
                borderRadius: "25px",
                "& fieldset": { border: "none" },
                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                "&.Mui-focused": { bgcolor: "rgba(255,255,255,0.25)" }
              }
            }}
            sx={{
              width: 350,
              mr: "auto",
              "& input::placeholder": { color: "rgba(255,255,255,0.7)" }
            }}
          />

          {/* Action Buttons */}
          <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
            <Tooltip title="Center on India">
              <Button
                startIcon={<CenterFocusStrong />}
                onClick={handleCenterOnIndia}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)"
                }}
              >
                Center
              </Button>
            </Tooltip>
          </ButtonGroup>

          {/* Undo/Redo Controls */}
          <ButtonGroup variant="outlined" sx={{ mr: 2 }}>
            <Tooltip title="Undo (Ctrl+Z)">
              <Button
                startIcon={<Undo />}
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                  minWidth: "auto",
                  px: 1
                }}
              >
                Undo
              </Button>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Y)">
              <Button
                startIcon={<Redo />}
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                sx={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.3)",
                  minWidth: "auto",
                  px: 1
                }}
              >
                Redo
              </Button>
            </Tooltip>
          </ButtonGroup>

          <Tooltip title="Toggle Theme">
            <IconButton
              color="inherit"
              onClick={() => setDarkMode(!darkMode)}
              sx={{ mr: 1 }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Right Panel">
            <IconButton
              color="inherit"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, pt: "64px" }}>
        {/* Enhanced Left Sidebar */}
        <Slide
          direction="right"
          in={leftSidebarOpen}
          mountOnEnter
          unmountOnExit
        >
          <Drawer
            variant="persistent"
            anchor="left"
            open={leftSidebarOpen}
            sx={{
              width: leftDrawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: leftDrawerWidth,
                boxSizing: "border-box",
                bgcolor: darkMode ? "#1a1a1a" : "#ffffff",
                color: darkMode ? "#ffffff" : "inherit",
                borderRight: `1px solid ${darkMode ? "#333" : "#e3f2fd"}`,
                boxShadow: darkMode
                  ? "2px 0 12px rgba(0,0,0,0.5)"
                  : "2px 0 12px rgba(0,0,0,0.1)",
                top: "64px",
                height: "calc(100vh - 64px)"
              }
            }}
          >
            {/* Compact Header */}
            <Box
              sx={{
                p: 1,
                background: `linear-gradient(135deg, ${
                  darkMode ? "rgb(63,81,181)" : "#1976D2"
                } 0%, ${darkMode ? "rgb(48,63,159)" : "#1565C0"} 100%)`,
                color: "white",
                textAlign: "center",
                borderBottom: `1px solid ${darkMode ? "grey.700" : "#e3f2fd"}`
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
              >
                📍 Professional Tools
              </Typography>
              <Chip
                label={`${activeLayersCount} Active`}
                size="small"
                sx={{
                  mt: 0.25,
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontSize: "0.6rem",
                  height: "18px"
                }}
              />
            </Box>

            <Box sx={{ p: 1, overflow: "auto", height: "calc(100vh - 140px)" }}>
              {/* Compact Stats Bar */}
              <Paper
                sx={{
                  p: 0.5,
                  mb: 0.5,
                  bgcolor: darkMode
                    ? "rgba(66, 165, 245, 0.1)"
                    : alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                  border: darkMode ? "1px solid #333" : "none"
                }}
              >
                <Grid container spacing={0.5}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          color: "#1976D2"
                        }}
                      >
                        {activeLayersCount}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
                        Layers
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          color: "#1976D2"
                        }}
                      >
                        {points.length}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
                        Points
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          color: "#1976D2"
                        }}
                      >
                        {polygonPoints.length}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
                        Polygon
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* 🛠️ PROFESSIONAL TOOLS */}
              <Accordion
                defaultExpanded
                sx={{
                  mb: 0.25,
                  boxShadow: "none",
                  border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
                  bgcolor: darkMode ? "#2a2a2a" : "inherit"
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    minHeight: 28,
                    py: 0.25,
                    "& .MuiAccordionSummary-content": { margin: "2px 0" }
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#1976D2",
                      fontSize: "0.85rem"
                    }}
                  >
                    🛐️ Professional Tools
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
                  <Grid container spacing={0.5}>
                    {/* Row 1: Distance & Polygon - EXACT SAME WIDTH */}
                    <Grid item xs={6}>
                      <Button
                        variant={isDrawing ? "contained" : "outlined"}
                        fullWidth
                        size="small"
                        startIcon={isDrawing ? <Stop /> : <PlayArrow />}
                        onClick={() =>
                          isDrawing ? handleStopDrawing() : handleStartDrawing()
                        }
                        disabled={!loaded}
                        sx={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "0.7rem",
                          py: 1,
                          px: 0.5,
                          minHeight: 38,
                          maxHeight: 38,
                          width: "100%", // EXACT SAME WIDTH
                          borderRadius: 2,
                          background: isDrawing
                            ? "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)"
                            : "transparent",
                          color: isDrawing ? "white" : "#2196F3",
                          borderColor: isDrawing ? "#4CAF50" : "#2196F3",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)"
                          }
                        }}
                      >
                        {isDrawing ? "Stop" : "Distance"}
                      </Button>
                    </Grid>

                    <Grid item xs={6}>
                      <Button
                        variant={isPolygonDrawing ? "contained" : "outlined"}
                        fullWidth
                        size="small"
                        startIcon={isPolygonDrawing ? <Stop /> : <Crop />}
                        onClick={() =>
                          isPolygonDrawing
                            ? handleStopPolygonDrawing()
                            : handleStartPolygonDrawing()
                        }
                        disabled={!loaded}
                        sx={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "0.7rem",
                          py: 1,
                          px: 0.5,
                          minHeight: 38,
                          maxHeight: 38,
                          width: "100%", // EXACT SAME WIDTH
                          borderRadius: 2,
                          background: isPolygonDrawing
                            ? "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
                            : "transparent",
                          color: isPolygonDrawing ? "white" : "#9C27B0",
                          borderColor: "#9C27B0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(156, 39, 176, 0.3)"
                          }
                        }}
                      >
                        {isPolygonDrawing ? "Stop" : "Polygon"}
                      </Button>
                    </Grid>

                    {/* Row 2: Elevation & Infrastructure - EXACT SAME WIDTH */}
                    <Grid item xs={6}>
                      <Button
                        variant={showElevation ? "contained" : "outlined"}
                        fullWidth
                        size="small"
                        startIcon={showElevation ? <Stop /> : <TrendingUp />}
                        onClick={handleShowElevation}
                        disabled={!loaded}
                        sx={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "0.7rem",
                          py: 1,
                          px: 0.5,
                          minHeight: 38,
                          maxHeight: 38,
                          width: "100%", // EXACT SAME WIDTH
                          borderRadius: 2,
                          background: showElevation
                            ? "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
                            : "transparent",
                          color: showElevation ? "white" : "#FF9800",
                          borderColor: "#FF9800",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)"
                          }
                        }}
                      >
                        {showElevation ? "Stop" : "Elevation"}
                      </Button>
                    </Grid>

                    <Grid item xs={6}>
                      <Button
                        variant={showInfrastructure ? "contained" : "outlined"}
                        fullWidth
                        size="small"
                        startIcon={showInfrastructure ? <Stop /> : <Business />}
                        onClick={handleShowInfrastructure}
                        disabled={!loaded}
                        sx={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "0.7rem",
                          py: 1,
                          px: 0.5,
                          minHeight: 38,
                          maxHeight: 38,
                          width: "100%", // EXACT SAME WIDTH
                          borderRadius: 2,
                          background: showInfrastructure
                            ? "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"
                            : "transparent",
                          color: showInfrastructure ? "white" : "#2196F3",
                          borderColor: "#2196F3",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)"
                          }
                        }}
                      >
                        {showInfrastructure ? "Stop" : "Infrastructure"}
                      </Button>
                    </Grid>

                    {/* Row 3: History & Clear All - EXACT SAME WIDTH */}
                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        startIcon={<History />}
                        onClick={handleHistory}
                        disabled={!loaded}
                        sx={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "0.7rem",
                          py: 1,
                          px: 0.5,
                          minHeight: 38,
                          maxHeight: 38,
                          width: "100%", // EXACT SAME WIDTH
                          borderRadius: 2,
                          borderColor: "#607D8B",
                          color: "#607D8B",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(96, 125, 139, 0.08)",
                            transform: "translateY(-1px)"
                          },
                          "&:disabled": {
                            opacity: 0.5
                          }
                        }}
                      >
                        📂 History
                      </Button>
                    </Grid>

                    <Grid item xs={6}>
                      <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        startIcon={<Clear />}
                        onClick={handleClearAll}
                        disabled={
                          !loaded ||
                          (points.length === 0 && polygonPoints.length === 0)
                        }
                        sx={{
                          fontWeight: "bold",
                          textTransform: "none",
                          fontSize: "0.7rem",
                          py: 1,
                          px: 0.5,
                          minHeight: 38,
                          maxHeight: 38,
                          width: "100%", // EXACT SAME WIDTH
                          borderRadius: 2,
                          borderColor: "#FF5722",
                          color: "#FF5722",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(255, 87, 34, 0.08)",
                            transform: "translateY(-1px)"
                          },
                          "&:disabled": {
                            opacity: 0.5
                          }
                        }}
                      >
                        🧧 Clear
                      </Button>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* 🎯 DATA MANAGER */}
              <Accordion
                defaultExpanded
                sx={{
                  mb: 0.25,
                  boxShadow: "none",
                  border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
                  bgcolor: darkMode ? "#2a2a2a" : "inherit"
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    minHeight: 32,
                    py: 0.5,
                    "& .MuiAccordionSummary-content": { margin: "4px 0" }
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#1976D2",
                      fontSize: "0.9rem"
                    }}
                  >
                    🎯 Data Manager
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
                  <Stack spacing={0.75}>
                    {/* Save Actions Grid */}
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: 2
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color: "primary.main",
                          mb: 1,
                          fontSize: "0.7rem"
                        }}
                      >
                        💾 Quick Save
                      </Typography>
                      <Grid container spacing={0.5}>
                        <Grid item xs={6}>
                          <Button
                            variant={
                              points.length >= 2 ? "contained" : "outlined"
                            }
                            fullWidth
                            size="small"
                            startIcon={<Save />}
                            onClick={handleSaveDistance}
                            disabled={!loaded || points.length < 2}
                            sx={{
                              fontSize: "0.65rem",
                              py: 0.8,
                              minHeight: 32,
                              bgcolor:
                                points.length >= 2 ? "#4CAF50" : "transparent",
                              borderColor: "#4CAF50",
                              color: points.length >= 2 ? "white" : "#4CAF50",
                              "&:hover": {
                                bgcolor:
                                  points.length >= 2
                                    ? "#2E7D32"
                                    : "rgba(76, 175, 80, 0.08)"
                              },
                              "&:disabled": { opacity: 0.3 }
                            }}
                          >
                            Distance
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            variant={
                              polygonPoints.length >= 3
                                ? "contained"
                                : "outlined"
                            }
                            fullWidth
                            size="small"
                            startIcon={<Save />}
                            onClick={handleSavePolygon}
                            disabled={!loaded || polygonPoints.length < 3}
                            sx={{
                              fontSize: "0.65rem",
                              py: 0.8,
                              minHeight: 32,
                              bgcolor:
                                polygonPoints.length >= 3
                                  ? "#9C27B0"
                                  : "transparent",
                              borderColor: "#9C27B0",
                              color:
                                polygonPoints.length >= 3 ? "white" : "#9C27B0",
                              "&:hover": {
                                bgcolor:
                                  polygonPoints.length >= 3
                                    ? "#7B1FA2"
                                    : "rgba(156, 39, 176, 0.08)"
                              },
                              "&:disabled": { opacity: 0.3 }
                            }}
                          >
                            Polygon
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* View Saved Data with Modern Tabs */}
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: "#f8f9fa",
                        borderRadius: 2,
                        border: "1px solid #e3f2fd"
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          color: "text.primary",
                          mb: 1.5,
                          fontSize: "0.7rem",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <Visibility sx={{ mr: 0.5, fontSize: 14 }} />
                        Saved Data Library
                      </Typography>

                      {/* Data Type Toggle */}
                      <ToggleButtonGroup
                        value={savedDataTab}
                        exclusive
                        onChange={(_, val) => val && setSavedDataTab(val)}
                        size="small"
                        fullWidth
                        sx={{ mb: 1.5, height: 30 }}
                      >
                        <ToggleButton
                          value="distance"
                          sx={{ px: 1, py: 0.25, fontSize: "0.65rem", flex: 1 }}
                        >
                          📏 Distances
                        </ToggleButton>
                        <ToggleButton
                          value="polygon"
                          sx={{ px: 1, py: 0.25, fontSize: "0.65rem", flex: 1 }}
                        >
                          🔷 Polygons
                        </ToggleButton>
                      </ToggleButtonGroup>

                      {/* Show button and list for selected tab */}
                      {savedDataTab === "distance" && (
                        <>
                          <Button
                            variant="outlined"
                            fullWidth
                            size="small"
                            startIcon={<History />}
                            onClick={handleHistory}
                            disabled={!loaded}
                            sx={{
                              fontWeight: "bold",
                              textTransform: "none",
                              fontSize: "0.7rem",
                              py: 1,
                              borderRadius: 2,
                              borderColor: "#1976D2",
                              color: "#1976D2",
                              background:
                                "linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.15) 100%)",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)"
                              },
                              "&:disabled": {
                                opacity: 0.5
                              }
                            }}
                          >
                            View Saved Measurements
                          </Button>
                        </>
                      )}

                      {savedDataTab === "polygon" && (
                        <>
                          <Button
                            variant="outlined"
                            fullWidth
                            size="small"
                            startIcon={<Visibility />}
                            disabled={savedPolygons.length === 0}
                            sx={{
                              fontWeight: "bold",
                              textTransform: "none",
                              fontSize: "0.7rem",
                              py: 1,
                              borderRadius: 2,
                              borderColor: "#9C27B0",
                              color: "#9C27B0",
                              background:
                                "linear-gradient(135deg, rgba(156, 39, 176, 0.05) 0%, rgba(156, 39, 176, 0.1) 100%)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.15) 100%)",
                                transform: "translateY(-1px)",
                                boxShadow: "0 4px 12px rgba(156, 39, 176, 0.2)"
                              },
                              "&:disabled": {
                                opacity: 0.5
                              }
                            }}
                            onClick={() => setPolygonDialogOpen(true)}
                          >
                            View Saved Polygons
                          </Button>
                        </>
                      )}

                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "center",
                          color: "text.secondary",
                          mt: 0.75,
                          fontSize: "0.6rem",
                          fontStyle: "italic"
                        }}
                      >
                        Load, edit, delete, and export your measurements
                      </Typography>
                    </Paper>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* 📎 UNITS & EXPORT */}
              <Accordion
                sx={{
                  mb: 0.25,
                  boxShadow: "none",
                  border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
                  bgcolor: darkMode ? "#2a2a2a" : "inherit"
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    minHeight: 32,
                    py: 0.5,
                    "& .MuiAccordionSummary-content": { margin: "4px 0" }
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#1976D2",
                      fontSize: "0.9rem"
                    }}
                  >
                    📏 Units & Export
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
                  <Stack spacing={1}>
                    {/* Unit Toggle */}
                    <Paper
                      sx={{
                        p: 1,
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                        borderRadius: 2
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: "bold", color: "info.main" }}
                        >
                          📏 Measurement Units
                        </Typography>
                        <ToggleButtonGroup
                          value={selectedUnit}
                          exclusive
                          onChange={(e, newUnit) => {
                            if (newUnit) {
                              setSelectedUnit(newUnit);
                              console.log(`📏 Units changed to: ${newUnit}`);
                            }
                          }}
                          size="small"
                          sx={{ height: 28 }}
                        >
                          <ToggleButton
                            value="metric"
                            sx={{ px: 1, py: 0.5, fontSize: "0.7rem" }}
                          >
                            Metric
                          </ToggleButton>
                          <ToggleButton
                            value="imperial"
                            sx={{ px: 1, py: 0.5, fontSize: "0.7rem" }}
                          >
                            Imperial
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Stack>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", fontSize: "0.65rem" }}
                      >
                        Distance: km/m • Area: km²/m²
                      </Typography>
                    </Paper>

                    {/* Export Options */}
                    <ButtonGroup variant="outlined" fullWidth size="small">
                      <Button
                        startIcon={<Download />}
                        onClick={() => {
                          const exportData = {
                            timestamp: new Date().toISOString(),
                            measurements: {
                              distance: {
                                value: totalDistance,
                                formatted: `${(totalDistance / 1000).toFixed(
                                  2
                                )} km`,
                                points: points.length
                              },
                              area: {
                                value: polygonArea,
                                formatted: `${(polygonArea / 1000000).toFixed(
                                  2
                                )} km²`,
                                points: polygonPoints.length
                              }
                            },
                            coordinates: points.concat(polygonPoints),
                            metadata: {
                              layers: activeLayers,
                              baseMap: selectedBaseMap
                            }
                          };
                          const blob = new Blob(
                            [JSON.stringify(exportData, null, 2)],
                            { type: "application/json" }
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `gis-export-${Date.now()}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        sx={{ fontSize: "0.7rem" }}
                      >
                        JSON
                      </Button>
                      <Button
                        startIcon={<Upload />}
                        onClick={() => {
                          const csvHeader =
                            "Type,Name,Latitude,Longitude,Value,Unit\n";
                          const csvRows = [];
                          points.forEach((point, index) => {
                            csvRows.push(
                              `Distance,Point ${index + 1},${point.lat},${
                                point.lng
                              },${totalDistance},meters`
                            );
                          });
                          polygonPoints.forEach((point, index) => {
                            csvRows.push(
                              `Polygon,Point ${index + 1},${point.lat},${
                                point.lng
                              },${polygonArea},square_meters`
                            );
                          });
                          const csvContent = csvHeader + csvRows.join("\n");
                          const blob = new Blob([csvContent], {
                            type: "text/csv"
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `gis-coordinates-${Date.now()}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        sx={{ fontSize: "0.7rem" }}
                      >
                        CSV
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* 🗺️ BASE MAPS - Compact Version */}
              <Accordion
                defaultExpanded
                sx={{
                  mb: 0.25,
                  boxShadow: "none",
                  border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
                  bgcolor: darkMode ? "#2a2a2a" : "inherit"
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    minHeight: 28,
                    py: 0.25,
                    "& .MuiAccordionSummary-content": { margin: "2px 0" }
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#1976D2",
                      fontSize: "0.85rem"
                    }}
                  >
                    🗺️ Base Maps
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
                  <ToggleButtonGroup
                    value={selectedBaseMap}
                    exclusive
                    onChange={(e, newMap) => {
                      if (newMap) setSelectedBaseMap(newMap);
                    }}
                    orientation="vertical"
                    fullWidth
                    size="small"
                  >
                    {baseMaps.map((map) => (
                      <ToggleButton
                        key={map.id}
                        value={map.id}
                        sx={{
                          justifyContent: "flex-start",
                          textAlign: "left",
                          py: 0.5,
                          minHeight: 32,
                          border: "1px solid #e0e0e0 !important",
                          "&.Mui-selected": {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderColor: `${theme.palette.primary.main} !important`
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%"
                          }}
                        >
                          <Typography sx={{ mr: 1, fontSize: "1rem" }}>
                            {map.icon}
                          </Typography>
                          <Box sx={{ textAlign: "left" }}>
                            <Typography
                              variant="body2"
                              fontWeight="bold"
                              textTransform="none"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {map.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              textTransform="none"
                              sx={{ fontSize: "0.6rem" }}
                            >
                              {map.description}
                            </Typography>
                          </Box>
                        </Box>
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </AccordionDetails>
              </Accordion>

              {/* 🐛 DEBUG CONTROLS */}
              <Accordion
                sx={{
                  mb: 0.25,
                  boxShadow: "none",
                  border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
                  bgcolor: darkMode ? "#2a2a2a" : "inherit"
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    minHeight: 32,
                    py: 0.5,
                    "& .MuiAccordionSummary-content": { margin: "4px 0" }
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#1976D2",
                      fontSize: "0.9rem"
                    }}
                  >
                    🐛 Debug Tools
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
                  <Stack direction="row" spacing={0.5}>
                    <Button
                      variant={showDebugLogs ? "contained" : "outlined"}
                      fullWidth
                      size="small"
                      startIcon={showDebugLogs ? <Visibility /> : <Code />}
                      onClick={() => {
                        setShowDebugLogs(!showDebugLogs);
                        console.log(
                          `🐛 Debug logs ${
                            !showDebugLogs ? "enabled" : "disabled"
                          }`
                        );
                      }}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.7rem",
                        py: 1,
                        borderRadius: 2,
                        borderColor: showDebugLogs ? "#4CAF50" : "#6c757d",
                        color: showDebugLogs ? "white" : "#6c757d",
                        backgroundColor: showDebugLogs
                          ? "#4CAF50"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: showDebugLogs
                            ? "#388E3C"
                            : "rgba(108, 117, 125, 0.1)",
                          borderColor: showDebugLogs ? "#388E3C" : "#495057"
                        }
                      }}
                    >
                      {showDebugLogs ? "Hide Logs" : "Show Logs"}
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* 📖 BOOKMARKS */}
              <Accordion
                defaultExpanded
                sx={{
                  mb: 0.25,
                  boxShadow: "none",
                  border: darkMode ? "1px solid #333" : "1px solid #e3f2fd",
                  bgcolor: darkMode ? "#2a2a2a" : "inherit"
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    minHeight: 32,
                    py: 0.5,
                    "& .MuiAccordionSummary-content": { margin: "4px 0" }
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#1976D2",
                      fontSize: "0.9rem"
                    }}
                  >
                    🔖 Quick Bookmarks ({bookmarks.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0.5, pt: 0 }}>
                  <Stack spacing={1}>
                    {/* Add Current Location Button */}
                    <Button
                      variant="outlined"
                      fullWidth
                      size="small"
                      startIcon={<Place />}
                      onClick={() => {
                        // Add current center point as bookmark using live coordinates
                        const newBookmark = {
                          id: Date.now(),
                          name: `Location ${bookmarks.length + 1}`,
                          coords: {
                            lat: liveCoordinates.lat,
                            lng: liveCoordinates.lng
                          },
                          timestamp: new Date().toLocaleString(),
                          zoom: mapZoom
                        };
                        setBookmarks((prev) => [...prev, newBookmark]);
                        console.log(
                          `🔖 Bookmark saved at: ${liveCoordinates.lat.toFixed(
                            6
                          )}, ${liveCoordinates.lng.toFixed(6)}`
                        );
                      }}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.7rem",
                        py: 0.8,
                        borderColor: "#4CAF50",
                        color: "#4CAF50",
                        "&:hover": {
                          backgroundColor: "rgba(76, 175, 80, 0.08)",
                          borderColor: "#2E7D32"
                        }
                      }}
                    >
                      Add Current View
                    </Button>

                    {bookmarks.length === 0 ? (
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.info.main, 0.05),
                          borderRadius: 2,
                          textAlign: "center"
                        }}
                      >
                        <Bookmark
                          sx={{ fontSize: 32, color: "info.main", mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          No bookmarks yet. Click "Add Current View" to save
                          locations.
                        </Typography>
                      </Paper>
                    ) : (
                      <Stack spacing={0.5}>
                        {bookmarks.map((bookmark) => (
                          <Paper
                            key={bookmark.id}
                            variant="outlined"
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.05
                                ),
                                borderColor: "primary.main",
                                transform: "translateY(-1px)",
                                boxShadow: "0 2px 8px rgba(33, 150, 243, 0.2)"
                              }
                            }}
                            onClick={() => {
                              console.log(
                                `🎯 Navigating to bookmark: ${bookmark.name}`
                              );
                              console.log(
                                `🗺 Coordinates: ${bookmark.coords.lat}, ${bookmark.coords.lng}`
                              );
                              // Navigate to the exact bookmark location
                              if (workingMapRef.current?.map) {
                                workingMapRef.current.map.panTo(
                                  bookmark.coords
                                );
                                workingMapRef.current.map.setZoom(
                                  bookmark.zoom || 12
                                );
                                console.log(
                                  `✅ Map navigated to bookmark location`
                                );
                              } else {
                                console.error(
                                  "❌ WorkingMapRef not available for navigation"
                                );
                              }
                            }}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Bookmark color="primary" sx={{ fontSize: 16 }} />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  fontWeight="medium"
                                  noWrap
                                >
                                  {bookmark.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontSize: "0.65rem" }}
                                >
                                  {bookmark.coords.lat.toFixed(4)}°,{" "}
                                  {bookmark.coords.lng.toFixed(4)}°
                                </Typography>
                              </Box>
                              <Stack direction="row" spacing={0.5}>
                                <Tooltip title="Edit bookmark">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditBookmark(bookmark);
                                    }}
                                    sx={{
                                      color: "primary.main",
                                      opacity: 0.7,
                                      "&:hover": { opacity: 1 }
                                    }}
                                  >
                                    <Settings sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete bookmark">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteBookmark(bookmark);
                                    }}
                                    sx={{
                                      color: "error.main",
                                      opacity: 0.7,
                                      "&:hover": { opacity: 1 }
                                    }}
                                  >
                                    <Clear sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Drawer>
        </Slide>

        {/* Main Map Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            position: "relative",
            ml: leftSidebarOpen ? 0 : `-${leftDrawerWidth}px`,
            mr: rightSidebarOpen ? `${rightDrawerWidth}px` : 0,
            transition: theme.transitions.create(["margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            }),
            overflow: "hidden"
          }}
        >
          {/* Enhanced Map with Integrated Search */}
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <WorkingMeasurementMap
              ref={workingMapRef}
              hideControls={true}
              hideHeader={true}
              isDrawing={isDrawing}
              isPolygonDrawing={isPolygonDrawing}
              showElevation={showElevation}
              showInfrastructure={showInfrastructure}
              selectedBaseMap={selectedBaseMap}
              onDrawingChange={setIsDrawing}
              onPolygonDrawingChange={setIsPolygonDrawing}
              onPointsChange={setPoints}
              onPolygonPointsChange={setPolygonPoints}
              onTotalDistanceChange={setTotalDistance}
              onPolygonAreaChange={setPolygonArea}
              onCoordinatesChange={setLiveCoordinates}
              onZoomChange={setMapZoom}
              onLogsChange={setDebugLogs}
              onMouseCoordinatesChange={setMouseCoordinates}
              showDebugLogs={showDebugLogs}
            />
          </Box>

          {/* Map Controls Overlay - Toggle with sidebar */}
          {!leftSidebarOpen && (
            <Fade in={!leftSidebarOpen}>
              <Paper
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  zIndex: 1200
                }}
              >
                <Stack spacing={0}>
                  <Tooltip title="Zoom In" placement="left">
                    <IconButton size="small" onClick={handleZoomIn}>
                      <ZoomIn />
                    </IconButton>
                  </Tooltip>
                  <Divider />
                  <Tooltip title="Zoom Out" placement="left">
                    <IconButton size="small" onClick={handleZoomOut}>
                      <ZoomOut />
                    </IconButton>
                  </Tooltip>
                  <Divider />
                  <Tooltip title="My Location" placement="left">
                    <IconButton size="small" onClick={handleMyLocation}>
                      <MyLocation />
                    </IconButton>
                  </Tooltip>
                  <Divider />
                  <Tooltip title="Center on India" placement="left">
                    <IconButton size="small" onClick={handleCenterIndia}>
                      <CenterFocusStrong />
                    </IconButton>
                  </Tooltip>
                  <Divider />
                  <Tooltip title="Fullscreen" placement="left">
                    <IconButton size="small" onClick={handleFullscreen}>
                      <Fullscreen />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            </Fade>
          )}

          {/* Enhanced Distance & Area Panel - Bottom Center */}
          {(totalDistance > 0 || polygonArea > 0) && (
            <Paper
              sx={{
                position: "absolute",
                bottom: 80,
                left: "50%",
                transform: "translateX(-50%)",
                p: 2,
                bgcolor: darkMode
                  ? "rgba(0, 0, 0, 0.9)"
                  : "rgba(255, 255, 255, 0.98)",
                color: darkMode ? "#fff" : "inherit",
                backdropFilter: "blur(20px)",
                zIndex: 1000,
                border: `2px solid ${
                  totalDistance > 0
                    ? "rgba(76, 175, 80, 0.8)"
                    : "rgba(156, 39, 176, 0.8)"
                }`,
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                minWidth: 280
              }}
            >
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  justifyContent="center"
                >
                  <Straighten sx={{ fontSize: 20, color: "success.main" }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "success.main" }}
                  >
                    Live Measurements
                  </Typography>
                </Stack>

                {totalDistance > 0 && (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1,
                      bgcolor: darkMode
                        ? "rgba(25, 118, 210, 0.1)"
                        : "rgba(25, 118, 210, 0.05)",
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.8rem",
                        color: "primary.main",
                        fontWeight: "bold"
                      }}
                    >
                      DISTANCE
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                        fontFamily: "monospace"
                      }}
                    >
                      {formatDistance(totalDistance)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.7rem", opacity: 0.7 }}
                    >
                      {points.length} measurement points
                    </Typography>
                  </Box>
                )}

                {polygonArea > 0 && (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 1,
                      bgcolor: darkMode
                        ? "rgba(156, 39, 176, 0.1)"
                        : "rgba(156, 39, 176, 0.05)",
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.8rem",
                        color: "secondary.main",
                        fontWeight: "bold"
                      }}
                    >
                      AREA
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "secondary.main",
                        fontFamily: "monospace"
                      }}
                    >
                      {formatArea(polygonArea)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: "0.7rem", opacity: 0.7 }}
                    >
                      {polygonPoints.length} polygon vertices
                    </Typography>
                  </Box>
                )}

                <Stack direction="row" spacing={1} justifyContent="center">
                  <Chip
                    label={`Unit: ${
                      selectedUnit === "metric" ? "Metric" : "Imperial"
                    }`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", height: 24 }}
                  />
                  <Chip
                    label="Real-time"
                    size="small"
                    color="success"
                    sx={{ fontSize: "0.7rem", height: 24 }}
                  />
                </Stack>
              </Stack>
            </Paper>
          )}

          {/* Scale Bar - Bottom Left */}
          <Paper
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              p: 1,
              bgcolor: darkMode
                ? "rgba(0, 0, 0, 0.85)"
                : "rgba(255, 255, 255, 0.95)",
              color: darkMode ? "#fff" : "inherit",
              zIndex: 1000,
              borderRadius: 2
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              {getMapScale(mapZoom)}
            </Typography>
          </Paper>

          {/* Live Coordinates and Zoom Display - Top Right */}
          <Paper
            sx={{
              position: "absolute",
              top: 80,
              right: 16,
              p: 1,
              bgcolor: darkMode
                ? "rgba(0, 0, 0, 0.85)"
                : "rgba(255, 255, 255, 0.95)",
              color: darkMode ? "#fff" : "inherit",
              zIndex: 1000,
              borderRadius: 2,
              minWidth: 200
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", display: "block" }}
            >
              📍 Map Center
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
            >
              Lat: {liveCoordinates.lat.toFixed(6)}°
            </Typography>
            <br />
            <Typography
              variant="caption"
              sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
            >
              Lng: {liveCoordinates.lng.toFixed(6)}°
            </Typography>
            <br />
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
            >
              🔍 Zoom: {mapZoom}
            </Typography>
            {hoverCoordinates && (
              <>
                <br />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: "bold",
                    display: "block",
                    mt: 1,
                    color: "primary.main"
                  }}
                >
                  💁 Mouse Position
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    color: "primary.main"
                  }}
                >
                  Lat: {hoverCoordinates.lat.toFixed(6)}°
                </Typography>
                <br />
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    color: "primary.main"
                  }}
                >
                  Lng: {hoverCoordinates.lng.toFixed(6)}°
                </Typography>
              </>
            )}
          </Paper>

          {/* Debug Logs Overlay - Always show when enabled */}
          {showDebugLogs && (
            <Paper
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                maxWidth: 400,
                maxHeight: 300,
                p: 1,
                bgcolor: "rgba(0, 0, 0, 0.85)",
                color: "#00FF00",
                zIndex: 1000,
                borderRadius: 2,
                fontFamily: "monospace",
                border: "1px solid #333"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1,
                  borderBottom: "1px solid #333",
                  pb: 0.5
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#00FF00", fontWeight: "bold" }}
                >
                  🐛 DEBUG LOGS ({debugLogs.length})
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowDebugLogs(false)}
                  sx={{ color: "#FF5722", p: 0.25 }}
                >
                  <Close sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
              <Box
                sx={{
                  maxHeight: 250,
                  overflow: "auto",
                  fontSize: "0.7rem",
                  lineHeight: 1.2,
                  "&::-webkit-scrollbar": {
                    width: 4
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#1a1a1a"
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#333",
                    borderRadius: 2
                  }
                }}
              >
                {debugLogs.length === 0 ? (
                  <Typography
                    variant="caption"
                    sx={{ color: "#666", fontStyle: "italic" }}
                  >
                    📝 No debug logs yet...
                  </Typography>
                ) : (
                  debugLogs.slice(-20).map((log, index) => (
                    <Typography
                      key={`debug-log-${
                        debugLogs.length - 20 + index
                      }-${index}`}
                      variant="caption"
                      sx={{
                        display: "block",
                        color: log.includes("❌")
                          ? "#FF5722"
                          : log.includes("⚠️")
                          ? "#FF9800"
                          : log.includes("✅")
                          ? "#4CAF50"
                          : "#00FF00",
                        fontSize: "0.7rem",
                        fontFamily: "monospace",
                        lineHeight: 1.3,
                        mb: 0.25
                      }}
                    >
                      {log}
                    </Typography>
                  ))
                )}
              </Box>
            </Paper>
          )}

          {/* Full-width Elevation Chart Overlay */}
          {showElevationChart && (
            <Paper
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 300,
                bgcolor: darkMode
                  ? "rgba(0, 0, 0, 0.95)"
                  : "rgba(255, 255, 255, 0.98)",
                color: darkMode ? "#fff" : "inherit",
                zIndex: 1500,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                boxShadow: "0 -8px 32px rgba(0,0,0,0.3)",
                backdropFilter: "blur(20px)"
              }}
            >
              <Box sx={{ p: 2, height: "100%" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <TrendingUp sx={{ fontSize: 24, color: "primary.main" }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Elevation Profile
                    </Typography>
                    <Chip
                      label={`${elevationData.length} Points`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={`Distance: ${
                        elevationData.length > 0
                          ? formatDistance(
                              elevationData[elevationData.length - 1]
                                ?.distance || 0
                            )
                          : "0"
                      }`}
                      size="small"
                      sx={{
                        bgcolor: darkMode
                          ? "rgba(25, 118, 210, 0.2)"
                          : "rgba(25, 118, 210, 0.1)"
                      }}
                    />
                    <Chip
                      label={`Max Elevation: ${Math.max(
                        ...elevationData.map((d) => d.elevation)
                      )}m`}
                      size="small"
                      sx={{
                        bgcolor: darkMode
                          ? "rgba(76, 175, 80, 0.2)"
                          : "rgba(76, 175, 80, 0.1)"
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setShowElevationChart(false);
                        setShowElevation(false);
                        setElevationMarkers([]);
                        setElevationData([]);
                      }}
                      sx={{ color: "text.secondary" }}
                    >
                      <Close />
                    </IconButton>
                  </Stack>
                </Stack>

                {/* Simple ASCII-style elevation chart */}
                <Box
                  sx={{
                    height: 200,
                    bgcolor: darkMode ? "#1a1a1a" : "#f5f5f5",
                    borderRadius: 2,
                    p: 2,
                    border: darkMode ? "1px solid #333" : "1px solid #ddd",
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "space-between"
                  }}
                >
                  {elevationData.map((point, index) => {
                    const maxElevation = Math.max(
                      ...elevationData.map((d) => d.elevation)
                    );
                    const minElevation = Math.min(
                      ...elevationData.map((d) => d.elevation)
                    );
                    const heightPercentage =
                      ((point.elevation - minElevation) /
                        (maxElevation - minElevation)) *
                      100;

                    return (
                      <Box
                        key={index}
                        sx={{
                          width: `calc(100% / ${elevationData.length})`,
                          height: `${Math.max(heightPercentage, 5)}%`,
                          bgcolor: `hsl(${
                            120 - heightPercentage * 0.8
                          }, 70%, 50%)`,
                          mx: 0.1,
                          borderRadius: "2px 2px 0 0",
                          position: "relative",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            transform: "scaleX(2)",
                            zIndex: 10,
                            bgcolor: "primary.main"
                          }
                        }}
                        title={`Distance: ${formatDistance(
                          point.distance
                        )}, Elevation: ${point.elevation}m`}
                      />
                    );
                  })}
                </Box>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mt: 1, fontSize: "0.8rem", color: "text.secondary" }}
                >
                  <Typography>Start</Typography>
                  <Typography>
                    Distance:{" "}
                    {elevationData.length > 0
                      ? formatDistance(
                          elevationData[elevationData.length - 1]?.distance || 0
                        )
                      : "0"}
                  </Typography>
                  <Typography>End</Typography>
                </Stack>
              </Box>
            </Paper>
          )}
        </Box>

        {/* Enhanced Right Sidebar with Smooth Animation */}
        <Slide
          direction="left"
          in={rightSidebarOpen}
          mountOnEnter
          unmountOnExit
        >
          <Drawer
            variant="persistent"
            anchor="right"
            open={rightSidebarOpen}
            sx={{
              width: rightDrawerWidth,
              flexShrink: 0,
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              "& .MuiDrawer-paper": {
                position: "absolute",
                width: rightDrawerWidth,
                boxSizing: "border-box",
                bgcolor: darkMode ? "#1a1a1a" : "#ffffff",
                color: darkMode ? "#ffffff" : "inherit",
                borderLeft: `1px solid ${darkMode ? "#333" : "#e3f2fd"}`,
                boxShadow: darkMode
                  ? "-2px 0 12px rgba(0,0,0,0.5)"
                  : "-2px 0 12px rgba(0,0,0,0.1)",
                top: "64px",
                height: "calc(100vh - 64px)",
                margin: 0
              }
            }}
          >
            {/* Right Sidebar Header */}
            <Box
              sx={{
                p: 1,
                background: `linear-gradient(135deg, ${
                  darkMode ? "rgb(156,39,176)" : "#9C27B0"
                } 0%, ${darkMode ? "rgb(123,31,162)" : "#7B1FA2"} 100%)`,
                color: "white",
                textAlign: "center",
                borderBottom: `1px solid ${darkMode ? "grey.700" : "#e3f2fd"}`
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
              >
                ⚙️ Advanced Settings
              </Typography>
              <Chip
                label="Pro Tools"
                size="small"
                sx={{
                  mt: 0.25,
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontSize: "0.6rem",
                  height: "18px"
                }}
              />
            </Box>

            <Box sx={{ p: 1.5, overflow: "auto" }}>
              {/* Theme Controls */}
              <Paper
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: darkMode ? "#2a2a2a" : "inherit",
                  border: darkMode ? "1px solid #333" : "none"
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 1.5 }}
                >
                  🎨 Appearance
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                  }
                  label="Dark Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={compactMode}
                      onChange={() => setCompactMode(!compactMode)}
                    />
                  }
                  label="Compact Layout"
                />
              </Paper>

              {/* Debug Information */}
              <Paper
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: darkMode ? "#2a2a2a" : "inherit",
                  border: darkMode ? "1px solid #333" : "none"
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 1.5 }}
                >
                  🐛 Debug Information
                </Typography>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Points:
                    </Typography>
                    <Typography variant="body2">
                      {points.length} active
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Polygon Points:
                    </Typography>
                    <Typography variant="body2">
                      {polygonPoints.length} active
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Map Zoom:
                    </Typography>
                    <Typography variant="body2">{mapZoom}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Coordinates:
                    </Typography>
                    <Typography variant="caption" fontFamily="monospace">
                      {liveCoordinates.lat.toFixed(6)},{" "}
                      {liveCoordinates.lng.toFixed(6)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Quick Actions */}
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: darkMode ? "#2a2a2a" : "inherit",
                  border: darkMode ? "1px solid #333" : "none"
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 1.5 }}
                >
                  ⚡ Quick Actions
                </Typography>
                <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    startIcon={<CenterFocusStrong />}
                    onClick={handleCenterOnIndia}
                    sx={{ textTransform: "none" }}
                  >
                    Center on India
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    startIcon={<Clear />}
                    onClick={handleClearAll}
                    disabled={points.length === 0 && polygonPoints.length === 0}
                    sx={{ textTransform: "none" }}
                  >
                    Clear All Data
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    startIcon={<History />}
                    onClick={handleHistory}
                    sx={{ textTransform: "none" }}
                  >
                    View History
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Drawer>
        </Slide>
      </Box>

      {/* Save Distance Dialog */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
            color: "white",
            fontWeight: "bold"
          }}
        >
          💾 Save Distance Measurement
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            label="Measurement Name"
            variant="outlined"
            value={measurementName}
            onChange={(e) => setMeasurementName(e.target.value)}
            placeholder={`Distance Measurement ${Date.now()}`}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setSaveDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmSaveDistance}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)"
              }
            }}
          >
            Save Measurement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Polygon Dialog */}
      <Dialog
        open={polygonSaveDialogOpen}
        onClose={() => setPolygonSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
            color: "white",
            fontWeight: "bold"
          }}
        >
          💾 Save Polygon Area
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            label="Polygon Name"
            variant="outlined"
            value={polygonName}
            onChange={(e) => setPolygonName(e.target.value)}
            placeholder={`Polygon Area ${Date.now()}`}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setPolygonSaveDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmSavePolygon}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              background: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #7B1FA2 0%, #4A148C 100%)"
              }
            }}
          >
            Save Polygon
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bookmark Edit Dialog */}
      <Dialog
        open={bookmarkEditDialogOpen}
        onClose={() => setBookmarkEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
            color: "white",
            fontWeight: "bold"
          }}
        >
          🔖 Edit Bookmark
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            label="Bookmark Name"
            variant="outlined"
            value={editedBookmarkName}
            onChange={(e) => setEditedBookmarkName(e.target.value)}
            placeholder="Enter bookmark name"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setBookmarkEditDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveBookmarkEdit}
            variant="contained"
            disabled={!editedBookmarkName.trim()}
            sx={{
              borderRadius: 2,
              px: 3,
              background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)"
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bookmark Delete Confirmation Dialog */}
      <Dialog
        open={bookmarkDeleteDialogOpen}
        onClose={() => setBookmarkDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
            color: "white",
            fontWeight: "bold"
          }}
        >
          🗑️ Delete Bookmark
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this bookmark?
          </Typography>
          {bookmarkToDelete && (
            <Paper
              sx={{ p: 2, bgcolor: "rgba(244, 67, 54, 0.1)", borderRadius: 2 }}
            >
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {bookmarkToDelete.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bookmarkToDelete.coords.lat.toFixed(6)}°,{" "}
                {bookmarkToDelete.coords.lng.toFixed(6)}°
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created: {bookmarkToDelete.timestamp}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setBookmarkDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteBookmark}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)"
              }
            }}
          >
            Delete Bookmark
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GISProfessionalDashboard;
