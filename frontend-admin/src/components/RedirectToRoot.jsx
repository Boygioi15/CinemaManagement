import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function RedirectToRoot(){
    const navigate = useNavigate();
    console.log("HI");
    useEffect(()=>{
        navigate("/admin");
    })
    
    return <></>
}