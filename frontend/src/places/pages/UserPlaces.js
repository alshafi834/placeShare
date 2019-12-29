import React from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";

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

const UserPlaces = () => {
  const userId = useParams().userId;
  const myPlaces = DummyPlaces.filter(place => place.creator === userId);
  return <PlaceList items={myPlaces} />;
};

export default UserPlaces;
