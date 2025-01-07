import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios"
export default function RedirectToRoot(){
    const navigate = useNavigate();
    const {fetchEmployeeDetail, signOut} = useAuth();
    useEffect(()=>{
        const checkJWT = async () => {
            const token = localStorage.getItem("access_token");
            if(!token){
                navigate("/admin/auth");
            }
            else{
                try {
                    const response = await axios.post(
                        'http://localhost:8000/api/auth/employee/validateJWT',
                        {}, // Pass an empty object as the body
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                      
                    const success = response.data.success;
                    if(!success){
                        alert("Xác thực người dùng không hợp lệ. Vui lòng đăng nhập lại");
                        signOut();
                    }else{
                        await fetchEmployeeDetail();
                        navigate("/admin")
                    }
                }catch (error) {
                    if (error.response) {
                        alert(`Lấy thông tin nhân viên thất bại, lỗi: ` + error.response.data.msg);
                        throw new Error(error.response.data.msg);
                    } else if (error.request) {
                        alert('Không nhận được phản hồi từ server');
                        throw new Error(error.response.data.msg);
                    } else {
                        alert('Lỗi bất ngờ: ' + error.message);
                        throw new Error(error.response.data.msg);
                    }
                }
            }
        }
        checkJWT();
    },[])
    return <></>
}