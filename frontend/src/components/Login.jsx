import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

const Login = ()=>{
    const [email,setEmail]=React.useState('');
    const [password,setPassword]=React.useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        const auth =localStorage.getItem('user');
        if(auth)
        {
            navigate("/")
        }

    },[])
    const handleLogin= async ()=>{
        let result = await fetch("http://localhost:3000/login", {
            method : 'post',
            body: JSON.stringify({email, password}),
            headers:{
                "Content-Type":"application/json"
            }
        });
        result = await result.json();
        console.warn(result)
        if(result.auth)
        {
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('token', JSON.stringify(result.auth));
            navigate("/")

        }else {
            alert("please enter correct details")
        }
    }
    return(
        <div className="login">
            <h1>Login</h1>
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
            <button onClick= {handleLogin} className="appButton" type="button">
                Login
            </button>
            {status && <p>{status}</p>}
        </div>
    )
}

export default Login