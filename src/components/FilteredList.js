import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router";
import RecipeDataService from "../services/recipes";
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row' ;
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Heart from "react-heart";
import Button from 'react-bootstrap/Button'
import "./RecipesList.css";
import ".././App.css";


const FilteredList = ({
  user,
  saved,
  addsaved,
  deletesaved
}) => {
    // useState to set state values
    const [recipes, setRecipes] = useState([]);
    const [doRetrieval, setDoRetrieval] = useState(true);
    const {category, type} = useParams();
    const [currentPage, setCurrentPage] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(0);
    const [totalResults, setTotalResults] = useState("");
    const NO_IMG_FOUND = "https://images.pexels.com/photos/1087897/pexels-photo-1087897.jpeg?auto=compress&cs=tinysrgb&w=640l";
    //let count_reload = 0; //for testing

    const retrieveFilteredRecipes = useCallback(() => {
        RecipeDataService.find(type, category, currentPage)
            .then(response => {
                setRecipes(response.data.recipes);
                setCurrentPage(response.data.page);
                setEntriesPerPage(response.data.entries_per_page);
                setTotalResults(response.data.total_results);
            })
            .catch(e => {
                console.log(e);
            });
    }, [type, category, currentPage]);

    
    const retrieveNextPage = useCallback(() => {
        retrieveFilteredRecipes()
      }, [retrieveFilteredRecipes]);

    function getImageSrc(recipe) {
        if(recipe.picture && recipe.picture!==""){
            //console.log(recipe.picture)
            return recipe.picture;
        }
        else{
            return NO_IMG_FOUND;
        }
    }

     // Use effect to carry outside effect functionality
    useEffect(() => {
    setCurrentPage(0);
    }, []);

    // Retrieve the next page if currentPage value changes
    useEffect(() => {
    retrieveNextPage();
    }, [currentPage, retrieveNextPage]);

    useEffect(() => {
        if(doRetrieval){
            retrieveFilteredRecipes();
            setDoRetrieval(false);
        }
    },[doRetrieval, retrieveFilteredRecipes])

  return (
    <div className="App">
      <Container className="main-container">
      <Row className="recipeRow">
          <Row>
          <br></br>
            {
            recipes.length > 0 ?
              (<h1 className="page_txt">Here are {recipes.length} {type} recipes!</h1>)
              :
              (<h1 className="page_txt">No {type} recipes. Login to add your own!</h1>)
          }
          <br></br>
          </Row>
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
                src={getImageSrc(recipe)}
                width={100}
                height={300}
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

export default FilteredList;