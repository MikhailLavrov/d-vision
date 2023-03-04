export const getHeadItems = (places) => {
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

export const getRecursedPlacesArr = (places, partIDs, inventory) => {
  let parsedPlaces = []
  let result = []
  
  places.forEach(place => {
    let isNewPlace = parsedPlaces.find(parsed => parsed === place.id) || (partIDs && !partIDs.find(id => id === place.id))
    let localInventCount = inventory?.filter(item => item.placeId === place.id).length
    
    if (isNewPlace) return parsedPlaces.push(place.id)
    
    if (place.parts) {
      const children = getRecursedPlacesArr(places, place.parts, inventory);

      result.push({
        ...place, 
        parts: children,
        localInventCount: localInventCount,
        inventoryTotal: localInventCount + children.reduce((res, item) => (item.inventoryTotal ? res + item.inventoryTotal : res), 0),
      });
    } else {
      result.push({...place, localInventCount: localInventCount, inventoryTotal: localInventCount ?? 0})
    }
  })

  return result
}

