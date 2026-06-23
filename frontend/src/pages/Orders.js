import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    API.get("/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.log(err));

  }, []);

  return (
    <div>
      <h2>Orders</h2>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.user?.name}</td>
              <td>₹{order.totalAmount}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;