import { useEffect, useState } from "react"
import axios from "axios";
import screen from "../../assets/blackScreen.png"
import AdditionalItemCard from "../../components/AdditionalItemCard/AdditionalItemCard";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
const seatWidth = 50;
const seatHeight = 40;
const gapX = 5;
const gapY = 5;

export default function ViewRoompage(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [roomDetail, setRoomDetail] = useState();
    const [roomSeat,setRoomSeat] = useState();
    const fetchRoom = async () => {
        try{
            const response = await axios.get(`http://localhost:8000/api/rooms/${id}`);
            setRoomDetail(response.data.data)
        }catch (error) {
            if (error.response) {
                alert(`Lấy thông tin phòng thất bại, lỗi: ` + error.response.data.msg);
            } else if (error.request) {
                alert('Không nhận được phản hồi từ server');
            } else {
                alert('Lỗi bất ngờ: ' + error.message);
            }
        }
    }

    //init room
    useEffect(()=>{
        fetchRoom();
    },[])
    //init room seat
    useEffect(()=>{
        if(!roomDetail){
            return
        }
        const appendedSeat = roomDetail.seats.map(row => 
            row.map(seat => ({
                ...seat, // Preserve exi    sting properties
                selected: false,
                enabled: false,
                booked: false
            }))
        );
        setRoomSeat(appendedSeat)
    },[roomDetail])

    return (
        <div className="OfflineTicketPage">
                {roomDetail && roomSeat &&
                    <RoomDisplay roomSeat={roomSeat} roomName={roomDetail.roomName} 
                        center={{
                            x1: roomDetail.centerX1,
                            x2: roomDetail.centerX2,
                            y1: roomDetail.centerY1,
                            y2: roomDetail.centerY2
                        }}
                    />
                }
            <div className="confirmBar">
                <button onClick={()=>navigate('/admin/co-so-vat-chat')} className="confirm-button">Trở về</button>
            </div>
        </div>             
    )
            
}



function RoomDisplay({ roomSeat, roomName, center}) {
    let flag = false;
    return (
        <div className="RoomDisplay">
            <h1>{roomName}</h1>
            <div className="screen">
                <img src={screen} alt="Screen" />
                <h1 className="center-text">Màn hình</h1>
            </div>
            
            <div className="Create_RoomSeats">
                <div className="col">
                    {roomSeat.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            <span className="row-label">{String.fromCharCode(65 + rowIndex)}</span>
                            <div className="seatRow">
                                {
                                    // Use for loop to iterate over the seats in the row
                                    (() => {
                                        const seatSlots = [];
                                        for (let seatIndex = 0; seatIndex < row.length; seatIndex++) {
                                            const seat = row[seatIndex];
                                            if(seat.seatType===""){
                                                seatSlots.push(
                                                    <SeatSlot key={seatIndex} seatType={seat.seatType}>
                                                       {!flag &&
                                                        center.x1 >= 0 &&
                                                        center.y1 >= 0 &&
                                                        center.x2 >= 0 &&
                                                        center.y2 >= 0 &&
                                                        center.x2 >= center.x1 &&
                                                        center.y2 >= center.y1 && (                          
                                                            <>
                                                            {flag=true}
                                                            <div                                                     
                                                                style={{
                                                                position: "absolute",
                                                                borderColor: "red",
                                                                borderRadius: "5px",
                                                                borderWidth: "2px",
                                                                borderStyle: "solid",
                                                                top: - 4 + (center.x1)*(seatHeight+gapY),
                                                                left: - 4 + (center.y1)*(seatWidth+gapX),
                                                                width:
                                                                    (center.y2 - center.y1 + 1) * seatWidth +
                                                                    (center.y2 - center.y1) * gapX +
                                                                    7 + 0,
                                                                height:
                                                                    (center.x2 - center.x1 + 1) * seatHeight +
                                                                    (center.x2 - center.x1) * gapY +
                                                                    7 + 0, 
                                                                boxSizing: "border-box",
                                                                zIndex: -1,
                                                                }}
                                                            />
                                                            </>
                                                        )}
                                                    </SeatSlot>
                                                );
                                            }
                                            else{
                                                seatSlots.push(
                                                    <SeatSlot key={seatIndex} selected = {seat.selected} disabled={seat.booked || !seat.enabled} label={seat.seatName} seatType={seat.seatType}>
                                                        {!flag &&
                                                        center.x1 >= 0 &&
                                                        center.y1 >= 0 &&
                                                        center.x2 >= 0 &&
                                                        center.y2 >= 0 &&
                                                        center.x2 >= center.x1 &&
                                                        center.y2 >= center.y1 && (                          
                                                            <>
                                                            {flag=true}
                                                            <div                                                     
                                                                style={{
                                                                position: "absolute",
                                                                borderColor: "red",
                                                                borderRadius: "10px",
                                                                borderWidth: "4px",
                                                                borderStyle: "solid",
                                                                top: - 4 + (center.x1)*(seatHeight+gapY),
                                                                left: - 4 + (center.y1)*(seatWidth+gapX),
                                                                width:
                                                                    (center.y2 - center.y1 + 1) * seatWidth +
                                                                    (center.y2 - center.y1) * gapX +
                                                                    7 + 0,
                                                                height:
                                                                    (center.x2 - center.x1 + 1) * seatHeight +
                                                                    (center.x2 - center.x1) * gapY +
                                                                    7 + 0, 
                                                                boxSizing: "border-box",
                                                                zIndex: -1,
                                                                }}
                                                            />
                                                            </>
                                                        )}
                                                    </SeatSlot>
                                                );
                                            }
                                            if(seat.seatType==="P"){
                                                seatIndex++;
                                            }
                                        }
                                        return seatSlots;
                                    })()
                                }
                            </div>
                        </div>
                    ))}
                </div>
                <SeatLegend />
            </div>
        </div>
    );
}

function SeatSlot({ label, seatType, selected, disabled, children }) {
    if(seatType===""){
        return <div className={"Create_SeatSlot_Empty "}>{children}</div>;
    }
    else if(seatType==="N"){
        return <div className={"Create_SeatSlot_Normal " + (selected? "bgS":(disabled? "dN":"bgN"))}>{label}{children}</div>;
    }
    else if(seatType==="V"){
        return <div className={"Create_SeatSlot_VIP " + (selected? "bgS":(disabled? "dV":"bgV"))}>{label}{children}</div>;
    }
    else if(seatType==="P"){
        return <div className={"Create_SeatSlot_Pair " + (selected? "bgS":(disabled? "dP":"bgP"))}>{label}{children}</div>;
    }
    
}
function SeatLegend(){
    return (
        <div className="Room-Legend">
            <div className="item">
                <div className="box-unselected"/> 
                Trống
            </div>
            <div className="item">
                <div className="box-normal"/> 
                Ghế thường
            </div>
            <div className="item">
                <div className="box-VIP"/> 
                Ghế VIP
            </div>
            <div className="item">
                <div className="box-pair"/> 
                Ghế đôi
            </div>
        </div>
    )
}