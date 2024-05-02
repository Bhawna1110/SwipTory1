import React, { useEffect, useState } from "react";
import "./Home.scss";
import StoryCard from "../../components/StoryCard/StoryCard";
import StoryCardImage from "../../assets/images/storyImage.jpg";
import CategoryCardImage from "../../assets/images/category_all.jpg";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { getCategory } from "../../apiCall";
import { useStateValue } from "../../StateProvider";
import StorySection from "./StorySection/StorySection";
import YourStory from "./YourStory/YourStory";

const Home = () => {
  const [{ category, userLoggedIn }, dispatch] = useStateValue();

  var categorySettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
          dots: false,
        },
      },
      {
        breakpoint: 1350,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 720,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const re = await getCategory();
      if (re?.status === 200) {
        dispatch({
          type: "SET_CATEGORY",
          category: re.data.data,
        });
      } else {
        toast.error(re?.response?.data?.message);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="home-container">
      <div className="category-slider-container">
        {category.length > 0 ? (
          <>
            <Slider {...categorySettings}>
              <CategoryCard
                data={{ name: "All", image: CategoryCardImage }}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
              {category.map((item, index) => (
                <CategoryCard
                  data={item}
                  id={index}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              ))}
            </Slider>
          </>
        ) : (
          <span>No Category Available</span>
        )}
      </div>
      {userLoggedIn && <YourStory />}

      {category.length > 0 ? (
        <>
          {category.map((item, index) => (
            <>
              {(activeCategory === item.name || activeCategory === "All") && (
                <StorySection category={item} />
              )}
            </>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Home;
