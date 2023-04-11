import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card" variant="outlined">
      <CardMedia component="img" image={product.image} sx={{ padding: "1em 1em o 1em", objectFit: "contain" }}/>

      <CardContent>
      <Typography gutterBottom component="div">
          {product.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ${product.cost}
        </Typography>
        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>

      <CardActions>
        <Button fullWidth size="large" variant="contained" > <AddShoppingCartOutlined /> ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
