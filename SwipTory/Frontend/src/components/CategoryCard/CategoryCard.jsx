import React from "react";
import "./CategoryCard.scss";
import CategoryCardImage from "../../assets/images/Food.png";

const CategoryCard = ({ data, activeCategory, setActiveCategory }) => {
  return (
    <div
      className={`${
        activeCategory === data.name
          ? "active category-card-wrapper"
          : "category-card-wrapper"
      }`}
      style={{ backgroundImage: `url(${data.image})` }}
      onClick={() => setActiveCategory(data.name)}
    >
      <div className="content">
        <h3>{data?.name}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
