import axios from 'axios';

// Create a base API instance
const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Your backend base URL goes here
});

// Function to handle user login
export const loginUser = async (formData) => {
  try {
    // Axios automatically converts data to JSON format
    const response = await API.post('/users/login', formData);

    // Return the main response data from the backend
    return response.data;
  } catch (error) {
    // If the backend sends an error response (like 400 or 404)
    if (error.response && error.response.data) {
      throw error.response.data; // Throw the backend error message
    }
    // If the server is down or there is a network issue
    throw new Error('Server connection error. Please check if the backend is running.');
  }
};


// Function to handle user signup (registration)
export const registerUser = async (formData) => {
  try {
    // Make sure your backend has this route (e.g., /users/register)
    const response = await API.post('/users/signup', formData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Server connection error. Please check if the backend is running.');
  }
};


// api.js ke end mein yeh add karein

export const updateStatusApi = async (data) => {
  try {
    const token = localStorage.getItem('token');

    // Header mein token attach karke bhej rahe hain
    const response = await API.put('/users/update-status', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Backend API ko PUT request bhej rahe hain
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Server connection error.');
  }
};

// Register the vehicle

export const addVehicleApi = async (vehicleData) => {
  try {
    // Local storage se token nikal rahe hain
    const token = localStorage.getItem('token');

    // Header mein token attach karke bhej rahe hain
    const response = await API.post('/vehicles/register', vehicleData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Server connection error.');
  }
};


// Saari vehicles fetch karne ke liye API function
export const getAllVehiclesApi = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await API.get('/vehicles/my-vehicles', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to fetch vehicles.');
  }
};

export const updateVehicleAvailabilityApi = async (vehicleId, is_available) => {
  try {
    const token = localStorage.getItem('token');

    // Yahan URL mein id bhej rahe hain jo backend req.params.id se match karega
    const response = await API.patch(`/vehicles/${vehicleId}/toggle-status`,
      { is_available },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error('Failed to update availability.');
  }
};

export const getProfileApi = async () => {
  const token = localStorage.getItem('token');
  const response = await API.get('/users/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};