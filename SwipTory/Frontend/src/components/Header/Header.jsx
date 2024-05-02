import React, { useState } from "react";
import "./Header.scss";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { IoBookmarkSharp } from "react-icons/io5";
import profile from "../../assets/images/profile.jpg";
import LoginModal from "../LoginModal/LoginModal";
import SignUpModal from "../SignUpModal/SignUpModal";
import StoryModal from "../StoryModal/StoryModal";
import { useStateValue } from "../../StateProvider";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [{ userLoggedIn, username }, dispatch] = useStateValue();

  const [userLoggedInModalOpen, setuserLoggedInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  const openLoginModal = () => {
    setuserLoggedInModalOpen(true);
  };
  const closeLoginModal = () => {
    setuserLoggedInModalOpen(false);
  };
  const openStoryModal = () => {
    setIsStoryModalOpen(true);
  };
  const closeStoryModal = () => {
    setIsStoryModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };
  const [isMenuShow, setIsMenuShow] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch({
      type: "SET_LOGIN_STATUS",
      status: false,
    });
    dispatch({
      type: "SET_FAVORITE_LIST",
      data: [],
    });
    dispatch({
      type: "SET_BOOKMARK_LIST",
      data: [],
    });
    setIsMenuShow(false);
    sessionStorage.clear();
  };
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setIsMenuShow(false);
    }
  };
  return (
    <>
      <div className="header-wrapper" onClick={handleOverlayClick}>
        <div className="logo" onClick={() => navigate("/")}>
          SwipTory
        </div>
        <div className="menu-mobile">
          <IoIosMenu size={24} onClick={() => setIsMenuShow(!isMenuShow)} />

          <div
            className={`${
              isMenuShow ? "open-menu menu-card" : "close-menu menu-card"
            } `}
          >
            <div className="close">
              <IoClose size={24} onClick={() => setIsMenuShow(false)} />
            </div>
            <div className="nav-link-wrapper">
              {userLoggedIn ? (
                <div className="nav-links">
                  <div className="profile">
                    <div
                      className="profile-img"
                      style={{ backgroundImage: `url(${profile})` }}
                    ></div>
                    {/* <img src={profile} alt="" /> */}
                    {username}
                  </div>
                  <button
                    className="btn-red"
                    onClick={() => navigate("/your-story")}
                  >
                    Your Story
                  </button>
                  <button
                    className="btn-red"
                    onClick={() => {
                      openStoryModal();
                      setIsMenuShow(false);
                    }}
                  >
                    Add story
                  </button>
                  <button
                    className="btn-red"
                    onClick={() => navigate("/bookmark")}
                  >
                    <IoBookmarkSharp size={20} />
                    Bookmarks
                  </button>
                  <button className="btn-red" onClick={() => handleLogout()}>
                    Logout
                  </button>
                </div>
              ) : (
                <div className="nav-links">
                  <button className="btn-red" onClick={() => openLoginModal()}>
                    Login
                  </button>
                  <button className="btn-red" onClick={() => openSignUpModal()}>
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="btn-wrapper">
          {userLoggedIn ? (
            <div className="nav-link">
              <button className="btn-red" onClick={() => openStoryModal()}>
                Add story
              </button>
              <button
                className="btn-red "
                onClick={() => navigate("/bookmark")}
              >
                <IoBookmarkSharp size={20} />
                Bookmarks
              </button>
              <div
                className="profile-img"
                style={{ backgroundImage: `url(${profile})` }}
              ></div>
              <IoIosMenu size={24} onClick={() => setIsMenuShow(!isMenuShow)} />
            </div>
          ) : (
            <div className="nav-link">
              <button className="btn-red" onClick={() => openSignUpModal()}>
                Register Now
              </button>
              <button className="btn-blue" onClick={() => openLoginModal()}>
                Sign In
              </button>
            </div>
          )}
          <div className="menu">
            <div
              className={`${
                isMenuShow ? "open-menu menu-card" : "close-menu menu-card"
              } `}
            >
              <div className="close">
                <IoClose size={24} onClick={() => setIsMenuShow(!isMenuShow)} />
              </div>
              <div className="nav-link-wrapper">
                <div className="nav-links">
                  <div className="name">{username}</div>
                  {/* <button
                    className="btn-red"
                    onClick={() => navigate("/your-story")}
                  >
                    Your Story
                  </button> */}

                  <button className="btn-red" onClick={() => handleLogout()}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginModal
        isOpen={userLoggedInModalOpen}
        onClose={closeLoginModal}
        disableScroll={userLoggedInModalOpen}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={closeSignUpModal}
        disableScroll={isSignUpModalOpen}
      />
      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={closeStoryModal}
        disableScroll={isStoryModalOpen}
      />
    </>
  );
};

export default Header;
