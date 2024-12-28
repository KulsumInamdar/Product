import React from 'react';
import { useLocation } from 'react-router-dom';

const AudienceSpotlightAnalysis = () => {
    const location = useLocation();
    const { analysisName, floodlightId, startDate, endDate, cityNames, cityIds, lineItemIds } = location.state || {};

    return (
        <div>
            <h2>Audience spotlight Analysis</h2>
            <h3>Analysis Name: {analysisName}</h3>
            <p>Floodlight ID: {floodlightId}</p>
            <p>Date Range: {startDate?.toLocaleDateString()} to {endDate?.toLocaleDateString()}</p>
            <h4>Markets:</h4>
            {cityNames && cityNames.map((cityName, index) => (
                <div key={index}>
                    <p>Market {index + 1}: {cityName} (City ID: {cityIds[index]}, Line Item ID: {lineItemIds[index]})</p>
                </div>
            ))}
        </div>
    );
};

export default AudienceSpotlightAnalysis;
