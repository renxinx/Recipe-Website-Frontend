import React, { useState } from 'react';
import RecipeDataService from "../services/recipes.js";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import ".././App.css";


const EditRecipe = ({user}) => {
    const navigate = useNavigate()
    let params= useParams();
    let location = useLocation();
    //console.log("location: ", location.state.recipe.recipe.recipe_name);
    let default_recipe = location.state.recipe.recipe;
    console.log(default_recipe);
    const [recipe_name, setRecipeName] = useState(default_recipe.recipe_name)
    const [content, setContent] = useState(default_recipe.content);
    const [meal, setMeal] = useState(default_recipe.meal)
    const [difficulty, setDifficulty] = useState(default_recipe.difficulty)
    const [dietary, setDietary] = useState(default_recipe.dietary)
    const [picture, setPicture] = useState(default_recipe.picture)

  const onChangeContent = e => {
    const content = e.target.value;
    setContent(content);
  }

  const onChangeRecipeName = e =>{
    const recipeName = e.target.value;
    setRecipeName(recipeName);
  }

  const onChangeMeal = e =>{
    const meal = e.target.value;
    setMeal(meal);
  }

  const onChangeDifficulty = e =>{
    const difficulty = e.target.value;
    setDifficulty(difficulty);
  }

  const onChangeDietary = e =>{
    //console.log("e.target.value",e.target.value)
    const temp = e.target.value;
    //console.log("temp",temp)
    setDietary(temp);
    //console.log("new value:", dietary)
  }

  const onChangePicture = e =>{
    //console.log(picture)
    const temp = e.target.value;
    setPicture(temp);
    //console.log(picture)
  }

  const saveContent = () => {
    var putData = {
        recipe_id:default_recipe._id,
        name:user.name,
        user_id: user.googleId,
        meal: meal,
        difficulty: difficulty,
        dietary: dietary,
        picture: picture,
        content: content,
        recipe_name: recipe_name
      }
      console.log(putData)
      RecipeDataService.updateContent(putData)
          .then(response=>{
              navigate("/recipes/"+params.id)
              console.log("Successful edit");
          })
          .catch(e=>{
              console.log(e);
    });
  }

  return (
    <div className="App">
    <Container className="main-container">
      <Form>
        <Form.Group  className="mb-3">
          <Form.Label> Recipe Name </Form.Label>
          <Form.Control
              type="text"
              required
              defaultValue= ""
              value = { recipe_name }
              onChange={ onChangeRecipeName }
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Dietary</Form.Label>
            <Form.Control
                defaultValue= {default_recipe.dietary}
                as="select"
                value={dietary}
                onChange={ onChangeDietary }
            >
              <option>Choose...</option>
              <option value = "vegan">Vegan</option>
              <option value = "keto">Keto</option>
              <option value = "vegetarian">Vegetarian</option>
              <option value = "paleo">Paleo</option>
              <option value = "whole30">Whole30</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Meal</Form.Label>
            <Form.Control
                defaultValue= {default_recipe.meal}
                as = "select"
                value = { meal }
                onChange={ onChangeMeal }
            >
              <option>Choose...</option>
              <option value = "breakfast">Breakfast</option>
              <option value = "lunch">Lunch</option>
              <option value = "dinner">Dinner</option>
              <option value = "snack">Snack</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Difficulty</Form.Label>
            <Form.Control
                defaultValue= {default_recipe.difficulty}
                as = "select"
                value = { difficulty }
                onChange={ onChangeDifficulty }
            >
              <option>Choose...</option>
              <option value = "beginner">Beginner</option>
              <option value = "intermediate">Intermediate</option>
              <option value = "advanced">Advanced</option>
            </Form.Control>
          </Form.Group>
        </Row>

        <Form.Group  className="mb-3">
          <Form.Label> Image URL (optional) </Form.Label>
          <Form.Control
              type="text"
              value = { picture }
              onChange={ onChangePicture }
          />
        </Form.Group>

        <Form.Group  className="mb-3">
          <Form.Label> Recipe </Form.Label>
          <Form.Control
              as="textarea"
              rows = "10"
              type="text"
              required
              value ={ content }
              onChange={ onChangeContent }
          />
        </Form.Group>
        <Button variant="primary" onClick={ saveContent }>
          Submit
        </Button>
      </Form>
    </Container>
    </div>
  )
}

export default EditRecipe;