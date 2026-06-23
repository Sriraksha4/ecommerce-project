import "./App.css";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import AITools from "./pages/AITools";

function App() {

  const [page, setPage] = useState("dashboard");

  const renderPage = () => {

    switch (page) {

      case "products":
        return <Products />;

      case "customers":
        return <Customers />;

      case "orders":
        return <Orders />;

      case "payments":
        return <Payments />;

      case "analytics":
        return <Analytics />;

      case "ai":
        return <AITools />;

      default:
        return <Dashboard />;
    }
  };

  return (

    <div className="container">

      <Sidebar setPage={setPage} />

      <div className="main">

        <Navbar />

        {renderPage()}

      </div>

    </div>
  );
}

export default App;