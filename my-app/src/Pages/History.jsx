import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './FloodlightAnalysis.css';

const FloodlightAnalysis = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const { projectName: locationProjectName } = location.state || {};

    const [analysisLevel, setAnalysisLevel] = useState('');
    const [floodlightId, setFloodlightId] = useState('');
    const [numberOfMarkets, setNumberOfMarkets] = useState('');
    const [cityIds, setCityIds] = useState([]);
    const [lineItemIds, setLineItemIds] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [lookback, setLookback] = useState('');
    const [showUseCaseOptions, setShowUseCaseOptions] = useState(false);
    const [projectName, setProjectName] = useState(locationProjectName || '');
    const [showLevelButtons, setShowLevelButtons] = useState(true); // To control button visibility

    const handleAnalysisLevel = (level) => {
        setAnalysisLevel(level);
        setFloodlightId('');
        setNumberOfMarkets('');
        setCityIds([]);
        setLineItemIds([]);
        setStartDate(null);
        setEndDate(null);
        setLookback('');
        setShowUseCaseOptions(false);
        setShowLevelButtons(false); // Hide the level buttons when one is selected
    };

    const handleUseCaseSelection = () => {
        if (isValidInput()) {
            setShowUseCaseOptions(true);
            // Save to history when valid
            const analysisDetails = {
                projectName,
                analysisLevel,
                floodlightId,
                startDate,
                endDate,
                lookback,
                numberOfMarkets,
                cityIds,
                lineItemIds
            };
            // Store the analysis details in localStorage or send to backend
            localStorage.setItem('analysisHistory', JSON.stringify(analysisDetails));
        }
    };

    const isValidInput = () => {
        if (analysisLevel === 'Overall') {
            return floodlightId.trim() !== '' && startDate && endDate;
        } else if (analysisLevel === 'Market') {
            return (
                floodlightId.trim() !== '' &&
                startDate &&
                endDate &&
                lineItemIds.length === parseInt(numberOfMarkets)
            );
        }
        return false;
    };

    const handleCommaSeparatedInput = (value, setValue, index) => {
        const numericCommaPattern = /^[0-9,]*$/;
        if (numericCommaPattern.test(value)) {
            const newValues = [...(index === 0 ? cityIds : lineItemIds)];
            newValues[index] = value;
            if (index === 0) {
                setCityIds(newValues);
            } else {
                setLineItemIds(newValues);
            }
        }
    };

    const renderMarketInputs = () => {
        const inputs = [];
        for (let i = 0; i < parseInt(numberOfMarkets); i++) {
            inputs.push(
                <div key={i} className="market-input-group">
                    <div className="form-group">
                        <label htmlFor={`cityId-${i}`}>City ID (for Market {i + 1}):</label>
                        <input
                            type="text"
                            id={`cityId-${i}`}
                            value={cityIds[i] || ''}
                            onChange={(e) => handleCommaSeparatedInput(e.target.value, setCityIds, 0)}
                            placeholder="Enter City IDs, e.g., 123,456"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`lineItemId-${i}`}>Line Item ID (for Market {i + 1}):</label>
                        <input
                            type="text"
                            id={`lineItemId-${i}`}
                            value={lineItemIds[i] || ''}
                            onChange={(e) => handleCommaSeparatedInput(e.target.value, setLineItemIds, 1)}
                            placeholder="Enter Line Item IDs, e.g., 789,101"
                            required
                        />
                    </div>
                </div>
            );
        }
        return inputs;
    };

    const handleMarketLevelClick = () => {
        navigate('/market-level-analysis', { state: { projectName } });
    };

    return (
        <div>
            <h2>Floodlight Analysis</h2>
            <div className="form-group">
                <label htmlFor="projectName">Project Name:</label>
                <input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter Project Name"
                    required
                />
            </div>

            {/* Conditionally render the level buttons */}
            {showLevelButtons && (
                <>
                    <button onClick={() => handleAnalysisLevel('Overall')}>Overall Level</button>
                    <button onClick={handleMarketLevelClick}>Market Level</button>
                </>
            )}

            {analysisLevel === 'Overall' && (
                <div className="overall-analysis">
                    <h3>Overall Level Analysis</h3>
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
                    <button onClick={handleUseCaseSelection} disabled={!isValidInput()}>
                        Choose Use Case
                    </button>
                </div>
            )}

            {analysisLevel === 'Market' && (
                <div className="market-analysis">
                    <h3>Market Level Analysis</h3>
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
                    <div className="form-group">
                        <label htmlFor="numberOfMarkets">Number of Markets:</label>
                        <input
                            type="number"
                            id="numberOfMarkets"
                            value={numberOfMarkets}
                            onChange={(e) => setNumberOfMarkets(e.target.value)}
                            placeholder="Number of Markets"
                        />
                    </div>
                    {numberOfMarkets > 0 && renderMarketInputs()}
                    <button onClick={handleUseCaseSelection} disabled={!isValidInput()}>
                        Choose Use Case
                    </button>
                </div>
            )}

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

export default FloodlightAnalysis;
