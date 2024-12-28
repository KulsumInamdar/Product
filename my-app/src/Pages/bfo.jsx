// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import * as XLSX from 'xlsx';
// import * as d3 from 'd3';
// import * as venn from 'venn.js';
// import './BrandformanceAnalysis.css'

// const BrandformanceAnalysis = () => {
//     const location = useLocation();
//     const { analysisName, floodlightId, startDate, endDate, cityNames, cityIds, lineItemIds } = location.state || {};
//     const [data, setData] = useState([]);
//     const [vennData, setVennData] = useState(null);

//     const handleFileUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 const binaryStr = event.target.result;
//                 const workbook = XLSX.read(binaryStr, { type: 'binary' });
//                 const sheetName = workbook.SheetNames[0];
//                 const sheet = workbook.Sheets[sheetName];
//                 const jsonData = XLSX.utils.sheet_to_json(sheet);

//                 const calculatedData = jsonData.map(row => {
//                     const uniqueUsers = parseFloat(row.unique_users_data);
//                     const uniqueConverters = parseFloat(row.unique_converters_data);
//                     const cvr = uniqueUsers ? ((uniqueConverters / uniqueUsers) * 100).toFixed(2) : '0.00';
                    
//                     return {
//                         ...row,
//                         CVR: `${cvr}%`,
//                     };
//                 });
                
//                 setData(calculatedData);
//                 calculateVennData(calculatedData);
//             };
//             reader.readAsBinaryString(file);
//         }
//     };

//     const calculateVennData = (data) => {
//         if (data.length < 3) {
//             console.error('Data must have at least three rows for Venn diagram calculation');
//             return;
//         }

//         const onlyBrandingReach = parseFloat(data[0].unique_users_data);
//         const overlapReach = parseFloat(data[1].unique_users_data);
//         const onlyPerformanceReach = parseFloat(data[2].unique_users_data);

//         setVennData({
//             onlyBrandingReach,
//             overlapReach,
//             onlyPerformanceReach
//         });
//     };

//     useEffect(() => {
//         if (vennData) {
//             // Clear existing Venn diagram if re-rendered
//             d3.select("#venn").selectAll("*").remove();

//             // Define the sets and overlaps for the Venn diagram
//             const sets = [
//                 { sets: ['Branding'], size: vennData.onlyBrandingReach },
//                 { sets: ['Performance'], size: vennData.onlyPerformanceReach },
//                 { sets: ['Branding', 'Performance'], size: vennData.overlapReach },
//             ];

//             // Render the Venn diagram
//             const chart = venn.VennDiagram().width(500).height(400);
//             const div = d3.select("#venn").datum(sets).call(chart);

//             // Center the entire Venn diagram horizontally, shifted more to the right
//             const shiftRight = 100; // Additional shift to the right
//             div.attr("transform", `translate(${shiftRight}, 200)`); // Apply shift
//         }
//     }, [vennData]);

//     return (
//         <div>
//             <h2>Brandformance Analysis</h2>
//             <h3>Analysis Name: {analysisName}</h3>
//             <p>Floodlight ID: {floodlightId}</p>
//             <p>Date Range: {startDate?.toLocaleDateString()} to {endDate?.toLocaleDateString()}</p>
//             <h4>Markets:</h4>
//             {cityNames && cityNames.map((cityName, index) => (
//                 <div key={index}>
//                     <p>Market {index + 1}: {cityName} (City ID: {cityIds[index]}, Line Item ID: {lineItemIds[index]})</p>
//                 </div>
//             ))}

//             <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

//             <div style={{ position: 'relative', marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
//                 <div id="venn"></div>
//                 {/* Absolute positioned text box for Branding Reach */}
//                 {vennData && (
//                     <div style={{
//                         position: 'absolute',
//                         left: '4%', // Adjusted value for Branding Reach
//                         top: '50%', // Keep it centered vertically
//                         transform: 'translate(-50%, -50%)', // Center the text
//                         backgroundColor: 'white', // Background color for visibility
//                         padding: '10px',
//                         borderRadius: '5px',
//                         boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//                         zIndex: 10 // Ensure it is on top
//                     }}>
//                         <span style={{ margin: 0, fontSize: '10px' }}>Only Branding Reach: {vennData.onlyBrandingReach}</span>
//                         <br />
//                         <span style={{ margin: 0, fontSize: '10px' }}>CVR: {data[0]?.CVR || 'N/A'}</span>
//                     </div>
//                 )}
//                 {/* Absolute positioned text box for Performance Reach */}
//                 {vennData && (
//                     <div style={{
//                         position: 'absolute',
//                         left: '95%', // Adjusted value for Performance Reach
//                         top: '50%', // Keep it centered vertically
//                         transform: 'translate(-50%, -50%)', // Center the text
//                         backgroundColor: 'white', // Background color for visibility
//                         padding: '10px',
//                         borderRadius: '5px',
//                         boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//                         zIndex: 10, // Ensure it is on top
//                         whiteSpace: 'nowrap' // Prevent wrapping of text
//                     }}>
//                         <span style={{ margin: 0, fontSize: '10px' }}>Only Performance Reach: {vennData.onlyPerformanceReach}</span>
//                         <br />
//                         <span style={{ margin: 0, fontSize: '10px' }}>CVR: {data[2]?.CVR || 'N/A'}</span>
//                     </div>
//                 )}

//                 {vennData && (
//                     <div style={{
//                         position: 'absolute',
//                         left: '60%', // Adjusted value for Performance Reach
//                         top: '95%', // Keep it centered vertically
//                         transform: 'translate(-50%, -50%)', // Center the text
//                         backgroundColor: 'white', // Background color for visibility
//                         padding: '10px',
//                         borderRadius: '5px',
//                         boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//                         zIndex: 10, // Ensure it is on top
//                         whiteSpace: 'nowrap' // Prevent wrapping of text
//                     }}>
//                         <span style={{ margin: 0, fontSize: '10px' }}>Overlap Reach: {vennData.overlapReach}</span>
//                         <br />
//                         <span style={{ margin: 0, fontSize: '10px' }}>CVR: {data[1]?.CVR || 'N/A'}</span>
//                     </div>
//                 )}


//             </div>

//             <h4 style={{ marginTop: '70px' }}>Uploaded Data</h4>
//             <table border="1">
//                 <thead>
//                     <tr>
//                         <th>Row</th>
//                         <th>Brand Exposures</th>
//                         <th>Perf Exposures</th>
//                         <th>Unique Users</th>
//                         <th>Unique Converters</th>
//                         <th>Total Conversions</th>
//                         <th>CVR (%)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.map((row, index) => (
//                         <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>{row.brand_exposures}</td>
//                             <td>{row.perf_exposures}</td>
//                             <td>{row.unique_users_data}</td>
//                             <td>{row.unique_converters_data}</td>
//                             <td>{row.total_conv_data}</td>
//                             <td>{row.CVR}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default BrandformanceAnalysis;










// rnf

// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import * as XLSX from 'xlsx';
// import { Line, Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// // Register the components for Chart.js
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// const ReachFrequencyAnalysis = () => {
//     const location = useLocation();
//     const { analysisName, floodlightId, startDate, endDate, cityNames, cityIds, lineItemIds } = location.state || {};

//     const [data, setData] = useState([]);
//     const [cvrData, setCvrData] = useState([]);
//     const [totalReach, setTotalReach] = useState(0); // To hold the sum of Reach

//     // Handle file upload
//     const handleFileUpload = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const reader = new FileReader();
//         reader.onload = (event) => {
//             const binaryStr = event.target.result;
//             const workbook = XLSX.read(binaryStr, { type: 'binary' });
//             const sheet = workbook.Sheets[workbook.SheetNames[0]];
//             const jsonData = XLSX.utils.sheet_to_json(sheet);

//             // Calculate total reach sum
//             const totalReachValue = jsonData.reduce((acc, row) => acc + (row.Reach || 0), 0);
//             setTotalReach(totalReachValue);

//             // Store data and calculate CVR & Reach Proportion
//             setData(jsonData);
//             calculateCVR(jsonData, totalReachValue);
//         };
//         reader.readAsBinaryString(file);
//     };

//     // Function to calculate CVR (Click-Through Rate) and Reach Proportion
//     const calculateCVR = (data, totalReachValue) => {
//         const result = data.map((row, index) => {
//             const cvr = row.Clickers && row.Reach ? (row.Clickers / row.Reach) * 100 : 0;
//             const reachProportion = row.Reach && totalReachValue ? (row.Reach / totalReachValue) * 100 : 0;

//             return {
//                 ...row,
//                 CVR: cvr.toFixed(2),
//                 ReachProportion: reachProportion.toFixed(2),
//                 Label: `${index + 1}`, // Use 1-1, 1-2, etc. as labels
//             };
//         });
//         setCvrData(result);
//     };

//     // Prepare data for Chart.js
//     const chartData = {
//         labels: cvrData.map((row) => row.Label), // Use labels like 1-1, 1-2, ...
//         datasets: [
//             {
//                 label: 'Reach',
//                 data: cvrData.map((row) => row.Reach),
//                 type: 'bar',
//                 backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue bars
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//                 yAxisID: 'y',
//             },
//             {
//                 label: 'CVR (%)',
//                 data: cvrData.map((row) => parseFloat(row.CVR)),
//                 type: 'line',
//                 borderColor: 'rgba(255, 99, 132, 1)', // Red line
//                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                 fill: false,
//                 tension: 0.1,
//                 yAxisID: 'y1',
//             },
//             {
//                 label: 'Reach Proportion (%)',
//                 data: cvrData.map((row) => parseFloat(row.ReachProportion)),
//                 type: 'line',
//                 borderColor: 'rgba(75, 192, 192, 1)', // Green line
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 fill: false,
//                 tension: 0.1,
//                 yAxisID: 'y1',
//             },
//         ],
//     };

//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: { position: 'top' },
//             title: { display: true, text: 'Reach, CVR, and Reach Proportion Analysis' },
//         },
//         scales: {
//             x: {
//                 title: { display: true, text: 'Frequency' },
//             },
//             y: {
//                 type: 'linear',
//                 display: true,
//                 position: 'left',
//                 title: { display: true, text: 'Reach' },
//             },
//             y1: {
//                 type: 'linear',
//                 display: true,
//                 position: 'right',
//                 title: { display: true, text: 'CVR (%) & Reach Proportion (%)' },
//                 grid: { drawOnChartArea: false }, // Avoid grid lines overlapping with the left y-axis
//             },
//         },
//     };

//     return (
//         <div>
//             <h2>Reach and Frequency Analysis</h2>

//             {/* Existing functionality */}
//             <h3>Analysis Name: {analysisName}</h3>
//             <p>Floodlight ID: {floodlightId}</p>
//             <p>Date Range: {startDate?.toLocaleDateString()} to {endDate?.toLocaleDateString()}</p>
//             <h4>Markets:</h4>
//             {cityNames && cityNames.map((cityName, index) => (
//                 <div key={index}>
//                     <p>Market {index + 1}: {cityName} (City ID: {cityIds[index]}, Line Item ID: {lineItemIds[index]})</p>
//                 </div>
//             ))}

//             {/* File upload to calculate CVR and Reach Proportion */}
//             <input
//                 type="file"
//                 accept=".xlsx, .xls"
//                 onChange={handleFileUpload}
//                 style={{ marginBottom: '20px' }}
//             />

//             {/* CVR and Reach Proportion Table */}
//             <h3>Calculated CVR (Click-Through Rate) and Reach Proportion:</h3>
//             <table border="1">
//                 <thead>
//                     <tr>
//                         <th>Frequency</th>
//                         <th>Reach</th>
//                         <th>Clickers</th>
//                         <th>CVR (%)</th>
//                         <th>Reach Proportion (%)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {cvrData.length > 0 ? (
//                         cvrData.map((row, index) => (
//                             <tr key={index}>
//                                 <td>{row.Label}</td>
//                                 <td>{row.Reach}</td>
//                                 <td>{row.Clickers}</td>
//                                 <td>{row.CVR} %</td>
//                                 <td>{row.ReachProportion} %</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="5">No data to display</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>

//             {/* Combo Graph: Reach, CVR, and Reach Proportion */}
//             <h3>Combo Graph: Reach, CVR, and Reach Proportion</h3>
//             <div style={{ height: '400px' }}>
//                 <Bar data={chartData} options={chartOptions} />
//             </div>
//         </div>
//     );
// };

// export default ReachFrequencyAnalysis;
