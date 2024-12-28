import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Home from './Pages/Home.jsx';
import Navbar from './Pages/Navbar.jsx';
import AAProjects from './Pages/AAProjects.jsx';
import ADHProjects from './Pages/ADHProjects.jsx';
import History from './Pages/History.jsx';
import FloodlightAnalysis from './Pages/FloodlightAnalysis.jsx';
import MarketLevelAnalysis from './Pages/MarketLevelAnalysis.jsx'; // Import your new component
import OverallAnalysis from './Pages/OverallAnalysis.jsx';
import BrandformanceAnalysis from './Pages/BrandformanceAnalysis.jsx';
import ReachandFrequency from './Pages/ReachandFrequency.jsx';
import AudienceSpotlightAnalysis from './Pages/AudienceSpotlightAnalysis.jsx';

function App() {
    useEffect(() => {
        localStorage.clear(); // Clear local storage on initial load
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [historyData, setHistoryData] = useState({
        adh: [],
        aa: []
    });

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    const addProject = (projectName, type) => {
        const existingProject = historyData[type].find(project => project.name === projectName);
        if (existingProject) {
            alert(`Project name "${projectName}" already exists in the ${type.toUpperCase()} section.`);
            return;
        }

        const newProject = {
            id: Date.now(),
            name: projectName,
            createdAt: new Date().toLocaleString()
        };

        setHistoryData(prevData => ({
            ...prevData,
            [type]: [...prevData[type], newProject]
        }));
    };

    return (
        <Router>
            {isLoggedIn && <Navbar onLogout={handleLogout} />}
            <Routes>
                <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
                <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
                <Route path="/projects/aa" element={isLoggedIn ? <AAProjects addProject={addProject} /> : <Navigate to="/login" />} />
                <Route path="/projects/adh" element={isLoggedIn ? <ADHProjects addProject={addProject} /> : <Navigate to="/login" />} />
                <Route path="/history" element={isLoggedIn ? <History historyData={historyData} /> : <Navigate to="/login" />} />
                <Route path="/floodlight-analysis" element={isLoggedIn ? <FloodlightAnalysis /> : <Navigate to="/login" />} />
               <Route path="/overall-level-analysis" element={<OverallAnalysis />} />
                <Route path="/market-level-analysis" element={isLoggedIn ? <MarketLevelAnalysis /> : <Navigate to="/login" />} /> {/* Add the new route */}
                <Route path="/brandformance-analysis" element={<BrandformanceAnalysis />} />
                {/* <Route path="/Reach-and-Frequency-analysis" element={<ReachandFrequency />} /> */}
                <Route path="/reach-frequency-analysis" element={<ReachandFrequency />} />

                <Route path="/audience-spotlight-analysis" element={<AudienceSpotlightAnalysis />} />
               

                <Route path="*" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;
