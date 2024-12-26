import { useNavigate } from "react-router";
export default function TransactionConfirmationPage()
{
    const navigate = useNavigate();

    const handleSubmit = () => {

    }
    const handleReturn = () => {
        navigate("/")
    }
    let count = 1;
    return(<div>
        <h1>Thanh toán</h1>
        <h3>Thông tin thanh toán</h3>
        <div>
            {filmName && <span>Phim: {filmName}</span>}
            {showDate && <span>Ngày chiếu: {showDate}</span>}
            {showTime && <span>Giờ chiếu: {showTime}</span>}
            {roomName && <span>Phòng chiếu: {roomName}</span>}
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mặt hàng</th>
                        <th>Số lượng</th>
                        <th>Đơn giá</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {/* ticket selection*/}
                    {
                        ticketSelections.map((ticketSelection) => {
                        return (<tr>
                            <td>{count++}</td>
                            <td>{ticketSelection.title}</td>
                            <td>{ticketSelection.quantity}</td>
                            <td>{ticketSelection.price}</td>
                            <td>{ticketSelection.quantity * ticketSelection.price}</td>
                            </tr>)
                        })
                    }
                    {/* seat selection*/}
                    {
                        (()=>{
                            for(let i = 0;i<seatSelections.length;i++){
                                for(let j = 0;j<seatSelections[i].length;j++){
                                    if(seatSelections[i][j].selected){
                                        return (<tr>
                                            <td>{count++}</td>
                                            <td>{seatSelections[i][j].name}</td>
                                            <td>1</td>
                                            <td>{seatSelections[i][j].price}</td>
                                            <td>{seatSelections[i][j].price}</td>
                                        </tr>)
                                    }
                                }     
                            } 
                        })()
                    }
                    {/* khac*/}
                    {
                        (()=>{
                            let cCount = 0, vCount = 0;
                            for(let i = 0;i<seatSelections.length;i++){
                                for(let j = 0;j<seatSelections[i].length;j++){
                                    if(seatSelections[i][j].selected){
                                        if(seatSelections[i][j].seatType==="V"){
                                            vCount++;
                                        }
                                        if((centerX1<=i&&i<=centerX2) && (centerY1<=j&&j<=centerY2)){
                                            cCount++;
                                        }
                                    }
                                }      
                            }
                            return(
                                <>
                                {vCount>0 && (<tr>
                                    <td>{count++}</td>
                                    <td>Ghế loại V</td>
                                    <td>{vCount}</td>
                                    <td>100000</td>
                                    <td>{vCount*10000}</td>
                                </tr>)}
                                {cCount>0 && (<tr>
                                    <td>{count++}</td>
                                    <td>Ghế loại C</td>
                                    <td>{cCount}</td>
                                    <td>80000</td>
                                    <td>{cCount*20000}</td>
                                </tr>)}
                                </>
                            )
                        })
                    }
                    {/* additional item selection*/}
                    {
                        additionalItemSelections.map((additionalItemSelection) => {
                        return (<tr>
                            <td>{count++}</td>
                            <td>{additionalItemSelection.title}</td>
                            <td>{additionalItemSelection.quantity}</td>
                            <td>{additionalItemSelection.price}</td>
                            <td>{additionalItemSelection.quantity * additionalItemSelection.price}</td>
                            </tr>)
                        })
                    }           
                </tbody>        
            </table>
        </div>
         <h3>Chọn phương thức thanh toán</h3>
        <div>
            <input type="radio" name="paymentMethod" value="cash"/>
            <label>Thanh toán tiền mặt</label>
            <input type="radio" name="paymentMethod" value="online"/>
            <label>Thanh toán qua momo</label>
        </div>
        <div>
            <button onClick={handleReturn}>Quay lại</button>
            <button onClick={handleSubmit}>Thanh toán</button>
        </div>
    </div>)
}