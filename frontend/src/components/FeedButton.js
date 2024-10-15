import '../Styles/FeedButton.css';

const FeedButton = ({handleClick}) => {
  return (
    <button      
      className="btn btn-primary-curar" onClick={handleClick}
    >
      Curar
    </button>
  );
};

export default FeedButton;
