import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ADHProjects.css';

const ADHProjects = ({ addProject }) => {
    const [projectName, setProjectName] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleAnalysisOption = (option) => {
        if (option === 'firstPart') {
            setShowPopup(true);
        } else if (option === 'floodlightId') {
            navigate('/floodlight-analysis', { state: { projectName } }); // Pass projectName to MarketLevelAnalysis
        }
    };

    const handlePopupClose = (isUploaded) => {
        if (!isUploaded) {
            window.location.href = 'https://www.appsflyer.com';
        }
        setShowPopup(false);
    };

    return (
        <div>
            <h1>ADH Projects</h1>

            <div className="analysis-options">
                <h3>Choose Analysis Option:</h3>
                <button onClick={() => handleAnalysisOption('firstPart')}>Analysis on First Party</button>
                <button onClick={() => handleAnalysisOption('floodlightId')}>Analysis on Floodlight ID</button>
            </div>

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
