import React from "react";
import "./PlaceList.css";
import Card from "../../common/components/UIElement/Card";
import PlaceItem from "./PlaceItem";

const PlaceList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list-center">
        <Card>
          <h2>No Places Found</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
