import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import "./LoginModal.scss";
import { login } from "../../apiCall";
import toast from "react-hot-toast";
import { useStateValue } from "../../StateProvider";

const LoginModal = ({ isOpen, onClose, children, disableScroll }) => {
  const [{ userLoggedIn }, dispatch] = useStateValue();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
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
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  if (!isOpen) return null;
  const onSubmit = async (data) => {
    const re = await login(data);
    console.log(re);
    if (re?.data?.status === 200) {
      toast.success(re.data.message);
      sessionStorage.setItem("token", re.data.token);
      sessionStorage.setItem(
        "bookmarked",
        JSON.stringify(re.data.user_data.bookmark_story_ids)
      );
      sessionStorage.setItem(
        "liked",
        JSON.stringify(re.data.user_data.liked_ids)
      );
      sessionStorage.setItem("username", re.data.user_data.user_name);
      reset();
      dispatch({
        type: "SET_LOGIN_STATUS",
        status: true,
      });
      dispatch({
        type: "SET_FAVORITE_LIST",
        data: re.data.user_data.liked_ids,
      });
      dispatch({
        type: "SET_BOOKMARK_LIST",
        data: re.data.user_data.bookmark_story_ids,
      });
      onClose();
    } else {
      toast.error(re.response.data.message);
    }
  };
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="login-wrapper">
          <div className="close">
            <IoMdCloseCircleOutline
              size={35}
              onClick={onClose}
              className="modal-close-button"
            />
          </div>
          <div className="title">Login to SwipTory</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <div className="input-wrappper">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  {...register("user_name", {
                    required: "Username required",
                  })}
                />
              </div>
              {errors.user_name ? (
                <div className="error">{errors.user_name.message}</div>
              ) : (
                ""
              )}
            </div>
            <div className="form-control">
              <div className="input-wrappper">
                <label>Password</label>
                <div className="input-inner-wrapper">
                  <input
                    placeholder="Enter password"
                    type={`${isPasswordVisible ? "text" : "password"}`}
                    name="password"
                    {...register("password", {
                      required: "Password required.",
                    })}
                  />
                  {isPasswordVisible ? (
                    <GoEye
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    />
                  ) : (
                    <GoEyeClosed
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    />
                  )}
                </div>
              </div>
              {errors.password ? (
                <div className="error">{errors.password.message}</div>
              ) : (
                ""
              )}
            </div>
            <button type="submit" className="btn-blue">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
