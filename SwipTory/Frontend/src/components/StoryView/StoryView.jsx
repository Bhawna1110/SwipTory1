import React, { useEffect, useState } from "react";
import "./StoryView.scss";
import StoryCardImage from "../../assets/images/storyImage.jpg";
import Slider from "react-slick";
import { IoBookmarkSharp } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import { FaLocationArrow } from "react-icons/fa";
import toast from "react-hot-toast";
import { addToBookmark, addToLike } from "../../apiCall";
import { useStateValue } from "../../StateProvider";
import LoginModal from "../LoginModal/LoginModal";

const StoryView = ({
  data,
  isOpen,
  onClose,
  children,
  disableScroll,
  isEditable = false,
}) => {
  const [{ favorites, bookmarks, userLoggedIn }, dispatch] = useStateValue();

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [userLoggedInModalOpen, setuserLoggedInModalOpen] = useState(false);
  const openLoginModal = () => {
    setuserLoggedInModalOpen(true);
  };
  const closeLoginModal = () => {
    setuserLoggedInModalOpen(false);
  };
  const settings = {
    customPaging: function (i) {
      return <div className="status-line"></div>;
    },
    dots: true,
    infinite: true,
    fade: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    if (disableScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [disableScroll]);
  
  useEffect(() => {
    setLiked(favorites.some((story) => story === data._id));
  }, [favorites, data]);

  useEffect(() => {
    setBookmarked(bookmarks.some((story) => story === data._id));
  }, [bookmarks, data]);
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  const handleCopyLink = () => {
    toast.success("Link copied to clipboard");
  };

  const handleBookmark = async (data) => {
    if (!userLoggedIn) {
      toast.error("Login required!");
      onClose();
      openLoginModal();
    } else {
      const re = await addToBookmark({ story_id: data._id });
      if (re?.status === 200) {
        dispatch({
          type: "SET_BOOKMARK_LIST",
          data: re.data.data.bookmark_story_ids,
        });
      } else {
        if (re?.response?.status === 401) {
          toast.error("Token expired.");
        } else {
          toast.error(re.response.data.message);
        }
      }
    }
  };

  const handleLike = async (data) => {
    if (!userLoggedIn) {
      toast.error("Login required!");
      onClose();
      openLoginModal();
    } else {
      const re = await addToLike({ story_id: data._id });
      if (re?.status === 200) {
        dispatch({ type: "SET_FAVORITE_LIST", data: re.data.data.liked_ids });
      } else {
        if (re?.response?.status === 401) {
          toast.error("Token expired.");
        } else {
          toast.error(re.response.data.message);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="story-view-modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-story-view">
        <div className="slider-container">
          <Slider {...settings}>
            {data?.slide_list.map((item) => (
              <div className="story-view-card">
                <div
                  className="story-card-view-wrapper"
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <div className="btn-share">
                    <IoClose size={30} onClick={() => onClose()} />
                    <FaLocationArrow
                      size={30}
                      onClick={() => handleCopyLink()}
                    />
                  </div>
                  <div className="content">
                    <h3>{item?.heading}</h3>
                    <p>{item?.description}</p>
                    <div className="btn-wrapper">
                      {bookmarked ? (
                        <div className="bookmarked">
                          <IoBookmarkSharp
                            size={30}
                            onClick={() => handleBookmark(data)}
                          />
                        </div>
                      ) : (
                        <IoBookmarkSharp
                          size={30}
                          onClick={() => handleBookmark(data)}
                        />
                      )}
                      <div className="like-icon">
                        {liked ? (
                          <div className="liked">
                            {" "}
                            <FcLike
                              size={30}
                              onClick={() => handleLike(data)}
                            />
                          </div>
                        ) : (
                          <FcLike size={30} onClick={() => handleLike(data)} />
                        )}

                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <LoginModal
        isOpen={userLoggedInModalOpen}
        onClose={closeLoginModal}
        disableScroll={userLoggedInModalOpen}
      />
    </div>
  );
};

export default StoryView;
