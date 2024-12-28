// ADHProjects.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addADHProject, addAnalysisToProject } from './historyData';
import './ADHProjects.css';

const ADHProjects = () => {
    const [projectName, setProjectName] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();
    const [currentProjectId, setCurrentProjectId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (projectName.trim()) {
            const createdAt = new Date().toLocaleDateString();
            const newProject = addADHProject(projectName, createdAt);
            setCurrentProjectId(newProject.id); // Save project ID for further analyses
            setProjectName('');
            setShowOptions(true);
        }
    };

    const handleAnalysisOption = (option) => {
        if (option === 'firstPart') {
            setShowPopup(true);
        } else if (option === 'floodlightId') {
            navigate('/floodlight-analysis', { state: { projectId: currentProjectId } });
        }
    };

    const handlePopupClose = (isUploaded) => {
        if (!isUploaded) {
            window.location.href = 'https://www.appsflyer.com';
        } else {
            // Assuming "First Party Analysis" results are available
            addAnalysisToProject(currentProjectId, 'First Party Analysis', 'firstPart', 'Results for First Party');
        }
        setShowPopup(false);
    };

    return (
        <div>
            <h1>ADH Projects</h1>
            <form onSubmit={handleSubmit} className="adh-project-form">
                <div className="form-group">
                    <label htmlFor="projectName">Enter Project Name:</label>
                    <input
                        type="text"
                        id="projectName"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                        placeholder="Enter project name"
                    />
                </div>
                <button type="submit">Create Project</button>
            </form>

            {showOptions && (
                <div className="analysis-options">
                    <h3>Choose Analysis Option:</h3>
                    <button onClick={() => handleAnalysisOption('firstPart')}>Analysis on First Party</button>
                    <button onClick={() => handleAnalysisOption('floodlightId')}>Analysis on Floodlight ID</button>
                </div>
            )}

            {showPopup && (
                <>
                    <div className="overlay" onClick={() => setShowPopup(false)}></div>
                    <div className="alert-popup">
                        <h4>Warning</h4>
                        <p>Is the first-party data uploaded?</p>
                        <div className="alert-buttons">
                            <button onClick={() => handlePopupClose(true)}>Yes</button>
                            <button onClick={() => handlePopupClose(false)}>No</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ADHProjects;
