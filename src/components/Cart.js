import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let prodId=[];
  for (let i=0; i<cartData.length; i++){
    prodId.push(cartData[i].productId)
  }
  let cart = productsData.filter(checkCart);
  function checkCart(item){
    return(prodId.includes(item._id)) 
  }

  for ( let i = 0; i<cartData.length; i++) {   
        cart[i].qty=cartData[i].qty    
   }
  // console.log(cart)
  return(cart)
  };

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let sum=0;
  for (let i=0; i<items.length; i++){
    sum+=items[i].cost * items[i].qty;
  }
  return sum;
  
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */
const ItemQuantity = ({
  token,
  cartData,
  productsData,
  productId,
  value,
  handleAdd,
  handleDelete,
}) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={()=>handleDelete(token, cartData, productsData, productId, value-1, false)}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="primary" onClick={()=>handleAdd(token, cartData, productsData, productId, value+1, false)}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */

    
const Cart = ({ productsdata, cart=[], handleQuantity, cartData, isReadOnly}) => {
  const history = useHistory();
  //Empty Cart display
  if (!cart.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  //Redirect to Checkout Page
  const redirectCheckout =() => {
    history.push("/checkout")
  }


  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        
        {cart.map((x) => {return (
          <Box display="flex" alignItems="flex-start" padding="1rem">
          <Box className="image-container">
              <img
                  // Add product image
                  src={x.image}
                  // Add product name as alt eext
                  alt={x.name}
                  width="100%"
                  height="100%"
              />
          </Box>

          {isReadOnly?
          <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="6rem"
          paddingX="1rem"
          >
          <div>{x.name}</div>
          <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
          >
            <Box padding="0.5rem" data-testid="item-qty"> Qty: {x.qty}  </Box>
            <Box padding="0.5rem" fontWeight="700"> ${x.cost} </Box>
          </Box>
          </Box>
      
    :
    
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              height="6rem"
              paddingX="1rem"
             >
              <div>{x.name}</div>
              <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
              >
              <ItemQuantity value={x.qty} productId={x._id} cartData={cartData} productsData={productsdata} handleAdd={handleQuantity} handleDelete={handleQuantity} token={localStorage.getItem("token")}
              // Add required props by checking implementation
              />
              <Box padding="0.5rem" fontWeight="700">
                  ${x.cost}
              </Box>
              </Box>
            </Box>}
          
      </Box>
        )})}

        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem" 
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cart)}
          </Box>
        </Box>

        {isReadOnly?
        null :
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={redirectCheckout}
          >
            Checkout
          </Button>
        </Box> }
      </Box>

      {isReadOnly? 
      <Box padding="1rem" className="cart">
        <Box><h2> Order Details</h2></Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box alignSelf="center">
            <p>Products</p> <p> Subtotal</p> <p>Shipping Charges</p> <h3> Total</h3>
          </Box>
          <Box alignSelf="center" justifyItems="flex-end">
            <p>{cart.length}</p> <p> ${getTotalCartValue(cart)}</p> <p> $0</p> <h3> ${getTotalCartValue(cart)}</h3>
          </Box>
        </Box>
      </Box>
      :
      null 
      }
    </>
  );
};

export default Cart;
