import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();
    useEffect(()=>{
        const auth = localStorage.getItem('user');
        if(auth)
        {
            navigate('/')
        }
    },[])

    const collectData = async() => {
        try {
          // Basic Validation: Check if any field is empty
          if (!name || !email || !password) {
              setStatus("Please fill in all fields.");
              return; // Stop further execution
          }

          // Create a data object
          const userData = {
              name: name,
              email: email,
              password: password
          };
          console.log("User Data:", userData);

          // Here, you would typically send 'userData' to your backend API
          // ... (e.g., using fetch or axios)

          setStatus("User registered successfully!");
          // Clear the fields after successful submission
          setName("");
          setEmail("");
          setPassword("");
        }
        catch (err){
          console.error(err);
          setStatus("An unexpected error occured");
        }
        let result = await fetch("http://localhost:3000/register", {
            method:"post",
            body:JSON.stringify({name,email,password}),
            headers:{
                "Content-Type":"application/json"
            }
        });
        result = await result.json();
        console.warn(result);
        localStorage.setItem("user", JSON.stringify(result.result))
        localStorage.setItem("token", JSON.stringify(result.auth))
        navigate("/")
    };

    return (
        <div className="register">
            <h1>Register</h1>
            <input
                className="inputbox"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="inputbox"
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="inputbox"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={collectData} className="appButton" type="button">
                Sign Up
            </button>
            {status && <p>{status}</p>}
        </div>
    );
};

export default SignUp;