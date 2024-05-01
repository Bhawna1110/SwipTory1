import React, { useState } from "react";
import "./StoryCard.scss";
import StoryCardImage from "../../assets/images/storyImage.jpg";
import StoryView from "../StoryView/StoryView";
import { FaRegEdit } from "react-icons/fa";
import UpdateStoryModal from "../UpdateStoryModal/UpdateStoryModal";

const StoryCard = ({ data, isEditable = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isstoryViewModalOpen, setIsStoryViewModalOpen] = useState(false);
  const [cardData, setCardData] = useState(data);
  console.log(cardData)

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openStoryViewModal = () => {
    setIsStoryViewModalOpen(true);
  };
  const closeStoryViewModal = () => {
    setIsStoryViewModalOpen(false);
  };

  return (
    <>
      <div
        className="story-card-wrapper"
        // style={{ backgroundImage: `url(${data?.image})` }}
        style={{ backgroundImage: `url(${cardData.slide_list[0].image})` }}
      >
        <div className="content" onClick={() => openStoryViewModal()}>
          <h3>{cardData.slide_list[0]?.heading}</h3>
          <p>{cardData.slide_list[0]?.description}</p>
        </div>
        {isEditable && (
          <div className="edit-btn" onClick={openModal}>
            <FaRegEdit size={19} /> Edit
          </div>
        )}
        <UpdateStoryModal
          data={cardData}
          setCardData={setCardData}
          isOpen={isModalOpen}
          onClose={closeModal}
          disableScroll={isModalOpen}
        />
        <StoryView
          data={cardData}
          isOpen={isstoryViewModalOpen}
          onClose={closeStoryViewModal}
          disableScroll={isstoryViewModalOpen}
        />
      </div>
    </>
  );
};

export default StoryCard;
