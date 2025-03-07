import PropTypes from "prop-types";

const Card = ({ 
  children, 
  title, 
  className = '', 
  onClick = null,
  hoverEffect = false
}) => {
  const hoverClass = hoverEffect ? 'hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${hoverClass} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  hoverEffect: PropTypes.bool,
};
export default Card;