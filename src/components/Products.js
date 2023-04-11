import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";

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

//***************************************************************************************************** */
const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [prod,setProd]=useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound]=useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(500);

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
 useEffect(() => performAPICall(),[]);

  const performAPICall = async () => {
    setLoading(true)
    try {
      let res= await axios.get(`${config.endpoint}/products`);
      setProd(res.data);
      
            
    } catch (error) {
      console.error(error)
      if(error.response){
      alert(error.response.data.message)}
    }
    setLoading(false);
    }

  const handleAddToCart=()=>{
    console.log("Added to cart")
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
      console.log(res)
      
            
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

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          name="search"
          placeholder="Search for items/categories"
          className="search-desktop"
          size="small "
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          onChange={(event) => debounceSearch(event,500)}
          fullWidth
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
       <Grid container spacing={4} mb={3} >
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
              </p>
           </Box>
          </Grid>
        </Grid>

        {notFound? <Grid container mb={15} justifyContent={"center"} alignItems={"center"} direction={"column"}> <SentimentDissatisfied /> <div> No products found</div></Grid>
        :   
        <div> {loading? <Grid container mb={20} justifyContent={"center"} alignItems={"center"} direction={"column"}><CircularProgress /><p>Loading products</p></Grid> : 
        <Grid container rowSpacing={4} justifyContent={"left"} mb={3}>
          {prod.map((x)=> {return(
          <Grid item xs={6} md={3} p={2}>
            <ProductCard product={x} />
        </Grid>)})} 
        </Grid> }</div>
        }
      <Footer />
    </div>
  );
};

export default Products;