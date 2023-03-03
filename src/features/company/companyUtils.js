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

      result.push({...place, 
                  parts: getRecursedPlacesArr(places, place.parts, inventory),
                  localInventCount: localInventCount,
                  total: (place.localInventCount ?? 0) + result.reduce((res, item) => res+item.total,0)})
    } else {
      result.push({...place, localInventCount: localInventCount})
    }

    // const children = [{total: 3}, {total: 12}, {total: 7}]
    // const currentPlace = {
    //   ...place,
    //   parts:['pohui'],
    //   local: place.local,
    //   total: (place.local ?? 0) + children.reduce((res, item) => res+item.total,0)
    // }

  })

  return result
}
