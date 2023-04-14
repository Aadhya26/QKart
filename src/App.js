import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import ipConfig from "./ipConfig.json";
import { Route, Switch, BrowserRouter as Router, Link } from "react-router-dom";
import {ThemeProvider} from "@mui/system";
import theme from "./theme";


// ***********************************************************************************//

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <Router>
<ThemeProvider theme={theme}>
      <div className="App">
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
        <Route exact path="/"> <Products /> </Route>
        <Route path="/register"> <Register /> </Route>
        <Route path="/login"> <Login /> </Route>
        <Route path="/checkout"> <Checkout /> </Route>
        </Switch>
      </div>
      </ThemeProvider>
    </Router>    
  );
}

export default App;



