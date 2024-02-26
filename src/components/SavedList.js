import React, { useState, useEffect, useCallback } from 'react';
import RecipeDataService from "../services/recipes"; 
// import update from 'immutability-helper'
// import { DndCard} from './DndCard.js';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row' ;
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Heart from "react-heart";
import "./SavedList.css";
import "./RecipesList.css";


const SavedList = ({
    saved,
    addsaved,
    deletesaved
   }) => {
    // useState to set state values
    const [recipes, setRecipes] = useState([]);
    useEffect(() => {
        if(saved.length > 0) {
            setRecipes(saved);
        }
    }, [saved] )
    
    const retrievesavedRecipes = useCallback(() => {
        RecipeDataService.getsavedRecipes(saved)
            .then(response => {
                setRecipes(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }, [saved]);

    const imgNotFound = e => {
        e.target.onerror = null;
        e.target.src ="../images/NoPosterAvailable-crop.jpeg"
      }

    useEffect(() => {
        retrievesavedRecipes(saved);
  
    },[saved, retrievesavedRecipes])

  

    return(
        <div>
            <Container>
            {  recipes && recipes.length === 0 ? (
                <div className="NoSavedBackground NoSavedCard">
                    There are no saved Recipes
                </div>
            ): (
            <Container className="main-container">
            <Row>
            { recipes && recipes.map((recipe, index) => {
                return(
                        <Col key={recipe._id}>
                          <Card className="recipeListCard">
                          {(
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
                            <Card.Body>
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
                  
                )})}
        </Row>
        </Container>
            )}
    </Container> 
    </div>
    )
}

export default SavedList;