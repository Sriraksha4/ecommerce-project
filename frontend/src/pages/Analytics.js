import { useEffect, useState } from "react";
import API from "../services/api";

function Analytics() {

  const [data, setData] = useState({});

  useEffect(() => {
    API.get("/analytics/dashboard")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>

      <h2>Analytics</h2>

      <div className="cards">

        <div className="card">
          <h3>Users</h3>
          <p>{data.totalUsers}</p>
        </div>

        <div className="card">
          <h3>Products</h3>
          <p>{data.totalProducts}</p>
        </div>

        <div className="card">
          <h3>Orders</h3>
          <p>{data.totalOrders}</p>
        </div>

        <div className="card">
          <h3>Revenue</h3>
          <p>₹{data.totalRevenue}</p>
        </div>

      </div>

    </div>
  );
}

export default Analytics;