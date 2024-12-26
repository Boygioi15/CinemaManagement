import { useEffect, useState } from "react"
import axios from "axios";
import './oStyle.css'
import screen from "../../assets/blackScreen.png"
import AdditionalItemCard from "../../components/AdditionalItemCard/AdditionalItemCard";
import { useNavigate } from "react-router";
const seatWidth = 50;
const seatHeight = 40;
const gapX = 5;
const gapY = 5;

const lockedSeats = [{i: 1,j:2},{i:2,j:2}]
export default function OffLineTicketBooking(){
    const [filmShowList, setFilmShowList] = useState([]);
    const [filmName, setFilmName] = useState("");
    const [date, setDate] = useState();
    const [selectedFilmShow, setSelectedFilmShow] = useState();

    const [ticketSelection, setTicketSelection] = useState([]);
    
    const [totalTicket_Single, setTotalTicket_Single] = useState(0);
    const [totalTicket_Pair, setTotalTicket_Pair] = useState(0);

    const [usedSingle, setUsedSingle] = useState(0);
    const [usedPair, setUsedPair] = useState(0);
    //update total ticket
    useEffect(()=>{
        updateTotalTicket();
    },[ticketSelection])
    const updateTotalTicket = () => {
        let single = 0, pair = 0;
        for(let i = 0; i<ticketSelection.length;i++){
            if(!ticketSelection[i].isPair){
                single+=ticketSelection[i].quantity;
            }
            else{
                pair+=ticketSelection[i].quantity;
            }
        }
        setTotalTicket_Single(single);
        setTotalTicket_Pair(pair);
    }
    //fetch ticket type
    useEffect(()=>{
        try{
            const fetchTicketType = async () => {
                const response = await axios.get("http://localhost:8000/api/param/ticket-type");
                setTicketSelection(
                    response.data.data.map((ticketType) => ({
                        ...ticketType,
                        quantity: 0
                    }))
                )
            } 
            fetchTicketType();
        }catch (error) {
            if (error.response) {
                alert(`Lấy thông tin loại vé thất bại, lỗi: ` + error.response.data.msg);
            } else if (error.request) {
                alert('Không nhận được phản hồi từ server');
            } else {
                alert('Lỗi bất ngờ: ' + error.message);
            }
        }
    },[])
    const filteredFilmShow = filmShowList.filter((element)=> 
        element.filmName === filmName 
        //date
    );

    const [roomDetail, setRoomDetail] = useState();
    const [roomSeat,setRoomSeat] = useState();
    const fetchRoom = async () => {
        try{
            const response = await axios.get("http://localhost:8000/api/rooms/676b6c0db2621ba199d649a1");
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

    const handleSelectSeat = (row, col) =>{
        const updatedRoomSeat = [...roomSeat]; 
        if(updatedRoomSeat[row][col-1].seatType==="P"){
            col--;
        }
        if(updatedRoomSeat[row][col].seatType===""){
            return;
        }
        if(updatedRoomSeat[row][col].booked){
            return;
        }
        if(updatedRoomSeat[row][col].selected){
            updatedRoomSeat[row][col].selected=false;
            setRoomSeat(updatedRoomSeat)
            return;
        }
        if(!updatedRoomSeat[row][col].enabled){
            return;
        }
        updatedRoomSeat[row][col].selected=true;
        setRoomSeat(updatedRoomSeat)
    }
    const updateUsedTicket = () => {
        if(!roomSeat){
            return;
        }
        let usedSingle = 0, usedPair = 0;
        for(let i = 0;i<roomSeat.length;i++){
            for(let j = 0;j<roomSeat.length;j++){
                if(roomSeat[i][j].selected){
                    if(roomSeat[i][j].seatType==="P"){
                        usedPair++;
                    }
                    else{
                        usedSingle++;
                    }
                }
            }
        }
        setUsedSingle(usedSingle);
        setUsedPair(usedPair)
    }
    const setBookedSeat = () => {
        const bookedSeatPoss = lockedSeats;
        const updatedSeat = roomSeat;
        for(const bookedSeatPos of bookedSeatPoss){
            updatedSeat[bookedSeatPos.i][bookedSeatPos.j].booked = true;
        }
        setRoomSeat(updatedSeat)
    }
    //update room seat effect
    useEffect(()=>{
        if(!roomSeat){
            return;
        }
        setBookedSeat();
        updateUsedTicket();
    },[roomSeat])
    //update enable seat
    useEffect(()=>{
        if(!roomSeat){
            return;
        }
        const updatedRoomSeat = [...roomSeat];
        //disable all
        if(usedSingle>=totalTicket_Single){
            for(let i = 0;i<updatedRoomSeat.length;i++){
                for(let j = 0;j<updatedRoomSeat.length;j++){
                    if(updatedRoomSeat[i][j].seatType!=="P"){
                        updatedRoomSeat[i][j].enabled = false;
                    }    
                }
            }
        }
        else{
            for(let i = 0;i<updatedRoomSeat.length;i++){
                for(let j = 0;j<updatedRoomSeat.length;j++){
                    if(updatedRoomSeat[i][j].seatType!=="P"){
                        updatedRoomSeat[i][j].enabled = true;
                        //console.log(`${i},${j} ${updatedRoomSeat[i][j].enabled} `)
                    }    
                }
            }
        }
        setRoomSeat(updatedRoomSeat)
    },[usedSingle,totalTicket_Single])
    useEffect(()=>{
        if(!roomSeat){
            return;
        }
        const updatedRoomSeat = [...roomSeat];
        //disable all
        if(usedPair>=totalTicket_Pair){
            for(let i = 0;i<updatedRoomSeat.length;i++){
                for(let j = 0;j<updatedRoomSeat.length;j++){
                    if(updatedRoomSeat[i][j].seatType==="P"){
                        updatedRoomSeat[i][j].enabled = false;
                    }    
                }
            }
        }
        else{
            for(let i = 0;i<updatedRoomSeat.length;i++){
                for(let j = 0;j<updatedRoomSeat.length;j++){
                    if(updatedRoomSeat[i][j].seatType==="P"){
                        updatedRoomSeat[i][j].enabled = true;
                    }    
                }
            }
        }
        setRoomSeat(updatedRoomSeat)
    },[usedPair,totalTicket_Pair])


    //////////////////////////////HANDLE SUBMISSION
    const [additionalItemSelections, setAdditionalItemSelections] = useState([]);
    //useEffect(()=>{additionalItemSelections.map((elemt)=>{console.log(elemt)})},[additionalItemSelections])
    const [currentPage, setCurrentPage] = useState(1);
    //fetch additional item
    useEffect(()=>{
        try{
            const fetchAdditionalItem = async () => {
                const response = await axios.get("http://localhost:8000/api/additional-items");
                setAdditionalItemSelections(
                    response.data.data.map((additional) => ({
                        ...additional,
                        quantity: 0
                    }))
                )
            } 
            fetchAdditionalItem();
        }catch (error) {
            if (error.response) {
                alert(`Lấy thông tin sản phẩm ngoài thất bại, lỗi: ` + error.response.data.msg);
            } else if (error.request) {
                alert('Không nhận được phản hồi từ server');
            } else {
                alert('Lỗi bất ngờ: ' + error.message);
            }
        }
    },[])
    const navigate = useNavigate();
    const handleSubmitPage1 = () => {
        //check if total selected match total seats
        let totalSelected = 0;
        for(let i = 0;i<roomSeat.length;i++){
            for(let j = 0;j<roomSeat.length;j++){
                if(roomSeat[i][j].selected){
                    totalSelected++;
                }
            }
        }
        if(totalSelected!==totalTicket_Single+totalTicket_Pair){
            alert("Vui lòng chọn đủ số lượng vé trước khi tiếp tục");
            return;
        }
        setCurrentPage(2);
    }
    
    const handleSubmitPage2 = () => {
       
        navigate("/transaction-confirmation-page");
    }
    const handleReturnToPage1 = () => {
        setCurrentPage(1);
    }
    return (
    <>
        {
            currentPage === 1? (
                <div className="OfflineTicketPage">
                <h1>Tạo vé trực tiếp</h1>
                <h3>Chọn suất chiếu</h3>
                <div className="filtering">
                    <label >Tên phim: </label>
                    <select className="select" id="movie" name="movie">
                        <option value="">Chọn phim</option>
                        <option value="movie1">Phim 1</option>
                        <option value="movie2">Phim 2</option>
                    </select>
                
                    <label >Ngày chiếu: </label>
                    <select className="select" id="date" name="date">
                        <option value="">Chọn ngày</option>
                        <option value="2024-12-21">21/12/2024</option>
                        <option value="2024-12-22">22/12/2024</option>
                    </select>
                    
                    <label >Suất chiếu: </label>
                    <select className="select" id="time" name="time">
                        <option value="">Chọn giờ</option>
                        <option value="10:00">10:00</option>
                        <option value="13:00">13:00</option>
                    </select>
                </div>
                <h3>Chọn loại vé</h3>
                <div className="select-ticket">
                    {ticketSelection.map((element)=> {
                        return (
                            <div className="row" key={element._id}>
                                <label>
                                    Vé {element.title}<br/> <b>{`${element.price}đ/ vé`}</b>
                                </label>
                                <input 
                                    className="input"
                                    type="number"
                                    value={element.quantity}
                                    onChange={(e) => {
                                        let updatedQuantity = Number(e.target.value); 
                                        if(updatedQuantity<0)
                                            updatedQuantity=0// Parse the new quantity
                                        setTicketSelection((prev) =>
                                            prev.map((item) =>
                                                item._id === element._id // Match by id
                                                ? { ...item, quantity: updatedQuantity } // Update the quantity for the matched item
                                                : item // Keep other items unchanged
                                            )
                                        );
                                    }}
                                />
        
                            </div>
                        )
                    })}    
                </div>
                {roomDetail && roomSeat &&
                    <RoomDisplay roomSeat={roomSeat} roomName={roomDetail.roomName} 
                        center={{
                            x1: roomDetail.centerX1,
                            x2: roomDetail.centerX2,
                            y1: roomDetail.centerY1,
                            y2: roomDetail.centerY2
                        }}
                        handleSelectSeat={handleSelectSeat}
                    />
                }
                {roomDetail && roomSeat && <BottomBar filmName="Alibaba" date="20-12-2024" time="10:30" roomName={roomDetail.roomName} seatSelections={roomSeat} 
                    ticketSelections={ticketSelection}
                    centerX1={roomDetail.centerX1}
                    centerX2={roomDetail.centerX2}
                    centerY1={roomDetail.centerY1}
                    centerY2={roomDetail.centerY2}
                    onPage1Submit={handleSubmitPage1}
                    onPage2Submit={handleSubmitPage2}
                    onReturnToPage1={handleReturnToPage1}
                    currentPage={currentPage}
                    additionalItemSelections={additionalItemSelections}
                />}
                </div> 
            )
            :
            (
                <>
                {additionalItemSelections && (<div className="OfflineTicketPage">
                    <h1>Chọn các sản phẩm ngoài</h1>
                    <div className="OtherSelection">
                        {additionalItemSelections.map((element)=> {
                            return(
                                <AdditionalItemCard key={element._id} itemDetail={element} 
                                onChangeQuantity={
                                    (newQuantity) => {
                                        if(newQuantity<0){
                                            return;
                                        }
                                        if(newQuantity>4){
                                            alert("Bạn chỉ có thể mua tối đa 4 sản phẩm loại này")
                                            return;
                                        }
                                        setAdditionalItemSelections((prev) =>
                                            prev.map((item) =>
                                                item._id === element._id // Match by id
                                                ? { ...item, quantity: newQuantity } // Update the quantity for the matched item
                                                : item // Keep other items unchanged
                                            )
                                        );
                                    }
                                }/>
                            )
                        })
                        }
                    {roomDetail && roomSeat && <BottomBar filmName="Alibaba" date="20-12-2024" time="10:30" roomName={roomDetail.roomName} seatSelections={roomSeat} 
                            ticketSelections={ticketSelection}
                            centerX1={roomDetail.centerX1}
                            centerX2={roomDetail.centerX2}
                            centerY1={roomDetail.centerY1}
                            centerY2={roomDetail.centerY2}
                            onPage1Submit={handleSubmitPage1}
                            onPage2Submit={handleSubmitPage2}
                            onReturnToPage1={handleReturnToPage1}
                            currentPage={currentPage}
                            additionalItemSelections={additionalItemSelections}
                        />  
                    }
                    </div>
                    
                    <button onClick={handleReturnToPage1}>Quay lại</button>
                </div>)}
                </>
            )
        }
    </>
   
    )
}



function RoomDisplay({ roomSeat, roomName, handleSelectSeat, center}) {
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
                                                    <SeatSlot key={seatIndex} selected = {seat.selected} disabled={seat.booked || !seat.enabled} label={seat.seatName} seatType={seat.seatType} handleOnClick={() => handleSelectSeat(rowIndex, seatIndex)}>
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

function SeatSlot({ label, seatType, handleOnClick, selected, disabled, children }) {
    if(seatType===""){
        return <div onClick={handleOnClick}className={"Create_SeatSlot_Empty "}>{children}</div>;
    }
    else if(seatType==="N"){
        return <div onClick={handleOnClick}className={"Create_SeatSlot_Normal " + (selected? "bgS":(disabled? "dN":"bgN"))}>{label}{children}</div>;
    }
    else if(seatType==="V"){
        return <div onClick={handleOnClick}className={"Create_SeatSlot_VIP " + (selected? "bgS":(disabled? "dV":"bgV"))}>{label}{children}</div>;
    }
    else if(seatType==="P"){
        return <div onClick={handleOnClick}className={"Create_SeatSlot_Pair " + (selected? "bgS":(disabled? "dP":"bgP"))}>{label}{children}</div>;
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
            <div className="item">
                <div className="box-selected"/> 
                Đang chọn
            </div>
            <div className="item">
                <div className="box-booked"/> 
                Đã được đặt/ <br/> Không thể chọn
            </div>
        </div>
    )
}

function BottomBar({filmName, date, time, roomName, seatSelections, center, ticketSelections,additionalItemSelections,
                    centerX1, centerX2, centerY1, centerY2, currentPage, onPage1Submit, onPage2Submit, onReturnToPage1
}){
    return(
        <div className="BottomBar">
            <div className="TransactionInfo">
                <h2>{filmName}</h2>              
                    {/*ticket*/}  
                    {(()=>{
                        let string = "";
                        let exist = false;
                        for(let i = 0;i<ticketSelections.length;i++){
                            if(ticketSelections[i].quantity>0){
                                if(string!==""){
                                    string = string.concat(`, ${ticketSelections[i].quantity}x ${ticketSelections[i].title}`);
                                }
                                else{
                                    string = string.concat(`${ticketSelections[i].quantity}x ${ticketSelections[i].title}`);
                                }
                                
                                exist = true;
                            }            
                        }
                        if(exist){
                            return (
                                <>
                                    Thông tin vé: {string}
                                    <br />
                                </>
                            );
                        }
                        return null;
                    })()}
                    {/*seat*/} 
                    {
                        (()=>{
                            let string = "";
                            let exist = false;
                            for(let i = 0;i<seatSelections.length;i++){
                                for(let j = 0;j<seatSelections[i].length;j++){
                                    if(seatSelections[i][j].selected){
                                        if(string===""){
                                            string = string.concat(seatSelections[i][j].seatName);
                                        }
                                        else{
                                            string = string.concat(`, ${seatSelections[i][j].seatName}`)
                                        }
                                        exist = true
                                    }
                                }      
                            }
                            if(exist){
                                return (
                                    <>
                                        Tên phòng: {roomName}| Các ghế đã chọn: {string}
                                        <br />
                                    </>
                                );
                            }
                            return null;
                        })()
                    } 
                    {/*other*/}
                    {
                        (()=>{
                            let vCount = 0, cCount = 0;
                            let vExist = false, cExist = false;
                            for(let i = 0;i<seatSelections.length;i++){
                                for(let j = 0;j<seatSelections[i].length;j++){
                                    if(seatSelections[i][j].selected){
                                        //console.log(seatSelections[i][j].seatType)
                                        if(seatSelections[i][j].seatType==="V"){
                                            vCount++;
                                            vExist = true;
                                        }
                                        if((centerX1<=i&&i<=centerX2) && (centerY1<=j&&j<=centerY2)){
                                            cCount++;
                                            cExist = true;
                                        }
                                    }
                                }      
                            }
                            let string = "Khác: ";
                            if(vExist || cExist){
                                if(vExist){
                                    string = string.concat(`${vCount}x ghế VIP, `);
                                }
                                if(cExist){
                                    string = string.concat(`${cCount}x ghế trung tâm, `);
                                }
                                return (
                                    <>
                                        {string}
                                        <br />
                                    </>
                                );
                            }
                            return null;
                        })()
                    }
                    {/*additional item*/}
                    {
                        (()=>{
                            let exist = false;
                            for(let i = 0;i<additionalItemSelections.length;i++){
                                if(additionalItemSelections[i].quantity>0){
                                    exist = true;
                                }            
                            }
                            if(exist){
                                return(
                                    <>
                                        Sản phẩm ngoài: 
                                        <br/>
                                        {additionalItemSelections.map((element)=> {
                                            if(element.quantity>0){
                                                return (
                                                    <div key={element._id}>
                                                        {element.quantity}x {element.name}
                                                        <br/>
                                                    </div>
                                                    
                                                    
                                                )
                                            }
                                            return null;
                                        })}
                                        <br />
                                    </>
                                )
                            }
                            
                        })()
                    }
            </div>
            <div>
                <div>
                    <h2>Tạm tính</h2>
                    {
                        (()=>{
                            let total = 0;
                            let vCount = 0, cCount = 0;
                            for(let i = 0;i<ticketSelections.length;i++){
                                total+=ticketSelections[i].quantity*ticketSelections[i].price;
                            }
                            for(let i = 0;i<seatSelections.length;i++){
                                for(let j = 0;j<seatSelections[i].length;j++){
                                    if(seatSelections[i][j].selected){
                                        //console.log(seatSelections[i][j].seatType)
                                        if(seatSelections[i][j].seatType==="V"){
                                            vCount++;
                                        }
                                        if((centerX1<=i&&i<=centerX2) && (centerY1<=j&&j<=centerY2)){
                                            cCount++;
                                        }
                                    }
                                }      
                            }
                            total+=vCount*20000+cCount*10000;
                            for(let i = 0;i<additionalItemSelections.length;i++){
                                total+=additionalItemSelections[i].quantity*additionalItemSelections[i].price;
                            }
                            return total;
                        })()
                    }
                </div>
                {currentPage === 1? (
                    <button onClick={onPage1Submit}>
                        Tiếp tục
                    </button>
                    )
                    : 
                    (
                        <div style={{display: "flex", flexDirection: "row", gap: "10px"}}> 
                            <button onClick={onReturnToPage1}>
                                Trở lại
                            </button>
                            <button onClick={onPage2Submit}>
                                Xác nhận
                            </button>
                        </div>
                    )
            }
                
            </div> 
        </div>
    )
}
