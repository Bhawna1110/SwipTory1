import axios from "axios";
import { domainName, api } from "./Constants";
import { request } from "./utils/axios-utils";

const token = sessionStorage.getItem("token");

// sign up
export const signup = (data) => {
  return request({ url: api.signup, method: "post", data: data });
};

// login
export const login = (data) => {
  return request({ url: api.login, method: "post", data: data });
};
// create Story
export const createStory = (data) => {
  return request({ url: api.createStory, method: "post", data: data });
};
export const editStory = (data) => {
  return request({ url: api.editStory, method: "post", data: data });
};

export const addToBookmark = (data) => {
  return request({ url: api.addToBookmark, method: "post", data: data });
};
export const addToLike = (data) => {
  return request({ url: api.addToLike, method: "post", data: data });
};

export const storyBookmarkList = () => {
  return request({ url: api.storyBookmarkList, method: "get" });
};
export const getStoryDetail = (id) => {
  return request({ url: `${api.getStoryDetail}?story_id=${id}`, method: "get" });
};
export const getCategory = () => {
  return request({ url: api.category, method: "get" });
};
export const userStory = () => {
  return request({ url: api.userStory, method: "get" });
};
export const getStory = (cayegoryId, page = 2) => {
  return request({
    url: `${api.getStory}?story_category_id=${cayegoryId}&page=${page}`,
    method: "get",
  });
};
