import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import './MarketLevelAnalysis.css';
import './FloodlightAnalysis.jsx';

const MarketLevelAnalysis = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const projectName = location.state?.projectName || '';
    console.log('Project Name:', projectName);

    const [floodlightId, setFloodlightId] = useState('');
    const [numberOfMarkets, setNumberOfMarkets] = useState('');
    const [cityNames, setCityNames] = useState([]);
    const [cityIds, setCityIds] = useState([]);
    const [lineItemIds, setLineItemIds] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showUseCaseOptions, setShowUseCaseOptions] = useState(false);
    const [cityInputVisible, setCityInputVisible] = useState(false);

    // Popup states
    const [showBrandformancePopup, setShowBrandformancePopup] = useState(false);
    const [showReachFrequencyPopup, setShowReachFrequencyPopup] = useState(false);
    const [showAudienceSpotlightPopup, setShowAudienceSpotlightPopup] = useState(false);

    const [analysisName, setAnalysisName] = useState('');
    const [isAnalysisNameValid, setIsAnalysisNameValid] = useState(true);

    const handleBrandformanceSelection = () => {
        setShowBrandformancePopup(true);
    };

    const handleReachFrequencySelection = () => {
        setShowReachFrequencyPopup(true);
    };

    const handleAudienceSpotlightSelection = () => {
        setShowAudienceSpotlightPopup(true);
    };

    const handleAnalysisNameChange = (e) => {
        setAnalysisName(e.target.value);
        setIsAnalysisNameValid(e.target.value.trim() !== '');
    };

    const handleConfirmBrandformance = () => {
        if (analysisName.trim() !== '') {
            setShowBrandformancePopup(false);
            navigate('/brandformance-analysis', {
                state: {
                    analysisName,
                    floodlightId,
                    startDate,
                    endDate,
                    cityNames,
                    cityIds,
                    lineItemIds
                }
            });
        } else {
            setIsAnalysisNameValid(false);
        }
    };
    
    const handleConfirmReachFrequency = () => {
        if (analysisName.trim() !== '') {
            setShowReachFrequencyPopup(false);
            navigate('/reach-frequency-analysis', {
                state: {
                    analysisName,
                    floodlightId,
                    startDate,
                    endDate,
                    cityNames,
                    cityIds,
                    lineItemIds
                }
            });
        } else {
            setIsAnalysisNameValid(false);
        }
    };
    
    const handleConfirmAudienceSpotlight = () => {
        console.log('Confirming Audience Spotlight Analysis with name:', analysisName); // Debug log
        if (analysisName.trim() !== '') {
            console.log('Navigating to Audience Spotlight Analysis'); // Debug log
            setShowAudienceSpotlightPopup(false);
            navigate('/audience-spotlight-analysis', {
                state: {
                    analysisName,
                    floodlightId,
                    startDate,
                    endDate,
                    cityNames,
                    cityIds,
                    lineItemIds
                }
            });
        } else {
            setIsAnalysisNameValid(false);
        }
    };
    

    const handleNumberOfMarketsChange = (value) => {
        setNumberOfMarkets(value);
        const marketCount = parseInt(value);
        setCityNames(new Array(marketCount).fill(''));
        setCityIds(new Array(marketCount).fill(''));
        setLineItemIds(new Array(marketCount).fill(''));
        setCityInputVisible(marketCount > 0);
    };

    const renderMarketInputs = () => {
        const inputs = [];
        for (let i = 0; i < parseInt(numberOfMarkets); i++) {
            inputs.push(
                <div key={i} className="market-input-group">
                    <div className="form-group">
                        <label htmlFor={`cityName-${i}`}>City Name (for Market {i + 1}):</label>
                        <input
                            type="text"
                            id={`cityName-${i}`}
                            value={cityNames[i] || ''}
                            onChange={(e) => {
                                const newCityNames = [...cityNames];
                                newCityNames[i] = e.target.value;
                                setCityNames(newCityNames);
                            }}
                            placeholder={`Enter City Name for Market ${i + 1}`}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`cityId-${i}`}>City ID compulsory for Brandformance (for {cityNames[i] || `Market ${i + 1}`}):</label>
                        <input
                            type="text"
                            id={`cityId-${i}`}
                            value={cityIds[i] || ''}
                            onChange={(e) => handleCommaSeparatedInput(e.target.value, setCityIds, i)}
                            placeholder="Enter City IDs, e.g., 123,456"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`lineItemId-${i}`}>Line Item ID (for {cityNames[i] || `Market ${i + 1}`}):</label>
                        <input
                            type="text"
                            id={`lineItemId-${i}`}
                            value={lineItemIds[i] || ''}
                            onChange={(e) => handleCommaSeparatedInput(e.target.value, setLineItemIds, i)}
                            placeholder="Enter Line Item IDs, e.g., 789,101"
                            required
                        />
                    </div>
                </div>
            );
        }
        return inputs;
    };

    const handleCommaSeparatedInput = (value, setValue, index) => {
        const numericCommaPattern = /^[0-9,]*$/;
        if (numericCommaPattern.test(value)) {
            const newValues = [...(setValue === setCityIds ? cityIds : lineItemIds)];
            newValues[index] = value;
            if (setValue === setCityIds) {
                setCityIds(newValues);
            } else {
                setLineItemIds(newValues);
            }
        }
    };

    const handleUseCaseSelection = () => {
        if (isValidInput()) {
            setShowUseCaseOptions(true);
        }
    };

    const isValidInput = () => {
        return (
            floodlightId.trim() !== '' &&
            startDate &&
            endDate &&
            lineItemIds.length === parseInt(numberOfMarkets) &&
            cityIds.length === parseInt(numberOfMarkets) &&
            cityNames.every(name => name.trim() !== '') &&
            lineItemIds.every(id => id.trim() !== '')
        );
    };

    return (
        <div>
            <h2>Floodlight Analysis at a Market Level</h2>
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
                <label htmlFor="numberOfMarkets">Enter the number of markets:</label>
                <input
                    type="number"
                    id="numberOfMarkets"
                    value={numberOfMarkets}
                    onChange={(e) => handleNumberOfMarketsChange(e.target.value)}
                    placeholder="Number of markets"
                    min="1"
                />
            </div>
            <div className="form-group">
                <label>Date Range:</label>
                <div className="date-picker">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                        dateFormat="yyyy/MM/dd"
                        required
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="End Date"
                        dateFormat="yyyy/MM/dd"
                        required
                    />
                </div>
            </div>
            {cityInputVisible && renderMarketInputs()}
            <button onClick={handleUseCaseSelection} disabled={!isValidInput()}>
                Choose Use Case
            </button>
            {showUseCaseOptions && (
                <div className="use-case-options">
                    <h4>Select a Use Case:</h4>
                    <button onClick={handleBrandformanceSelection}>Brandformance</button>
                    <button onClick={handleReachFrequencySelection}>Reach Frequency</button>
                    <button onClick={handleAudienceSpotlightSelection}>Audience Spotlight</button>
                </div>
            )}
            {showBrandformancePopup && (
                <>
                    <div className="overlay" onClick={() => setShowBrandformancePopup(false)}></div>
                    <div className="alert-popup">
                        <h4>Brandformance Analysis for Project: {projectName}</h4>
                        {/* {projectName && <h2>Brandformance Analysis for Project: {projectName}</h2>} */}
                        <p>Enter Analysis Name:</p>
                        <input
                            type="text"
                            value={analysisName}
                            onChange={handleAnalysisNameChange}
                            placeholder="Enter Analysis Name"
                            className={isAnalysisNameValid ? '' : 'input-error'}
                        />
                        {!isAnalysisNameValid && <p className="error-message">Analysis name is required.</p>}
                        <button onClick={handleConfirmBrandformance}>Confirm</button>
                        <button onClick={() => setShowBrandformancePopup(false)}>Cancel</button>
                    </div>
                </>
            )}
            {showReachFrequencyPopup && (
                <>
                    <div className="overlay" onClick={() => setShowReachFrequencyPopup(false)}></div>
                    <div className="alert-popup">
                        <h4>Reach Frequency Analysis for Project: {projectName}</h4>
                        {projectName && <h2>Reach Frequency Analysis for Project: {projectName}</h2>}
                        <p>Enter Analysis Name:</p>
                        <input
                            type="text"
                            value={analysisName}
                            onChange={handleAnalysisNameChange}
                            placeholder="Enter Analysis Name"
                            className={isAnalysisNameValid ? '' : 'input-error'}
                        />
                        {!isAnalysisNameValid && <p className="error-message">Analysis name is required.</p>}
                        <button onClick={handleConfirmReachFrequency}>Confirm</button>
                        <button onClick={() => setShowReachFrequencyPopup(false)}>Cancel</button>
                    </div>
                </>
            )}
            {showAudienceSpotlightPopup && (
                <>
                    <div className="overlay" onClick={() => setShowAudienceSpotlightPopup(false)}></div>
                    <div className="alert-popup">
                        <h4>Audience Spotlight Analysis for Project: {projectName}</h4>
                        {projectName && <h2>Audience Spotlight Analysis for Project: {projectName}</h2>}
                        <p>Enter Analysis Name:</p>
                        <input
                            type="text"
                            value={analysisName}
                            onChange={handleAnalysisNameChange}
                            placeholder="Enter Analysis Name"
                            className={isAnalysisNameValid ? '' : 'input-error'}
                        />
                        {!isAnalysisNameValid && <p className="error-message">Analysis name is required.</p>}
                        <button onClick={handleConfirmAudienceSpotlight}>Confirm</button>
                        <button onClick={() => setShowAudienceSpotlightPopup(false)}>Cancel</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MarketLevelAnalysis;
