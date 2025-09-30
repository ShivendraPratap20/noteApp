import React from "react";
import Header from "./Header";
import MainContent from "./MainContext";
import useAuth from "../../auth/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
    const { authorized, loading, userData, error } = useAuth();
    const navigate = useNavigate();
    if(authorized && !loading)
        return(
            <>
            <Header userName = {userData.userName}/>
            <MainContent userData = {userData}/>
            </>
        )
    else if(error){
        return<div>Error</div>
    }else{
        navigate("/");
    }
}