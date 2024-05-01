import logo from "./logo.svg";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectRoute } from "./ProtectRoutes";
import toast, { Toaster } from "react-hot-toast";
// import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import LoginModal from "./components/LoginModal/LoginModal";
import { useEffect, useState } from "react";
import Home from "./pages/Home/Home";
import Bookmark from "./pages/Home/Bookmark/Bookmark";
import YourStory from "./pages/Home/YourStory/YourStory";
import { getCategory } from "./apiCall";
import { useStateValue } from "./StateProvider";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

function App() {
  const [{  }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchData = async () => {
      const re = await getCategory();
      if (re?.status === 200) {
        dispatch({
          type: "SET_CATEGORY",
          category: re.data.data,
        });
      } else {
        toast.error(re?.response?.data?.message);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectRoute>
                <>
                  <Header />
                  <Home />
                </>
              </ProtectRoute>
            }
          />
          <Route
            path="/bookmark"
            element={
              <ProtectRoute>
                <>
                  <Header />
                  <Bookmark />
                </>
              </ProtectRoute>
            }
          />
          <Route
            path="/your-story"
            element={
              <ProtectRoute>
                <>
                  <Header />
                  <YourStory />
                </>
              </ProtectRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
