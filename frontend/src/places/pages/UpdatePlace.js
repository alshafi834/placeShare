import React from "react";
import { useParams } from "react-router-dom";
import { useForm } from "../../common/hooks/form-hook";
import "./PlaceForm.css";
import Input from "../../common/components/FormElements/Input";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../common/components/Util/Validators";
import Button from "../../common/components/FormElements/Button";

const DummyPlaces = [
  {
    id: "p1",
    title: "Koln cathedral",
    description: "Best cathedral in NRW",
    imageUrl:
      "https://www.tripsavvy.com/thmb/Uw4CfhbFrHw9tZZFPedaZnwVJQ0=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/CologneCathedral3-1489e8cf1ce94daaa05cfc585fedbeb1.jpg",
    address: "Domkloster 4, 50667 Köln",
    location: {
      lat: 50.9412784,
      lng: 6.9582814
    },
    creator: "u1"
  },
  {
    id: "p2",
    title: "Dusseldorf cathedral",
    description: "Best cathedral in NRW",
    imageUrl:
      "https://www.tripsavvy.com/thmb/Uw4CfhbFrHw9tZZFPedaZnwVJQ0=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/CologneCathedral3-1489e8cf1ce94daaa05cfc585fedbeb1.jpg",
    address: "Domkloster 4, 50667 Köln",
    location: {
      lat: 50.9412784,
      lng: 6.9582814
    },
    creator: "u2"
  }
];

const UpdatePlace = props => {
  const placeId = useParams().placeId;

  const identifiedPlace = DummyPlaces.find(p => p.id === placeId);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: identifiedPlace.title,
        isValid: true
      },
      description: {
        value: identifiedPlace.description,
        isValid: true
      }
    },
    true
  );

  const placeUpdateSubmitHandler = event => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Could not find place</h2>
      </div>
    );
  }

  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="input"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description"
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Update Place
      </Button>
    </form>
  );
};

export default UpdatePlace;
