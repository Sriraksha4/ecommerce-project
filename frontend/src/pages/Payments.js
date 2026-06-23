import { useEffect, useState } from "react";
import API from "../services/api";

function Payments() {

  const [payments, setPayments] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    API.get("/payments", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setPayments(res.data))
    .catch(err => console.log(err));

  }, []);

  return (
    <div>
      <h2>Payments</h2>

      <table>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {payments.map(payment => (
            <tr key={payment._id}>
              <td>{payment._id}</td>
              <td>₹{payment.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Payments;