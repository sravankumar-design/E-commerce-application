import React from "react";
import Cart from "./Cart";
import axios from "axios";
import { useState, useEffect } from "react";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => setProducts(res.data));
  }, []);

  function addTocart(product) {
    setCart([...cart, { ...product, count: 1 }]);
  }

  function isProductInCart(product) {
    var x = cart.find(function (cp) {
      if (cp.title === product.title) {
        return true;
      } else {
        return false;
      }
    });
    return x;
  }

  function incCount(product) {
    var itemp = cart.map((cp) => {
      if (cp.title === product.title) {
        cp.count = cp.count + 1;
      }
      return cp;
    });
    setCart([...itemp]);
  }

  function decCount(product) {
    var dtemp = cart
      .map((cp) => {
        if (cp.title === product.title) {
          cp.count = cp.count - 1; // ✅ Decrease count
        }
        return cp;
      })
      .filter((cp) => cp.count > 0); // ✅ Remove items where count is 0

    setCart([...dtemp]); // ✅ Update cart without items with count 0
  }

  function getCartProductCount(product) {
    var y = cart.find(function (cp) {
      if (cp.title === product.title) {
        return true;
      } else {
        return false;
      }
    });
    return y ? y.count : 0;
  }

  return (
    <div className="d-flex flex-wrap border border-4 border-info p-4 w-100">
      <div className="w-50">
        {products.length > 0 &&
          products.map((product) => {
            return (
              <li key={product.id} className="d-flex">
                <img src={product.image} width="100px" />
                <div className="p-4">
                  <h4>{product.title}</h4>
                  <h3>{product.price}</h3>

                  {isProductInCart(product) &&
                    getCartProductCount(product) > 0 && (
                      <>
                        <button onClick={() => decCount(product)}> - </button>
                        <b>{getCartProductCount(product)}</b>
                        <button onClick={() => incCount(product)}> + </button>
                      </>
                    )}

                  {!isProductInCart(product) && (
                    <button
                      onClick={() => {
                        addTocart(product);
                      }}
                      className="btn btn-info"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </li>
            );
          })}
      </div>
      <div className="w-50">
        <Cart cartProduct={cart} />
      </div>
    </div>
  );
};

export default Products;
