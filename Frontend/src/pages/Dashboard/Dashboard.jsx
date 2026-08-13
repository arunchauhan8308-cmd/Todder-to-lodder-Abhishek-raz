import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateStatusApi } from '../../api/api'; // Import the API function
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State variables to store user data and status
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // To stop double clicks

  // Check if user is logged in when the page loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      // If no data, go to login
      navigate('/login');
    } else {
      // Set user data to state
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // If user is a loader, set their online status from the database
      if (parsedUser.is_online !== undefined) {
        setIsOnline(parsedUser.is_online);
      }
    }
  }, [navigate]);

  // Function to log out the user
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Function to change Online/Offline status for Loader
  const toggleOnlineStatus = async () => {
    if (isUpdating) return; // Stop if it is already updating
    
    const newStatus = !isOnline;
    setIsOnline(newStatus); // Change UI switch immediately
    setIsUpdating(true); // Disable button while loading

    try {
      // Send data to backend without changing the page
      await updateStatusApi({
        userId: user._id,
        role: user.role,
        is_online: newStatus
      });

      // Update the user data in local storage too
      const updatedUser = { ...user, is_online: newStatus };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

    } catch (error) {
      console.error("Failed to update status:", error);
      // If backend fails, change the switch back to old status
      setIsOnline(!newStatus); 
      alert("Failed to update status. Please check your connection.");
    } finally {
      setIsUpdating(false); // Enable the button again
    }
  };

  // Show a loading text until user data is ready
  if (!user) return <div className="loading-screen">Loading GoLoader...</div>;

  return (
    <div className="rapido-wrapper">
      
      {/* Top Navigation Bar */}
      <nav className="rapido-navbar">
        <div className="nav-brand">
          <div className="brand-logo">GL</div>
          <span className="brand-name">GoLoader</span>
        </div>
        <div className="nav-profile">
          <div className="profile-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role === 'loader' ? 'Driver' : 'Shop Owner'}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {/* Main Dashboard Area */}
      <div className="rapido-content">
        
        {/* Welcome Text and Toggle Switch */}
        <div className="status-section">
          <div>
            <h1 className="greeting">Hello, {user.name.split(' ')[0]}! 👋</h1>
            <p className="greeting-sub">Let's get moving today.</p>
          </div>

          {/* Show the switch ONLY if the user is a loader */}
          {user.role === 'loader' && (
            <div className="status-toggle-box">
              <span className="status-text">{isOnline ? 'You are Online' : 'You are Offline'}</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isOnline} 
                  onChange={toggleOnlineStatus} 
                  disabled={isUpdating} // Stop clicks while sending data
                />
                <span className="slider round"></span>
              </label>
            </div>
          )}
        </div>

        {/* Quick Stats Box */}
        <div className="stats-banner">
          <div className="stat-box">
            <span className="stat-value">{user.role === 'loader' ? '₹0' : '0'}</span>
            <span className="stat-label">{user.role === 'loader' ? 'Today\'s Earnings' : 'Active Loads'}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">0</span>
            <span className="stat-label">{user.role === 'loader' ? 'Deliveries Done' : 'Total Posted'}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-value">5.0 ⭐</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>

        {/* Action Cards */}
        <h2 className="section-title">Quick Actions</h2>
        
        <div className="rapido-grid">
          {user.role === 'loader' ? (
            // Cards for Loader (Driver)
            <>
              <div className="rapido-card highlight-card">
                <div className="card-icon">🚚</div>
                <h3>Find New Loads</h3>
                <p>See delivery requests near your location.</p>
                <button className="rapido-primary-btn" disabled={!isOnline}>
                  {isOnline ? 'Search Loads' : 'Go Online to Search'}
                </button>
              </div>
              <div className="rapido-card">
                <div className="card-icon">💰</div>
                <h3>My Earnings</h3>
                <p>View your daily and weekly payouts.</p>
                <button className="rapido-secondary-btn">View Details</button>
              </div>
            </>
          ) : (
            // Cards for Shop Owner
            <>
              <div className="rapido-card highlight-card">
                <div className="card-icon">📦</div>
                <h3>Post a Load</h3>
                <p>Enter pickup and drop details to find a driver.</p>
                <button className="rapido-primary-btn">Create Request</button>
              </div>
              <div className="rapido-card">
                <div className="card-icon">📍</div>
                <h3>Track Shipments</h3>
                <p>Check the live location of your active goods.</p>
                <button className="rapido-secondary-btn">Track Now</button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;