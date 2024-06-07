import { Routes, Route } from "react-router-dom";
import Product from "./pages/product/Product.page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar/NavBar.component";
import { Box } from "@mui/material";
import Brand from "./pages/brand/Brand.page";

const App = () => {
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <Box sx={{ p: 2 }}>
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/product" element={<Product />} />
          <Route path="/brand" element={<Brand />} />
        </Routes>
      </Box>
    </>
  );
};

export default App;
