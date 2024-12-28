// src/components/Navbar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [dropdown, setDropdown] = useState(null);
    const navigate = useNavigate();  // For programmatic navigation

    const handleMouseEnter = (option) => setDropdown(option);
    const handleMouseLeave = () => setDropdown(null);

    const handleNavigation = (path) => {
        navigate(path);
        setDropdown(null); // Close dropdown after navigation
    };

    return (
        <nav className="navbar">
            <ul className="nav-menu">
                {/* Projects */}
                <li
                    className="nav-item"
                    onMouseEnter={() => handleMouseEnter('projects')}
                    onMouseLeave={handleMouseLeave}
                >
                    Projects
                    {dropdown === 'projects' && (
                        <ul className="dropdown">
                            <li className="dropdown-item" onClick={() => handleNavigation('/projects/aa')}>
                                Create Project in AA
                            </li>
                            <li className="dropdown-item" onClick={() => handleNavigation('/projects/adh')}>
                                Create Project in ADH
                            </li>
                            <li className="dropdown-item" onClick={() => handleNavigation('/history')}>
                                View History
                            </li>
                        </ul>
                    )}
                </li>

                {/* Health Check */}
                <li
                    className="nav-item"
                    onMouseEnter={() => handleMouseEnter('healthCheck')}
                    onMouseLeave={handleMouseLeave}
                >
                    Health Check
                    {dropdown === 'healthCheck' && (
                        <ul className="dropdown">
                            <li className="dropdown-item" onClick={() => handleNavigation('/ADH-health-check')}>
                                ADH Health Check
                            </li>
                            <li className="dropdown-item" onClick={() => handleNavigation('/AA-health-check')}>
                                AA Health Check
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
