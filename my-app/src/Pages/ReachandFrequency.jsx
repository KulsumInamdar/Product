import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ReachFrequencyAnalysis.css'; // Adjust the path if needed

// Register the components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const ReachFrequencyAnalysis = () => {
    const location = useLocation();
    const { analysisName, floodlightId, startDate, endDate, cityNames, cityIds, lineItemIds } = location.state || {};

    const [data, setData] = useState([]);
    const [cvrData, setCvrData] = useState([]);
    const [totalReach, setTotalReach] = useState(0); // To hold the sum of Reach
    const [cumulativeData, setCumulativeData] = useState([]); // For cumulative data

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            // Calculate total reach sum
            const totalReachValue = jsonData.reduce((acc, row) => acc + (row.Reach || 0), 0);
            setTotalReach(totalReachValue);

            // Store data and calculate CVR & Reach Proportion
            setData(jsonData);
            calculateCVR(jsonData, totalReachValue);
            calculateCumulativeData(jsonData); // Call to calculate cumulative data
        };
        reader.readAsBinaryString(file);
    };

    // Function to calculate CVR (Click-Through Rate) and Reach Proportion
    const calculateCVR = (data, totalReachValue) => {
        const result = data.map((row, index) => {
            const cvr = row.Clickers && row.Reach ? (row.Clickers / row.Reach) * 100 : 0;
            const reachProportion = row.Reach && totalReachValue ? (row.Reach / totalReachValue) * 100 : 0;

            return {
                ...row,
                CVR: cvr.toFixed(2),
                ReachProportion: reachProportion.toFixed(2),
                Label: `${index + 1}`, // Use 1-1, 1-2, etc. as labels
            };
        });
        setCvrData(result);
    };

    // Function to calculate cumulative reach and cumulative clickers
    const calculateCumulativeData = (data) => {
        let cumulativeReach = 0;
        let cumulativeClickers = 0;

        const cumulativeResult = data.map((row, index) => {
            cumulativeReach += row.Reach || 0;
            cumulativeClickers += row.Clickers || 0;

            // Calculate cumulative CVR as (CumulativeClickers / CumulativeReach) * 100
            const cumulativeCVR = cumulativeReach > 0 ? (cumulativeClickers / cumulativeReach) * 100 : 0;

            return {
                Label: `1-${index + 1}`, // Creates labels like 1-1, 1-2, ...
                CumulativeReach: cumulativeReach,
                CumulativeCVR: cumulativeCVR.toFixed(2), // Store cumulative CVR as a percentage
            };
        });

        setCumulativeData(cumulativeResult);
    };

    // Data for the cumulative graph
    const cumulativeChartData = {
        labels: cumulativeData.map((row) => row.Label),
        datasets: [
            {
                label: 'Cumulative Reach',
                data: cumulativeData.map((row) => row.CumulativeReach),
                type: 'bar',
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green bars
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                label: 'Cumulative CVR',
                data: cumulativeData.map((row) => row.CumulativeCVR),
                type: 'line',
                borderColor: 'rgba(255, 99, 132, 1)', // Red line
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.1,
                yAxisID: 'y1',
            },
        ],
    };

    const cumulativeChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Cumulative Analysis: Reach and Clickers' },
        },
        scales: {
            x: {
                title: { display: true, text: 'Frequency' },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Cumulative Reach' },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Cumulative CVR' },
                grid: { drawOnChartArea: false }, // Avoid grid lines overlapping with the left y-axis
            },
        },
    };

    // Prepare data for Chart.js
    const chartData = {
        labels: cvrData.map((row) => row.Label), // Use labels like 1-1, 1-2, ...
        datasets: [
            {
                label: 'Reach',
                data: cvrData.map((row) => row.Reach),
                type: 'bar',
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue bars
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                label: 'CVR (%)',
                data: cvrData.map((row) => parseFloat(row.CVR)),
                type: 'line',
                borderColor: 'rgba(255, 99, 132, 1)', // Red line
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                tension: 0.1,
                yAxisID: 'y1',
            },
            {
                label: 'Reach Proportion (%)',
                data: cvrData.map((row) => parseFloat(row.ReachProportion)),
                type: 'line',
                borderColor: 'rgba(75, 192, 192, 1)', // Green line
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.1,
                yAxisID: 'y1',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Reach, CVR, and Reach Proportion Analysis' },
        },
        scales: {
            x: {
                title: { display: true, text: 'Frequency' },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Reach' },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'CVR (%) & Reach Proportion (%)' },
                grid: { drawOnChartArea: false }, // Avoid grid lines overlapping with the left y-axis
            },
        },
    };

    return (
        <div className="analysis-container">
            <h2>Reach and Frequency Analysis</h2>

            {/* Display Analysis Details */}
            <div className="analysis-details">
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

            {/* File upload to calculate CVR and Reach Proportion */}
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ marginBottom: '20px' }}
            />

            {/* CVR and Reach Proportion Table */}
            <h3>Calculated CVR (Click-Through Rate) and Reach Proportion:</h3>
            <table border="1" style={{ marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th>Frequency</th>
                        <th>Reach</th>
                        <th>Clickers</th>
                        <th>CVR (%)</th>
                        <th>Reach Proportion (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {cvrData.length > 0 ? (
                        cvrData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.Label}</td>
                                <td>{row.Reach}</td>
                                <td>{row.Clickers}</td>
                                <td>{row.CVR} %</td>
                                <td>{row.ReachProportion} %</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No data to display</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Graphs - Container with Flexbox */}
            <div className="graphs-container">
                {/* Existing graph */}
                <div className="absolute-graph">
                    <h3>Combo Graph: Reach, CVR, and Reach Proportion</h3>
                    <div style={{ height: '400px' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Cumulative graph */}
                <div className="cumulative-graph">
                    <h3>Cumulative Graph: Reach, CVR, and Reach Proportion</h3>
                    <div style={{ height: '400px' }}>
                        <Bar data={cumulativeChartData} options={cumulativeChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReachFrequencyAnalysis;
