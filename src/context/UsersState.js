import { useState } from "react";

import UserContext from "./userContext";

const UsersState = (props)=> {
    const server = "http://localhost:5000";

    const [userDetails, setUserDetails] = useState({name: "", email: ""});

    const registerUser = async ({username,name,email,password,address,phone})=> {
        const response = await fetch(`${server}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username,name,email,password,address,phone})
        });

        const json = await response.json();
        return json;
    }

    const loginUser = async ({email,password})=> {
        if(password.trim() === "") {
            return localStorage.setItem("error","Password cannot be blank");
        }
        const response = await fetch(`${server}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email,password})
        });

        const json = await response.json();
        return json;
    }

    const getUserDetails = async ()=> {
        const response = await fetch(`${server}/api/auth/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token")
            }
        });

        const profile = await response.json();
        if(profile.success) {
            setUserDetails({username: profile.user.username,name: profile.user.name, email: profile.user.email, address: profile.user.address, phone: profile.user.phone})
            localStorage.removeItem("error");
        }
        else {
            localStorage.setItem("error",profile.error);
        }
    }
    
    return (
        <UserContext.Provider value={{registerUser, loginUser, getUserDetails, userDetails}}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UsersState;