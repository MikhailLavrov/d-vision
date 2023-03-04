import { useDispatch } from 'react-redux';
import { deleteInventoryThunk } from '../companySlice';
import c from './Inventory.module.css';

export const Inventory = (props) => {
  const {selectedPlace, statePlaces, isThereInventory} = props;
  const dispatch = useDispatch();

  const handleDeleteInventory = (itemId) => {
    dispatch(deleteInventoryThunk(itemId));
  }
  

  return isThereInventory.map((item) => {
    return (
      <li className={c.inventory} key={item.id}>
        <p>Название <span>{item.name}</span></p>
        <p>
          Количество{" "}
          {statePlaces?.filter((place) => place.id === selectedPlace)[0]?.parts 
          ? (
            <span>{item.count}</span>
          ) : (
            <>
              <span id='itemCount'>{item.count}</span>
              <button className={c.inventory__delButton} 
                      onClick={() => handleDeleteInventory(item.id)}>&#10060;</button>
            </>
          )}
        </p>
      </li>
    );
  });
};
