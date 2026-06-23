import {
  FaHome,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaMoneyBill,
  FaChartBar,
  FaRobot
} from "react-icons/fa";

function Sidebar({ setPage }) {
  return (
    <div className="sidebar">

      <h2>🛒 E-Commerce</h2>

      <ul>

        <li onClick={() => setPage("dashboard")}>
          <FaHome /> Dashboard
        </li>

        <li onClick={() => setPage("products")}>
          <FaBox /> Products
        </li>

        <li onClick={() => setPage("customers")}>
          <FaUsers /> Customers
        </li>

        <li onClick={() => setPage("orders")}>
          <FaShoppingCart /> Orders
        </li>

        <li onClick={() => setPage("payments")}>
          <FaMoneyBill /> Payments
        </li>

        <li onClick={() => setPage("analytics")}>
          <FaChartBar /> Analytics
        </li>

        <li onClick={() => setPage("ai")}>
          <FaRobot /> AI Assistant
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;