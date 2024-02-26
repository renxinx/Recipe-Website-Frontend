import React, { useState } from 'react';
import RecipeDataService from "../services/recipes.js";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import ".././App.css";


const AddRecipe = ({ user }) => {
  const navigate = useNavigate()

  const [recipe_name, setRecipeName] = useState("")
  const [content, setContent] = useState("");
  const [meal, setMeal] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [dietary, setDietary] = useState("")
  const [picture, setPicture] = useState("")

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
    const dietary = e.target.value;
    setDietary(dietary);
  }

  const onChangePicture = e =>{
    const picture = e.target.value;
    setPicture(picture);
  }

  const saveContent = () => {
    let data = {
      recipe_name: recipe_name,
      meal: meal,
      difficulty: difficulty,
      dietary: dietary,
      content: content,
      picture: picture,
      name: user.name,
      user_id: user.googleId,
    }
    RecipeDataService.createRecipe(data)
      .then (response => {
        navigate("/recipes")
      })
      .catch(e => {
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
              value = { recipe_name }
              onChange={ onChangeRecipeName }
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label>Dietary</Form.Label>
            <Form.Control
                defaultValue="Choose..."
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
                defaultValue="Choose..."
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
                defaultValue="Choose..."
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

export default AddRecipe;