import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';

const OverallAnalysis = () => {
    // Get the project name from the location state
    const location = useLocation();
    const { projectName } = location.state || {};

    // State for form inputs
    const [floodlightId, setFloodlightId] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [lookback, setLookback] = useState('');
    const [showUseCaseOptions, setShowUseCaseOptions] = useState(false);

    // Handle form validation
    const isValidInput = () => {
        return floodlightId.trim() !== '' && startDate && endDate;
    };

    // Handle use case selection
    const handleUseCaseSelection = () => {
        if (isValidInput()) {
            setShowUseCaseOptions(true);
            const analysisDetails = {
                projectName,
                floodlightId,
                startDate,
                endDate,
                lookback
            };
            localStorage.setItem('analysisHistory', JSON.stringify(analysisDetails));
        }
    };

    return (
        <div className="overall-analysis">
            <h2>Overall Level Analysis</h2>
            <p>Project Name: {projectName}</p>

            {/* Floodlight ID Input */}
            <div className="form-group">
                <label htmlFor="floodlightId">Floodlight ID:</label>
                <input
                    type="text"
                    id="floodlightId"
                    value={floodlightId}
                    onChange={(e) => setFloodlightId(e.target.value)}
                    placeholder="Enter Floodlight ID"
                    required
                />
            </div>

            {/* Date Range */}
            <div className="form-group">
                <label>Date Range:</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Start Date"
                />
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="End Date"
                />
            </div>

            {/* Lookback */}
            <div className="form-group">
                <label htmlFor="lookback">Lookback (Optional):</label>
                <input
                    type="number"
                    id="lookback"
                    value={lookback}
                    onChange={(e) => setLookback(e.target.value)}
                    placeholder="Lookback"
                />
            </div>

            {/* Button to choose use case */}
            <button onClick={handleUseCaseSelection} disabled={!isValidInput()}>
                Choose Use Case
            </button>

            {/* Show Use Case Options if valid */}
            {showUseCaseOptions && (
                <div className="use-case-options">
                    <h4>Select Use Case:</h4>
                    <button onClick={() => console.log('Brandformance selected')}>Brandformance</button>
                    <button onClick={() => console.log('Reach Frequency selected')}>Reach Frequency</button>
                    <button onClick={() => console.log('Audience Spotlight selected')}>Audience Spotlight</button>
                </div>
            )}
        </div>
    );
};

export default OverallAnalysis;
