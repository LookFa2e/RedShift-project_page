import React, { useState, useEffect } from 'react';
import { fetchOrderStats, fetchProductRanking, fetchUserRanking } from '../api/api';
import StatsChart from '../components/dashboard/StatsChart';
import Ranking from '../components/dashboard/Ranking';
import "../scss/dashboard.scss";

const Dashboard: React.FC = () => {
  const [orderStats, setOrderStats] = useState<[]>([]); 
  const [productRanking, setProductRanking] = useState<any[]>([]);
  const [userRanking, setUserRanking] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<string>('all-time'); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const orderData = await fetchOrderStats(timeRange);
        const productData = await fetchProductRanking();
        const userData = await fetchUserRanking();

        setOrderStats(orderData);
        setProductRanking(productData);
        setUserRanking(userData);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]); 

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="filters">
        <button onClick={() => setTimeRange('all-time')}>All Time</button>
        <button onClick={() => setTimeRange('3-months')}>Last 3 Months</button>
        <button onClick={() => setTimeRange('1-month')}>Last 1 Month</button>
        <button onClick={() => setTimeRange('1-week')}>Last Week</button>
        <button onClick={() => setTimeRange('1-day')}>Last Day</button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <StatsChart data={orderStats} />
          <div className="rankings">
            <Ranking title="Top Selling Products" rankingData={productRanking} />
            <Ranking title="Top Users by Spending" rankingData={userRanking} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
