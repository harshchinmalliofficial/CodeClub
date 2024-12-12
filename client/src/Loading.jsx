import { ClipLoader } from "react-spinners";
import PropTypes from "prop-types";

const Loading = ({ color = "brown", size = 50 }) => {
  return (
    <div className="loader-container">
      <ClipLoader color={color} size={size} />
    </div>
  );
};

// Validate props using PropTypes
Loading.propTypes = {
  color: PropTypes.string, // Color prop is expected to be a string
  size: PropTypes.number, // Size prop is expected to be a number
};

export default Loading;
