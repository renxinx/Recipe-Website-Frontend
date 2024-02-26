import React, { useState, useEffect, useCallback } from 'react';
import RecipeDataService from "../services/recipes";
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row' ;
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Heart from "react-heart";
import "./RecipesList.css";
import ".././App.css";


const RecipesList = ({
  user,
  saved,
  addsaved,
  deletesaved
}) => {
  // useState to set state values
  const [recipes, setRecipes] = useState([]);
  const [searchRecipeName, setSearchRecipeName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");
  const [totalResults, setTotalResults] = useState("");

  
  // useCallback to define functions which should
  // only be created once and will be dependencies for
  // useEffect
  const retrieveRecipes = useCallback(() => {
    setCurrentSearchMode("");
    RecipeDataService.getAll(currentPage)
      .then(response => {
        setRecipes(response.data.recipes);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
        setTotalResults(response.data.total_results);
      })
      .catch(e => {
        console.log(e);
      });
  }, [currentPage]);

  const find = useCallback((query, by) => {
    RecipeDataService.find(query, by, currentPage)
      .then(response => {
        setRecipes(response.data.recipes);
        setTotalResults(response.data.total_results);
      })
      .catch(e => {
        console.log(e);
      });
  }, [currentPage]);

  const findByName = useCallback(() => {
    setCurrentSearchMode("findByName");
    find(searchRecipeName, "title");
  }, [find, searchRecipeName]);

  const retrieveNextPage = useCallback(() => {
    if (currentSearchMode === "findByName") {
      findByName();
    } 
    else {
      retrieveRecipes();
    }
  }, [currentSearchMode, findByName, retrieveRecipes]);


  // Use effect to carry outside effect functionality
  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  // Retrieve the next page if currentPage value changes
  useEffect(() => {
    retrieveNextPage();
  }, [currentPage, retrieveNextPage]);


  // Other functions that are not depended on by useEffect
  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchRecipeName(searchName);
  }

  // Load default image when poster is not found
  const imgNotFound = e => {
    e.target.onerror = null;
    e.target.src = "../images/NoPosterAvailable-crop.jpeg"
  }

  return (
    <div className="App">
      <Container className="main-container">
        <Form>
          <Row>
            <Col>
            <Form.Group className="mb-3">
              <Form.Control
              type="text"
              placeholder="Search by name"
              value={searchRecipeName}
              onChange={onChangeSearchName}
              />
            </Form.Group>
            <Button 
              variant="success"
              type="button"
              onClick={findByName}
            >
              Search
            </Button>
            </Col>
        </Row>
      </Form>
      <Row className="recipeRow">
        { recipes.map ((recipe) => {
          return(
            <Col key={recipe._id}>
              <Card className="recipeListCard">
              { user && (
                  saved.includes(recipe._id) ?
                  <Col>
			              <Heart className="heart" isActive={saved.includes(recipe._id)} onClick={() => {
                      deletesaved(recipe._id);
                  }}/>
                  </Col>
                  :
                  <Col>
                  <Heart className="heart" style={{stroke: "white"}} isActive={saved.includes(recipe._id)} onClick={() => {
                    addsaved(recipe._id);
                  }}/>
                  </Col>
              ) }
              <Card.Img
                className="smallPoster"
                src={recipe.picture}
                width={100}
                height={300}
                onError={imgNotFound}
                />
                <Card.Body className="cardBody">
                  <Card.Title> {recipe.recipe_name}</Card.Title>
                  <Card.Text className="truncate">
                      {recipe.content}
                  </Card.Text>
                  <Link to={"/recipes/"+recipe._id}>
                    View Full Recipe
                  </Link>
                </Card.Body>
                <Card.Footer className="text-muted">
                  #{recipe.meal} #{recipe.dietary} #{recipe.difficulty}
                </Card.Footer>
              </Card>
            </Col>
          )
        })}
      </Row>
      <br></br>
      <Row>
        <p className="page_txt"> Page { currentPage + 1 }</p>
        { (totalResults - (entriesPerPage * currentPage)) > 20 &&
        <Button
          className="primary" size="sm" color="green"
          onClick={() => { setCurrentPage(currentPage + 1)} }
          >
              Get next { entriesPerPage } results
          </Button>
        }
      </Row>
      <br></br>
      </Container>
    </div>
  )
}


export default RecipesList;