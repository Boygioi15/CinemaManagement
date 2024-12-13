const FilmInfoSection = ({ className }) => {
    return (
      <div className={className}>
        <div>
          <h2>MÔ TẢ</h2>
          <div className="flex flex-col items-start justify-start film-description mt-3">
            <p>Đạo diễn: Khương Ngọc</p>
            <p>
              Diễn viên: Việt Hương, Hồng Đào, Lê Khánh, Đinh Y Nhung, Ngọc Trinh
            </p>
            <p>Khởi chiếu: Thứ Sáu, 13/12/2024</p>
          </div>
        </div>
        <div className="mt-8">
          <h2>NỘI DUNG PHIM</h2>
          <div className="flex flex-col items-start justify-start film-description mt-3">
            <p>
              Chuyện bắt đầu khi bà Nhị - con dâu cả của gia đình quyết định nhân
              dịp đám giỗ của mẹ chồng, tụ họp cả bốn chị em gái - con ruột trong
              nhà lại để thông báo chuyện sẽ tự bỏ tiền túi ra sửa sang căn nhà từ
              đường cũ kỹ trước khi bão về. Vấn đề này khiến cho nội bộ gia đình
              bắt đầu có những lục đục, chị dâu và các em chồng cũng xảy ra mâu
              thuẫn, bất hoà. Dần dà những sự thật đằng sau việc "bằng mặt mà
              không bằng lòng" giữa các chị em cũng dần được hé lộ, những bí mật,
              nỗi đau sâu
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default FilmInfoSection;