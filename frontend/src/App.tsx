import { Routes, Route } from "react-router-dom";
import Product from "./pages/Product.page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Product />} />
    </Routes>
  );
};

export default App;
