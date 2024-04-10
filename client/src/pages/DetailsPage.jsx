import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DetailsPage = () => {
  const { id } = useParams();
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`/api/items/${id}`);
        const data = await response.json();
        setItemDetails(data);
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };

    fetchItemDetails();
  }, [id]);

  return (
    <div>
      <h1>Item Details</h1>
      {itemDetails ? (
        <div>
          <h2>{itemDetails.title}</h2>
          <p>{itemDetails.description}</p>
        </div>
      ) : (
        <p>Loading item details...</p>
      )}
    </div>
  );
};

export default DetailsPage;
