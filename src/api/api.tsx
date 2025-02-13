import axios from 'axios';

export const API_URL = "http://localhost:5000/api";

export const fetchOrderStats = async (timeRange: string) => {
  try {
    const response = await axios.get(`${API_URL}/orders/stats?timeRange=${timeRange}`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching stats', error);
    throw error;
  }
};

export const fetchProductRanking = async () => {
  const response = await axios.get(`${API_URL}/products/ranking`);
  return response.data;
};

export const fetchUserRanking = async () => {
  const response = await axios.get(`${API_URL}/users/ranking`);
  return response.data;
};
