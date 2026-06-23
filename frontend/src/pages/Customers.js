import { useEffect, useState } from "react";
import API from "../services/api";

function Customers() {

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    API.get("/users")
      .then(res => setCustomers(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Customers</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {customers.map(customer => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;