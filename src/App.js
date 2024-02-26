import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import "bootstrap/dist/css/bootstrap.min.css"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Login from './components/Login';
import Logout from './components/Logout';
import RecipesList from "./components/RecipesList";
import Recipe from "./components/Recipe";
import AddRecipe from './components/AddRecipe';
import SavedList from './components/SavedList';
import EditRecipe from './components/EditRecipe';
import FilteredList from './components/FilteredList.js';

import './App.css';
import SavedDataService from "./services/saved";

import NavDropdown from 'react-bootstrap/NavDropdown';

function App() {
  // write the saved to the database any time they change, 
  // and to load the saved from the database when the website is first displayed.

  const [user, setUser] = useState(null);
  const [saved, setsaved] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);

  // save saved to database when saved is being updated 
  const savesaved = useCallback(() => {
    let data = {
      _id: user.googleId,
      saved: saved
    }
    console.log(saved)
    SavedDataService.updatesaved(data)
      .catch(e => {
        console.log(e);
      })
  }, [saved, user]);

  // retrieve saved from database when user login
  const retrievesaved = useCallback(() => {
    SavedDataService.getAll(user.googleId)
      .then(response => {
        setsaved(response.data.saved);
      })
      .catch(e => {
        console.log(e);
      });
  }, [user]);

  // triggers retrievesaved
  useEffect(() => {
    if (user) {
      retrievesaved();
    }
  }, [user, retrievesaved]);


  const addsaved = (recipeId) => {
    setsaved([...saved, recipeId]);
    setUpdateFlag(true);
  }

  const deletesaved = (recipeId) => {
    setsaved(saved.filter(f => f !== recipeId));
    setUpdateFlag(true);
  }

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  useEffect(() => {
    if (updateFlag) {
      savesaved();
    }
  }, [updateFlag,  savesaved]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
    <div className="Background">
      <Navbar bg="#E5E5E5" expand="lg" sticky="top" variant="dark" >
        <Container className="container-fluid">
        <Navbar.Brand className="brand" href="/">
          <img src="/images/avo.png" alt="brand logo" className="brandLogo"/>
          Seasoned
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" >
          <Nav className="ml-auto">
            <Nav.Link as={Link}  to={"/recipes"}>
              All Recipes
            </Nav.Link>
            <NavDropdown
              id="nav-dropdown-dark-example"
              title="Special Diets"
              menuVariant="dark"
            >
              <NavDropdown.Item href="/filter/dietary/vegan">Vegan</NavDropdown.Item>
                  <NavDropdown.Item href="/filter/dietary/keto">
                    Keto</NavDropdown.Item>
                  <NavDropdown.Item href="/filter/dietary/vegetarian">Vegetarian</NavDropdown.Item>
                  <NavDropdown.Item href="/filter/dietary/Paleo">Paleo</NavDropdown.Item>
                  <NavDropdown.Item href="/filter/dietary/whole30">Whole30</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              id="nav-dropdown-dark-example"
              title="Meal"
              menuVariant="dark"
            >
              <NavDropdown.Item href="/filter/meal/breakfast">Breakfast</NavDropdown.Item>
                  <NavDropdown.Item href="/filter/meal/lunch">Lunch</NavDropdown.Item>
                  <NavDropdown.Item href="/filter/meal/dinner">Dinner</NavDropdown.Item>
                  <NavDropdown.Item href="/filter/meal/snack">Snacks</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              id="nav-dropdown-dark-example"
              title="Difficulty"
              menuVariant="dark"
            >
              <NavDropdown.Item href="/filter/difficulty/beginner">Beginner</NavDropdown.Item>
                  <NavDropdown.Item href="/filter/difficulty/intermediate">Intermediate</NavDropdown.Item>
                  <NavDropdown.Item href="/filter/difficulty/advanced">Advanced</NavDropdown.Item>
            </NavDropdown>
            {
              user &&
              <Nav.Link as={Link}  to={"/saved"}>
                Saved
              </Nav.Link>
            }
            {
                user &&
                <Nav.Link as={Link}  to={"/create"}>
                  Add New Recipe
                </Nav.Link>
            }
          </Nav>
        </Navbar.Collapse>
        { user ? (
                <Logout setUser={setUser} />
              ) : (
                <Login setUser={setUser} />
              )}
        </Container>
      </Navbar>
      <br></br>
      <Routes>
        <Route exact path={"/"} element={
          <RecipesList
            user={ user }
            addsaved={ addsaved }
            deletesaved={ deletesaved }
            saved={ saved }
          />}
        />
        <Route exact path={"/recipes"} element={
          <RecipesList
            user={ user }
            addsaved={ addsaved }
            deletesaved={ deletesaved }
            saved={ saved }
          />}
        />
        <Route path={"/recipes/:id/"} element={
          <Recipe user={ user } />}
          />
        <Route path={"/filter/:category/:type"} element={
          <FilteredList
          user={ user }
          addsaved={ addsaved }
          deletesaved={ deletesaved }
          saved={ saved }
        />}
        />
        <Route path={"/create"} element={
          <AddRecipe user={ user } />}
          />
        <Route path={"/recipes/:id/edit"} element={
          <EditRecipe user={ user } />}
          />
        <Route path={"/saved"} element={
          <SavedList saved={ saved }
          addsaved={ addsaved }
          deletesaved={ deletesaved }
          />}
        />
      </Routes>
    </div>
    </GoogleOAuthProvider>
  );
}


export default App;
