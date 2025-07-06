import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function ProtectedRoute({children}) {
    const status = useSelector(state => state.user.status);
    const navigate = useNavigate();

    useEffect(function(){
        if(!status){
            navigate('/')
        } 
    }, [status, navigate]);

    return status ? children : null;
}

export default ProtectedRoute;