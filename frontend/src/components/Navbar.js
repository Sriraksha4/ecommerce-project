function Navbar() {
  return (
    <div className="navbar">

      <h2>E-Commerce Management System</h2>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          window.location = "/login";
        }}
      >
        Logout
      </button>

    </div>
  );
}

export default Navbar;