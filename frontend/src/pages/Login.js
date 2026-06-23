import { useState } from "react";
import API from "../services/api";

function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async () => {

    try{

      const res = await API.post("/users/login",{
        email,
        password
      });

      localStorage.setItem("token",res.data.token);

      alert("Login Successful");

      window.location="/dashboard";

    }
    catch(err){
      alert("Invalid Credentials");
    }
  };

  return(

    <div className="auth-container">

      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button onClick={login}>
        Login
      </button>

    </div>
  );
}

export default Login;