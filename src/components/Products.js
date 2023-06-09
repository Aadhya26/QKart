import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box, bgcolor, width } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, {generateCartItemsFrom} from "./Cart";

// Definition of Data Structures used
/**
 
/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

//***************************************************************************************************** */
const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [prod,setProd]=useState([]);
  const [allProd, setAllProd] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound]=useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(500);
  const [cartItem, setCartItem] = useState({});

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  //***************************************************************************************************** */
//  useEffect(() => performAPICall(),[]);
//  if(localStorage.getItem("token")){
//   useEffect(() => fetchCart(localStorage.getItem("token")), [])}
 
useEffect(() => {
  const onLoadHandler = async () => {
    performAPICall();
    if (localStorage.getItem("token")) 
      fetchCart(localStorage.getItem("token"));
  };
  onLoadHandler();
}, []);

  const performAPICall = async () => {
    setLoading(true)
    try {
      let res= await axios.get(`${config.endpoint}/products`);
      setProd(res.data);
      setAllProd(res.data);
      
            
    } catch (error) {
      console.error(error)
      if(error.response){
      alert(error.response.data.message)}
    }
    setLoading(false);
    }

 
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  //***************************************************************************************************** */

  const performSearch = async (text) => {
    setNotFound(false);
    try {
      let res= await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setProd(res.data);
      //console.log(res)
      
            
    } catch (error) {
      if(error.response){
      setNotFound(true)}
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  //***************************************************************************************************** */

  const debounceSearch = (event, debounceTimeout) => {
    //performSearch(event.target.value);
    if(debounceTimeout) {

      clearTimeout(debounceTimeout);
      }
      
      let timeOut = setTimeout(() => {
      (async () =>{
      performSearch(event.target.value);
      })();
      }, 500); // Update set timeoutId   
      setDebounceTimeout(timeOut);
      //console.log(timeOut)
  };

//***************************************************************************************************** */

/**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
 

const fetchCart = async (token) => {
  if (!token) return;

  try {
    let res= await axios.get(`${config.endpoint}/cart`, {
    headers: { 'Authorization': `Bearer ${token}`}})
    setCartItem(res.data);
    //console.log(res.data)
    

  } catch (e) {
    if (e.response && e.response.status === 400) {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.", { variant: "error"});
    }
    return null;
  }
};

// TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
/**
 * Return if a product already is present in the cart
 *
 * @param { Array.<{ productId: String, quantity: Number }> } items
 *    Array of objects with productId and quantity of products in cart
 * @param { String } productId
 *    Id of a product to be checked
 *
 * @returns { Boolean }
 *    Whether a product of given "productId" exists in the "items" array
 *
 */
const isItemInCart = (items, productId) => {
  for (let i=0; i<items.length; i++)
    if (items[i].productId===productId)
    return true;

    return false;
  
};

/**
 * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
 *
 * @param {string} token
 *    Authentication token returned on login
 * @param { Array.<{ productId: String, quantity: Number }> } items
 *    Array of objects with productId and quantity of products in cart
 * @param { Array.<Product> } products
 *    Array of objects with complete data on all available products
 * @param {string} productId
 *    ID of the product that is to be added or updated in cart
 * @param {number} qty
 *    How many of the product should be in the cart
 * @param {boolean} options
 *    If this function was triggered from the product card's "Add to Cart" button
 *
 * Example for successful response from backend:
 * HTTP 200 - Updated list of cart items
 * [
 *      {
 *          "productId": "KCRwjF7lN97HnEaY",
 *          "qty": 3
 *      },
 *      {
 *          "productId": "BW0jAAeDJmlZCF8i",
 *          "qty": 1
 *      }
 * ]
 *
 * Example for failed response from backend:
 * HTTP 404 - On invalid productId
 * {
 *      "success": false,
 *      "message": "Product doesn't exist"
 * }
 */
const addToCart = async (
  token,
  items,
  products,
  productId,
  qty,
  options = { preventDuplicate: false }
) => {
  //To check if the user is logged in
  if(!token){
    {enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" })}
  }
  //To check if Add To Cart is clicked
  if(options){
  if (isItemInCart(items,productId))
    {enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: "warning" })}
  
  else{
  let res= await axios.post(`${config.endpoint}/cart`, {"productId":productId , "qty":qty},
  {headers: { 'Authorization': `Bearer ${token}`}})
  .catch(error => console.log(error))
  setCartItem(res.data)
  console.log(res.data)
   
  }
  }

else{
  let res= await axios.post(`${config.endpoint}/cart`, {"productId":productId , "qty":qty},
  {headers: { 'Authorization': `Bearer ${token}`}})
  .catch(error => console.log(error)) 
  setCartItem(res.data)
  console.log(res.data)
   
}
  
};


//***************************************************************************************************** */

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          name="search"
          placeholder="Search for items/categories"
          className="search-desktop"
          sx={{width:'500px'}}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          onChange={(event) => debounceSearch(event,500)}
          
        /> 
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onSubmit={(event) => debounceSearch(event,500)}
        placeholder="Search for items/categories"
        name="search"
      />
      
      {/* Display cart based on login status */}
      {localStorage.getItem("token")?
              <Grid container direction={"row"}>
              <Grid item md={9} >
                <Grid item className="product-grid" mb={3} >
                  <Box className="hero">
                    <p className="hero-heading">
                      India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                      to your door step
                    </p>
                  </Box>
                </Grid>
      
                <Grid container mb={15}  justifyContent={"center"} alignItems={"center"} direction={"column"}>
                {notFound?  <div><SentimentDissatisfied />  No products found</div>
              :   
              <div> {loading? <div><CircularProgress /><p>Loading products</p></div> 
              : 
              <Grid container rowSpacing={4} justifyContent={"left"} mb={3}>
                {prod.map((x)=> {return(
                <Grid item xs={6} md={3} p={2}>
                  <ProductCard product={x} token={localStorage.getItem("token")} items={cartItem} products={allProd} handleAddToCart={addToCart} />
              </Grid>)})} 
              </Grid> }</div>
              }
              </Grid>
              </Grid>
              <Grid item md={3} sx={{bgcolor:"#E9F5E1"}}>
                <Cart cartData={cartItem} productsData={allProd} cart={generateCartItemsFrom(cartItem, allProd)} token={localStorage.getItem("token")} handleQuantity={addToCart} />
              </Grid>
              </Grid>
              
        :
              
              <Grid container>
                <Grid item className="product-grid" mb={3} mr={1} >
                  <Box className="hero">
                    <p className="hero-heading">
                      India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                      to your door step
                    </p>
                  </Box>
                </Grid>
      
              <Grid container mb={15}  justifyContent={"center"} alignItems={"center"} direction={"column"}>
                {notFound?  <div><SentimentDissatisfied />  No products found</div>
              :   
              <div> {loading? <div><CircularProgress /><p>Loading products</p></div> 
              : 
              <Grid container rowSpacing={4} justifyContent={"left"} mb={3}>
                {prod.map((x)=> {return(
                <Grid item xs={6} md={3} p={2} key={x._id}>
                  <ProductCard product={x} token={localStorage.getItem("token")} items={cartItem} products={allProd} handleAddToCart={addToCart} />
                </Grid>)})} 
              </Grid> }</div>
              }
              </Grid>
              </Grid>}
      {fetchCart}
      <Footer />
    </div>
  );  
};

export default Products;
