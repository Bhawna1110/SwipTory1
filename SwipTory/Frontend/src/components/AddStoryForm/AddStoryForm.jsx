import React from "react";
import { useForm } from "react-hook-form";
import "./AddStoryForm.scss";
import { useStateValue } from "../../StateProvider";

const AddStoryForm = ({
  errors,
  currentSlide,
  register,
  slide,
  index,
  categoryValue,
  setCategoryValue,
  setValue,
  fields,
}) => {
  const [{ userLoggedIn, category }, dispatch] = useStateValue();

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setCategoryValue(value);
    fields.forEach((slide, index) => {
      setValue(`slides[${index}].story_category_id`, value);
    });
  };

  return (
    <form
      key={slide.id}
      style={{ display: currentSlide === index ? "block" : "none" }}
    >
      <>
        <div className="form-inner-wrapper">
          <div className="input-container">
            <div className="form-control">
              <div className="input-wrappper">
                <label>Heading :</label>
                <input
                  type="text"
                  placeholder="Your heading"
                  {...register(`slides[${index}].heading`, {
                    required: "Heading required",
                  })}
                />
              </div>

              {errors?.slides?.[index]?.heading && (
                <div className="error">
                  {errors.slides[index].heading.message}
                </div>
              )}
            </div>
            <div className="form-control">
              <div className="input-wrappper">
                <label>Description :</label>
                <textarea
                  rows={5}
                  type="text"
                  placeholder="Story Description"
                  {...register(`slides[${index}].description`, {
                    required: "Description required",
                  })}
                ></textarea>
              </div>

              {errors?.slides?.[index]?.description && (
                <div className="error">
                  {errors.slides[index].description.message}
                </div>
              )}
            </div>
            <div className="form-control">
              <div className="input-wrappper">
                <label>Image :</label>
                <input
                  type="text"
                  placeholder="Add Image url"
                  {...register(`slides[${index}].image`, {
                    required: "Image url required",
                  })}
                />
              </div>

              {errors?.slides?.[index]?.image && (
                <div className="error">
                  {errors.slides[index].image.message}
                </div>
              )}
            </div>
            <div className="form-control">
              <div className="input-wrappper">
                <label>Category :</label>
                <div className="input-inner-wrapper">
                  <select value={categoryValue} onChange={handleCategoryChange}>
                    <option value="">Category</option>
                    {category?.length > 0 ? (
                      <>
                        {category.map((item) => (
                          <option value={item._id}>{item.name}</option>
                        ))}
                      </>
                    ) : (
                      ""
                    )}
                  </select>
                  <div className="message">
                    This field will be common for all slides
                  </div>
                  { categoryValue ==="" && (
                    <div className="error">
                      Category required
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </form>
  );
};

export default AddStoryForm;
