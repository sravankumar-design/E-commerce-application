import React from "react";

const Cart = (props) => {
  function getTotal() {
    return (
      props.cartProduct.reduce((t, p) => {
        return t + p.price * p.count * 100;
      }, 0) / 100
    );
  }

  return (
    <div className="border border-4 border-secondary p-2">
      <h1 className="w-25 text-end text-success">Cart</h1>
      {props.cartProduct.map((p) => {
        return (
          <li className="d-flex flex-wrap justify-content-between" key={p.id}>
            <div className="w-50 text-start text-primary">{p.title}</div>
            <div className="w-25 text-end text-warning">
              {p.count}*{p.price}
            </div>
            <div className="w-25 text-end text-info">{p.count * p.price}</div>
          </li>
        );
      })}
      <hr />
      <h1 className="w-25 text-start text-danger">Total:{getTotal()}</h1>
    </div>
  );
};
export default Cart;
