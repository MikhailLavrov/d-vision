export const Inventory = (props) => {
  const {selectedPlace, statePlaces, isThereInventory} = props;

  return isThereInventory.map((item) => {
    return (
      <li key={item.id}>
        <p>Название <span>{item.name}</span></p>
        <p>
          Количество{" "}
          {statePlaces?.filter((place) => place.id === selectedPlace)[0]?.parts 
          ? (
            <span>{item.count}</span>
          ) : (
            <b>
              <span id='itemCount'>{item.count}</span>
            </b>
          )}
        </p>
      </li>
    );
  });
};