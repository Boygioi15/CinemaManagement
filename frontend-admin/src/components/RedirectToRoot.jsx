import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function RedirectToRoot(){
    const navigate = useNavigate();
    useEffect(()=>{
        navigate("/admin/auth");
    })
    
    return <></>
}