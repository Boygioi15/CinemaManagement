import userModel from "../user/user.schema.js";
import transporter from "./email.config.js";

export class EmailService {
  static sendEmail = async (to, subject, text) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
      });
      console.log("Email sent successfully!");
      return true;
    } catch (error) {
      console.error("Error sending email:", error.message);
      return false;
    }
  };

  static storeConfirmCode = async (userEmail, verification) => {
    const expirationTime = new Date(Date.now() + 3 * 60 * 1000); // 3 phút từ thời điểm gửi mã
    return await userModel.findOneAndUpdate({
      userEmail,
    }, {
      userVerificationCode: verification,
      userVFCodeExpirationTime: expirationTime,
    }, {
      new: true,
    });
  };

  static sendEmailWithHTMLTemplate = async (to, subject, ticket) => {
    console.log("🚀 ~ EmailService ~ sendEmailWithHTMLTemplate= ~ ticket:", ticket)
    try {
      const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cinestar Cinemas</title>
          <style>
            table {
              border-collapse: collapse;
              width: 100%;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border: 1px solid black;
            }
            .tableSeat th {
              background-color: #6b3fa4;
              color: white;
            }
            .purple-text {
              color: #6b3fa4;
            }
          </style>
        </head>
        <body>
          <div>
            <h1>CINESTAR CINEMAS</h1>
            <p>CineStar Bình Dương</p>
            <p>
              Nhà văn hóa sinh viên, Đại học Quốc gia HCM, P.Đông Hòa, Dĩ An, Bình Dương
            </p>
          </div>
      
          <h1 class="purple-text">XÁC NHẬN ĐẶT VÉ THÀNH CÔNG</h1>
      
          <h2 style="color: black">MÃ ĐẶT VÉ: ${ticket.verifyCode}</h2>
      
          <table class="information">
            <tr>
              <th>PHIM</th>
              <td>${ticket?.filmShow?.filmName|| 'Không'}</td>
            </tr>
            <tr>
              <th>SUẤT CHIẾU</th>
               <td>${(ticket?.filmShow?.showTime && ticket?.filmShow?.showDate) ? `${ticket?.filmShow?.showTime}, ${ticket?.filmShow?.showDate}` : 'Không'}</td>
            </tr>
            <tr>
              <th>PHÒNG CHIẾU</th>
              <td>${ticket?.filmShow?.roomName || 'Không'}</td>
            </tr>
            <tr>
              <th>RẠP</th>
              <td>CINESTAR BINH DUONG</td>
            </tr>
            <tr>
              <th>SỐ GHẾ</th>
              <td>${ticket?.filmShow?.seatNames?.length ? ticket?.filmShow?.seatNames.join(", ") : 'Không'}</td>
            </tr>
            ${
              ticket.items.length > 0
                ? `<tr>
                     <th>Đồ ăn</th>
                     <td>${ticket.items
                       .map((item) => `${item.name} x${item.quantity}`)
                       .join(", ")}</td>
                   </tr>`
                : ""
            }
             ${
               ticket?.filmShow?.tickets.length > 0
                 ? `<tr>
                     <th>Loại vé</th>
                     <td>${ticket?.filmShow?.tickets
                       .map((item) => `${item.name} x${item.quantity}`)
                       .join(", ")}</td>
                   </tr>`
                 : ""
             }
          </table>
      
          ${
            ticket.items.length > 0 || ticket?.filmShow?.tickets.length > 0
              ? (() => {
                  let currentIndex = 0;
                  return `
                    <table class="tableSeat" style="margin-top: 50px;">
                      <tr>
                        <th>STT</th>
                        <th>MẶT HÀNG</th>
                        <th>SỐ LƯỢNG</th>
                        <th>ĐƠN GIÁ (VND)</th>
                        <th>THÀNH TIỀN (VND)</th>
                      </tr>
                      ${ticket.items
                        .map(
                          (item, index) => `
                          <tr>
                            <td>${currentIndex + index + 1}</td>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.unitPrice}</td>
                            <td>${item.quantity * item.unitPrice}</td>
                          </tr>`
                        )
                        .join("")}
                      ${(() => {
                        currentIndex += ticket.items.length;
                        return ticket?.filmShow?.tickets
                          .map(
                            (item, index) => `
                            <tr>
                              <td>${currentIndex + index + 1}</td>
                              <td>${item.name}</td>
                              <td>${item.quantity}</td>
                              <td>${item.unitPrice}</td>
                              <td>${item.quantity * item.unitPrice}</td>
                            </tr>`
                          )
                          .join("");
                      })()}
                      <tr style="background-color: #6b3fa4; color: white">
                        <td colspan="4">TỔNG TIỀN (VND)</td>
                        <td>${ticket.totalPrice}</td>
                      </tr>
                    </table>`;
                })()
              : ""
          }
      
          <p>
            Cảm ơn Quý khách đã xem phim tại Cinestar. Chúc Quý khách một buổi xem phim vui vẻ!
          </p>
        </body>
      </html>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: htmlTemplate,
      });

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };
}