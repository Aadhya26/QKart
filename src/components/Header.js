import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import Products from "./Products";
import { useHistory, Link} from "react-router-dom";
import Login from "./Login";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  
  function loggout(){
    localStorage.clear()
    window.location.reload()
  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {hasHiddenAuthButtons?
        <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text" onClick={()=>history.push("/")}><Link to = "/">  Back to explore </Link>
        </Button>
        :
        
        (localStorage.getItem("username"))?
        <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src="avatar.png" alt={localStorage.getItem("username")} ></Avatar> 
        <p>{localStorage.getItem("username")}  </p>
        <Button className="button" variant="contained" onClick={loggout}> LOGOUT </Button>
        </Stack>
        :
        <Stack direction="row" spacing={2}>
        <Button onClick={()=>history.push("/login")}>  Login </Button>
        <Button className="button" variant="contained" onClick={()=>history.push("/register")}> <Link to="/register">Register </Link></Button>
        </Stack> 
        }
        </Box>
    );
};

export default Header;
