import React, { useEffect, useState } from "react";
import StoryCard from "../../../components/StoryCard/StoryCard";
import { getStoryDetail } from "../../../apiCall";
import { useStateValue } from "../../../StateProvider";
import toast from "react-hot-toast";
import "./StoryDetail.scss";
import { useParams } from "react-router-dom";

const StoryDetail = () => {
  const [, dispatch] = useStateValue();
  const [storyData, setStoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalStoryCount, setTotalStoryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const re = await getStoryDetail(id);
        if (re?.status === 200) {
          if (re.data.data) {
            setStoryData([re.data.data]);
            // setTotalStoryCount(re?.data?.data[0].count.count);
          }
        } else {
          toast.error(re?.response?.data?.message);
        }
      } catch {}
    };
    fetchData();
  }, [id]);
  return (
    <div className="your-story-container">
      <div className="title">Story </div>
      <div className="your-story-wrapper">
        {storyData.length > 0 ? (
          <>
            {storyData.map((item, index) => (
              <div onClick={() => openModal()}>
                <StoryCard data={item} id={index}  />
              </div>
            ))}
          </>
        ) : (
          <span> Storie Not Available</span>
        )}
      </div>
    
    </div>
  );
};

export default StoryDetail;
