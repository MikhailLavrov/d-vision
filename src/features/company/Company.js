import React, { useEffect, useState } from 'react';
import c from './Company.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getPlacesThunk, getInventoryThunk } from './companySlice';

// ===================== Utils ======================
const getHeadItems = (places) => {
  const ids = [];
  const parts = [];

  places.forEach(place => {
    if (place.parts) {
      return place.parts.forEach(part => parts.push(part))
    }
  });

  places.forEach(place => ids.push(place.id));

  const uniqueIds = ids.filter(id => !parts.includes(id));

  return places.filter(place => uniqueIds.includes(place.id)).map(i => i.id);
}

export const Company = () => {
  const dispatch = useDispatch();
  const places = useSelector(state => state.company.places);
  const inventory = useSelector(state => state.company.inventory);
  const [ selectedPlaceId, setSelectedPlaceId ] = useState(null);
  const getInventoryCount = (placeId) => inventory.filter(item => item.placeId === placeId).length;

  useEffect(() => {
    dispatch(getPlacesThunk());
    dispatch(getInventoryThunk());
  }, [dispatch]);
  
  // ===================== Places ======================
  let headPlaces = getHeadItems(places)
  
  const getRecursedPlacesArr = (places, partIDs) => {
    let parsedPlaces = []
    let result = []
    
    places.forEach(place => {
      let isNewPlace = parsedPlaces.find(parsed => parsed === place.id) || (partIDs && !partIDs.find(id => id === place.id))
      
      if (isNewPlace) return parsedPlaces.push(place.id)

      if (place.parts) {
        result.push({...place, parts: getRecursedPlacesArr(places, place.parts)})
      } else {
        result.push(place)
      }
    })
    
    return result
  }

  const recursedPlaces = getRecursedPlacesArr(places, headPlaces);

  const Tree = (nodes = recursedPlaces) => {
    if (!nodes || nodes.length === 0) {
      return null;
    }
  
    return (
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>
            <details>
              <summary>{node.name}</summary>
              {node.parts ? Tree(node.parts) : null}
            </details>
          </li>
        ))}
      </ul>
    );
  };
  

  // const allPlaces = recursedPlaces.map(place => {
  //   const inventoryCount = getInventoryCount(place.id);

  //   const matchingPlaceNames = place.data.parts.map(part => {
  //     return noParts.filter(nestedPlace => nestedPlace.id === part.id);
  //   }).flat();
    
  //   const nestedPlaces = matchingPlaceNames.map(placeName => (
  //     <li key={placeName.id} onClick={() => setSelectedPlaceId(placeName.id)}>
  //       {placeName.data.name} ({getInventoryCount(placeName.id)})
  //     </li>
  //   ))
      
  //   return (
  //     <details key={place.id}>
  //       <summary onClick={() => setSelectedPlaceId(place.id)}>
  //         {place.data.name} <span>({inventoryCount})</span>
  //       </summary>
  //       {
  //         matchingPlaceNames.length > 0 
  //         ? <ul>{nestedPlaces}</ul> 
  //         : null
  //       }
  //     </details>
  //   );
  // });
  
  // ===================== Inventory ======================

  const allInventory = inventory
  .filter(item => item.placeId === selectedPlaceId)
  .map(item => (
    <li key={item.id}>
      <p>Название <span>{item.data.name}</span></p>
      <p>Количество <span>{item.data.count}</span></p>
    </li>
  ));
    
  // ===================== FC RETURN ======================

  return (
    <section className={c.company}>
      <div className={c.company__places}>
        <h2>Место:</h2>
        {/* {allPlaces} */}
        {Tree(recursedPlaces)}
      </div>
      <div className={c.company__inventory}>
        {selectedPlaceId ? (
          <>
            <h2>Инвентарь в {places.find((place) => place.id === selectedPlaceId).data.name}:</h2>
            {allInventory.length > 0 ? (
              <ul>{allInventory}</ul>
            ) : (
              <p>Выберите место, чтобы увидеть его инвентарь</p>
            )}
          </>
        ) : (
          <p>Выберите место, чтобы увидеть его инвентарь</p>
        )}
      </div>
    </section>
  );

}
