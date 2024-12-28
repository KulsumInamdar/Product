import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import * as d3 from 'd3';
import * as venn from 'venn.js';
import './BrandformanceAnalysis.css';

const BrandformanceAnalysis = () => {
    const location = useLocation();
    const { analysisName, floodlightId, startDate, endDate, cityNames, cityIds, lineItemIds } = location.state || {};
    const [marketData, setMarketData] = useState({});

    const handleFileUpload = (e, marketIndex) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const binaryStr = event.target.result;
                const workbook = XLSX.read(binaryStr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                const calculatedData = jsonData.map(row => {
                    const uniqueUsers = parseFloat(row.unique_users_data);
                    const uniqueConverters = parseFloat(row.unique_converters_data);
                    const cvr = uniqueUsers ? ((uniqueConverters / uniqueUsers) * 100).toFixed(2) : '0.00';

                    return {
                        ...row,
                        CVR: `${cvr}%`,
                    };
                });

                setMarketData(prevState => ({
                    ...prevState,
                    [marketIndex]: {
                        data: calculatedData,
                        vennData: calculateVennData(calculatedData)
                    }
                }));
            };
            reader.readAsBinaryString(file);
        }
    };

    const calculateVennData = (data) => {
        if (data.length < 3) {
            console.error('Data must have at least three rows for Venn diagram calculation');
            return null;
        }

        const onlyBrandingReach = parseFloat(data[0].unique_users_data);
        const overlapReach = parseFloat(data[1].unique_users_data);
        const onlyPerformanceReach = parseFloat(data[2].unique_users_data);

        return {
            onlyBrandingReach,
            overlapReach,
            onlyPerformanceReach
        };
    };

    useEffect(() => {
        Object.keys(marketData).forEach(marketIndex => {
            const { vennData } = marketData[marketIndex];
            if (vennData) {
                // Clear existing Venn diagram if re-rendered
                d3.select(`#venn-${marketIndex}`).selectAll("*").remove();

                // Define the sets and overlaps for the Venn diagram
                const sets = [
                    { sets: ['Branding'], size: vennData.onlyBrandingReach },
                    { sets: ['Performance'], size: vennData.onlyPerformanceReach },
                    { sets: ['Branding', 'Performance'], size: vennData.overlapReach },
                ];

                // Render the Venn diagram
                const chart = venn.VennDiagram().width(500).height(400);
                const div = d3.select(`#venn-${marketIndex}`).datum(sets).call(chart);

                // Center the entire Venn diagram horizontally
                div.attr("transform", `translate(100, 200)`); // Apply shift
            }
        });
    }, [marketData]);

    return (
        <div>
            <h2>Brandformance Analysis</h2>
            <h3>Analysis Name: {analysisName}</h3>
            <p>Floodlight ID: {floodlightId}</p>
            <p>Date Range: {startDate?.toLocaleDateString()} to {endDate?.toLocaleDateString()}</p>
            <h4>Markets:</h4>
            {cityNames && cityNames.map((cityName, index) => (
                 <div key={index} style={{ marginTop: '20px' }}> 
                    <p>Market {index + 1}: {cityName} (City ID: {cityIds[index]}, Line Item ID: {lineItemIds[index]})</p>
                    <input type="file" accept=".xlsx, .xls" onChange={(e) => handleFileUpload(e, index)} />
                    
                    {/* Flex container for Venn diagram and labels */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', marginTop: '20px' }}>
                        <div id={`venn-${index}`} style={{ flex: '1', display: 'flex', justifyContent: 'center' }}></div>
                        
                        {/* Render Venn Data Text */}
                        {marketData[index]?.vennData && (
                            <div style={{ position: 'relative' }}>
                                <div className="venn-label branding-left">
                                    <span>Only Branding Reach: {marketData[index].vennData.onlyBrandingReach}</span>
                                    <br />
                                    <span>CVR: {marketData[index].data[0]?.CVR || 'N/A'}</span>
                                </div>

                                <div className="venn-label performance-right">
                                    <span>Only Performance Reach: {marketData[index].vennData.onlyPerformanceReach}</span>
                                    <br />
                                    <span>CVR: {marketData[index].data[2]?.CVR || 'N/A'}</span>
                                </div>

                                <div className="venn-label overlap-center">
                                    <span>Overlap Reach: {marketData[index].vennData.overlapReach}</span>
                                    <br />
                                    <span>CVR: {marketData[index].data[1]?.CVR || 'N/A'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Table for Uploaded Data for Each Market */}
                    <h4 style={{ marginTop: '40px' }}>Uploaded Data for Market {index + 1}</h4>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Row</th>
                                <th>Brand Exposures</th>
                                <th>Perf Exposures</th>
                                <th>Unique Users</th>
                                <th>Unique Converters</th>
                                <th>Total Conversions</th>
                                <th>CVR (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketData[index]?.data.map((row, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{row.brand_exposures}</td>
                                    <td>{row.perf_exposures}</td>
                                    <td>{row.unique_users_data}</td>
                                    <td>{row.unique_converters_data}</td>
                                    <td>{row.total_conv_data}</td>
                                    <td>{row.CVR}</td>
                                </tr>
                            )) || <tr><td colSpan="7">No data uploaded</td></tr>}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default BrandformanceAnalysis;
