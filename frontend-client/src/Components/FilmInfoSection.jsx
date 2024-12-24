const FilmInfoSection = ({ className, filmDescription, filmContent }) => {
  // Function to split description into lines
  const renderDescription = (text) => {
    // Split text by line breaks (assuming "\n" represents line breaks)
    return text.split("\n").map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <div className={className}>
      <div>
        <h2 className="font-interBold">MÔ TẢ</h2>
        <div className="flex flex-col text-lg items-start justify-start mt-3">
          {renderDescription(filmDescription)}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="font-interBold">NỘI DUNG PHIM</h2>
        <div className="flex flex-col text-lg items-start justify-start mt-3">
          {filmContent}
        </div>
      </div>
    </div>
  );
};

export default FilmInfoSection;
