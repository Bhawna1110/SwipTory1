import React, { useEffect, useState } from "react";
import StoryCardImage from "../../../assets/images/storyImage.jpg";
import StoryCard from "../../../components/StoryCard/StoryCard";
import { getStory } from "../../../apiCall";
import { useStateValue } from "../../../StateProvider";
import toast from "react-hot-toast";
import "./StorySection.scss";
import StoryView from "../../../components/StoryView/StoryView";

const StorySection = ({ category }) => {
  const [, dispatch] = useStateValue();
  const [storyData, setStoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalStoryCount, setTotalStoryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      const re = await getStory(category._id, page);
      if (re?.status === 200) {
        if (re.data.data.length > 0) {
          setStoryData([...storyData, ...re.data.data[0].list]);
          setTotalStoryCount(re.data.data[0].count.count);
        }
      } else {
        toast.error(re?.response?.data?.message);
      }
    };
    fetchData();
  }, [category._id, page]);
  return (
    <div className="home-story-container">
      <div className="title">Top Stories About {category.name}</div>
      <div className="home-story-wrapper">
        {storyData.length > 0 ? (
          <>
            {storyData.map((item, index) => (
              <div >
                <StoryCard data={item} id={index} />
              </div>
            ))}
          </>
        ) : (
          <span>No stories Available</span>
        )}
      </div>
      {totalStoryCount !== storyData.length && (
        <button className="btn-red" onClick={() => setPage(page + 1)}>
          {" "}
          See More
        </button>
      )}
      <StoryView
        data={storyData}
        isOpen={isModalOpen}
        onClose={closeModal}
        disableScroll={isModalOpen}
      />
    </div>
  );
};

export default StorySection;
