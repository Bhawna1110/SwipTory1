import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "./StoryModal.scss";
import AddStoryForm from "../AddStoryForm/AddStoryForm";
import { createStory } from "../../apiCall";
import toast from "react-hot-toast";

const StoryModal = ({ isOpen, onClose, children, disableScroll }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // Current slide index
  const [categoryValue, setCategoryValue] = useState("");
  const methods = useForm(); // Initialize the useForm hook
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "slides",
  });
  useEffect(() => {
    // Initialize the form with 3 slide objects when the component mounts
    reset({
      slides: [
        { heading: "", description: "", image: "", story_category_id: "" },
        { heading: "", description: "", image: "", story_category_id: "" },
        { heading: "", description: "", image: "", story_category_id: "" },
      ],
    });
  }, []);

  const addSlide = () => {
    if (fields.length < 6) {
      append({});
    }
  };

  const removeSlide = (index) => {
    console.log(index, currentSlide, index === currentSlide && index > 0);
    remove(index);
    if (index === currentSlide && index > 0) {
      setCurrentSlide(index - 1);
    }
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

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setCurrentSlide(0);
      reset();
      onClose();
      setCategoryValue("");
    }
  };
  const closeModal = () => {
    setCurrentSlide(0);
    reset();
    onClose();
    setCategoryValue("");
  };

  const postForm = () => {
    // Manually trigger form validation
    methods.trigger().then((isValid) => {
      if (isValid && categoryValue !=="") {
        // If all forms are valid, submit the form
        handleSubmit(onSubmit)();
      } else {
        // If any form is invalid, find the first unfilled form and set the current slide to that form
        const firstUnfilledFormIndex = fields.findIndex((slide, index) => {
          const { heading, description, category } = methods.watch(
            `slides[${index}]`
          );
          return !heading || !description || !category;
        });
        setCurrentSlide(firstUnfilledFormIndex);
      }
    });
  };
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === fields.length - 1 ? 0 : prevSlide + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? fields.length - 1 : prevSlide - 1
    );
  };
  const onSubmit = async (data) => {
    const re = await createStory({
      story_category_id: categoryValue,
      slide_array: data.slides,
    });
    if (re?.status === 200) {
      toast.success(re.data.message);

      closeModal();
    } else {
      if (re?.response?.status === 401) {
        toast.error("Token expired.");

        // closeModal();
      } else {
        toast.error(re.response.data.message);
      }
    }
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="story-wrapper">
          <div className="close">
            <IoMdCloseCircleOutline
              size={35}
              onClick={closeModal}
              className="modal-close-button"
            />
          </div>
          <div className="title">Add upto 6 slides </div>
          <div className="form-wrapper">
            <div className="slide-wrapper">
              {/* <div> */}
              {fields.map((slide, index) => (
                <>
                  <span
                    className={`${currentSlide === index ? "active" : ""}`}
                    key={slide.id}
                  >
                    <span onClick={() => goToSlide(index)}>
                      Slide {index + 1}
                    </span>
                    {fields.length > 3 && index >2  && (
                      <IoMdCloseCircleOutline
                        size={20}
                        className="remove-slide"
                        onClick={() => removeSlide(index)}
                      />
                    )}
                  </span>
                </>
              ))}

              {fields.length < 6 ? (
                <span onClick={() => addSlide()}>Add +</span>
              ) : (
                ""
              )}
            </div>
            <FormProvider {...methods}>
              <form>
                {fields.map((slide, index) => (
                  <AddStoryForm
                    errors={errors}
                    currentSlide={currentSlide}
                    register={register}
                    slide={slide}
                    index={index}
                    categoryValue={categoryValue}
                    setCategoryValue={setCategoryValue}
                    setValue={setValue}
                    fields={fields}
                  />
                ))}

                <div className="action-button-container">
                  <div className="left">
                    <button
                      type="button"
                      className="btn-green"
                      onClick={previousSlide}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn-blue"
                      onClick={nextSlide}
                    >
                      Next
                    </button>
                  </div>
                  <div className="right">
                    <button
                      type="button"
                      className="btn-red"
                      onClick={postForm}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
