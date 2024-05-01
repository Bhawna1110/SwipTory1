import React, { useEffect, useState } from "react";
import StoryCardImage from "../../../assets/images/storyImage.jpg";
import StoryCard from "../../../components/StoryCard/StoryCard";
import { getStory, storyBookmark, storyBookmarkList } from "../../../apiCall";
import { useStateValue } from "../../../StateProvider";
import toast from "react-hot-toast";
import "./Bookmark.scss";
import StoryView from "../../../components/StoryView/StoryView";

const Bookmark = ({ category }) => {
  const [{bookmarks}, dispatch] = useStateValue();
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
      const re = await storyBookmarkList(page);
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
  }, [page]);
  return (
    <div className="bookmark-container">
      <div className="title">Your Bookmarks </div>
      <div className="bookmark-wrapper">
        {storyData.length > 0 ? (
          <>
            {storyData.map((item, index) => (
              <div >
                {bookmarks.some((story) => story === item._id) ?
                <StoryCard data={item} id={index} />:""}
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
      {/* <StoryView
        data={storyData}
        isOpen={isModalOpen}
        onClose={closeModal}
        disableScroll={isModalOpen}
      /> */}
    </div>
  );
};

export default Bookmark;
