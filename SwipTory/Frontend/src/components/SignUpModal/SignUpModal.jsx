import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import "./SignUpModal.scss";
import { signup } from "../../apiCall";
import toast from "react-hot-toast";

const SignUpModal = ({ isOpen, onClose, children, disableScroll }) => {
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
    const re = await signup(data);
    if (re?.data?.status === 200) {
      toast.success(re.data.message);
      reset();
      onClose();
    } else {
      toast.error(re.response.data.message);
    }
    console.log(re);
  };
  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="auth-wrapper">
          <div className="close">
            <IoMdCloseCircleOutline
              size={35}
              onClick={onClose}
              className="modal-close-button"
            />
          </div>
          <div className="title">Register to SwipTory</div>
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
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
