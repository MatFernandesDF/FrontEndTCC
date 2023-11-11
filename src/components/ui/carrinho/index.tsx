import React, { useContext } from 'react';

const ShoppingCart = ({ cartItems, setCartItems, total, setTotal }) => {

  const addToCart = (productName, price) => {
    const updatedCart = [...cartItems, { name: productName, price, quantity: 1 }];
    setCartItems(updatedCart);
    setTotal(prevTotal => prevTotal + price);
  };

  const removeFromCart = (index) => {
    const updatedTotal = total - cartItems[index].price * cartItems[index].quantity;
    const updatedCart = cartItems.filter((item, i) => i !== index);
    setCartItems(updatedCart);
    setTotal(updatedTotal);
  };

  const incrementQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setTotal(prevTotal => prevTotal + updatedCart[index].price);
    setCartItems(updatedCart);
  };

  const decrementQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setTotal(prevTotal => prevTotal - updatedCart[index].price);
      setCartItems(updatedCart);
    } else {
      removeFromCart(index);
    }
  };

  return (
    <div>
      <h4>Carrinho</h4>
      <div>
        {cartItems.map((item, index) => (
          <div key={index} className="item-list">
            <span>{item.name} - ${item.price} x {item.quantity}</span>
            <div>
              <button onClick={() => decrementQuantity(index)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => incrementQuantity(index)}>+</button>
              <button className="btn-remove" onClick={() => removeFromCart(index)}>Remover</button>
            </div>
          </div>
        ))}
        <div className="total-bar">Total: ${total}</div>
      </div>
    </div>
  );
}

export default ShoppingCart;