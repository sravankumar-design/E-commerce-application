import React from "react";
import Products from "./Products";
import Weather from "./Weather";
function App() {
  return (
    <div className="border border-4 border-danger p-4 w-100">
      <h1>E-commerce store</h1>
      <Weather />
      <Products />
    </div>
  );
}

export default App;
