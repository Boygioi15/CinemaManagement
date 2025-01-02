import React from 'react';
import './style.css'; // Add your modal styles here
import { ImCancelCircle } from "react-icons/im";
import { FaRegCheckCircle } from "react-icons/fa";
import CustomButton from "../button/index";

const NotifyRuleModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div style={{backgroundColor:"#0D1831"}}className="modal-content">
                <h1>Thông báo</h1>
                <p>Bằng việc thực hiện thao tác này, bạn đồng ý với chính sách và điều khoản của chúng tôi.</p>
                Nếu bạn chưa đọc, xin vui lòng
                <a href='/rule' style={{color:"#F3EA28"}}>click vào đây</a>
                <CustomButton
                    defaultColor="#F3EA28" /* Default background color */
                    gradientFrom="#663399" /* Gradient start color */
                    gradientTo="#3366CC" /* Gradient end color */
                    textColor="#000000" /* Text color */
                    hoverTextColor="#FFFFFF" /* Text color on hover */
                    
                    text="Tôi đã hiểu và tiếp tục"
                    onClick={onClose}
                />
            </div>
        </div>
    );
};
export {NotifyRuleModal };