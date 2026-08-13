import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchOrderDetailsApi } from '../../../api/shopOwnerAPI';
import './ShopOrderDetails.css';

const ShopOrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State ke through aane wala order ya orderId
  const passedOrder = location.state?.order || null;
  const orderId = location.state?.orderId || passedOrder?._id;

  const [order, setOrder] = useState(passedOrder);
  const [isLoading, setIsLoading] = useState(!passedOrder && Boolean(orderId));
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (orderId && !order) {
      loadOrderDetails(orderId);
    } else if (!orderId) {
      setErrorMessage('No order information found.');
      setIsLoading(false);
    }
  }, [orderId, order]);

  const loadOrderDetails = async (id) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetchOrderDetailsApi(id);
      setOrder(response.data || response);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setErrorMessage(error.message || 'Failed to load order information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shop-order-details-wrapper">
      <nav className="details-navbar">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
        <h2>Order Status & Tracking 📦</h2>
      </nav>

      <div className="details-container">
        {errorMessage && <div className="alert error-alert">{errorMessage}</div>}

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Fetching order details...</p>
          </div>
        ) : !order ? (
          <div className="empty-state">
            <h3>Order Not Found</h3>
            <p>The requested order could not be located.</p>
          </div>
        ) : (
          <div className="details-card">
            
            <div className="details-header">
              <div>
                <span className="order-id-label">Order ID: #{order._id}</span>
                <h3>{order.goods?.category || 'General Goods'}</h3>
              </div>
              <span className={`status-pill ${order.status}`}>
                {order.status ? order.status.replace('_', ' ').toUpperCase() : 'REQUESTED'}
              </span>
            </div>

            {order.loader_id ? (
              <div className="loader-info-card">
                <div className="loader-header-info">
                  <span className="loader-icon">🚚</span>
                  <div>
                    <small>ASSIGNED DELIVERY PARTNER</small>
                    <h4>{order.loader_id.name || 'N/A'}</h4>
                  </div>
                </div>
                <div className="loader-contact">
                  <span>📞 {order.loader_id.phone || 'N/A'}</span>
                  <a href={`tel:${order.loader_id.phone}`} className="call-btn">
                    Call Partner
                  </a>
                </div>
              </div>
            ) : (
              <div className="pending-loader-card">
                <p>⏳ Waiting for a delivery partner to accept your order...</p>
              </div>
            )}

            <div className="route-section">
              <h4>Route Information</h4>
              <div className="route-box">
                <div className="route-point pickup">
                  <span className="dot-indicator green"></span>
                  <div>
                    <small>PICKUP ADDRESS</small>
                    <p>{order.pickup?.address || 'N/A'}</p>
                  </div>
                </div>

                <div className="route-connector"></div>

                <div className="route-point drop">
                  <span className="dot-indicator red"></span>
                  <div>
                    <small>DROP-OFF ADDRESS</small>
                    <p>{order.drop?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="specs-section">
              <h4>Order Specifications</h4>
              <div className="specs-grid">
                <div className="spec-box">
                  <span>Goods Category</span>
                  <strong>{order.goods?.category || 'N/A'}</strong>
                </div>
                <div className="spec-box">
                  <span>Weight</span>
                  <strong>{order.goods?.weight_kg || 0} KG</strong>
                </div>
                <div className="spec-box">
                  <span>Vehicle Requested</span>
                  <strong>{order.vehicle_type_requested ? order.vehicle_type_requested.replace('_', ' ') : 'N/A'}</strong>
                </div>
                <div className="spec-box">
                  <span>Estimated Fare</span>
                  <strong className="fare-highlight">₹{order.estimated_fare || 'N/A'}</strong>
                </div>
              </div>
            </div>

            {order.status_history && order.status_history.length > 0 && (
              <div className="history-section">
                <h4>Status Timeline</h4>
                <div className="timeline-list">
                  {order.status_history.map((historyItem, index) => (
                    <div key={index} className="timeline-item">
                      <span className="timeline-dot"></span>
                      <div className="timeline-content">
                        <strong>{historyItem.status.replace('_', ' ').toUpperCase()}</strong>
                        <small>{new Date(historyItem.timestamp).toLocaleString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="action-footer">
              <button className="primary-action-btn" onClick={() => navigate('/shop/dashboard')}>
                Back to Dashboard 🏪
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default ShopOrderDetails;