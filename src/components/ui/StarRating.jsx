import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const StarRating = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => (
        <span key={index}>
          {index < rating ? (
            <AiFillStar className="text-yellow-500 text-xl" />
          ) : (
            <AiOutlineStar className="text-gray-400 text-xl" />
          )}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
