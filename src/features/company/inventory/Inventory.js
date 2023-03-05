import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteInventoryThunk, updateInventoryThunk } from '../companySlice';
import c from './Inventory.module.css';

export const Inventory = (props) => {
  const { selectedPlace, statePlaces, isThereInventory } = props;
  const dispatch = useDispatch();
  const [editItemId, setEditItemId] = useState(null);

  const handleDeleteInventory = (itemId) => dispatch(deleteInventoryThunk(itemId));

  const handleEditClick = (itemId) => setEditItemId(itemId);
  
  const handleUpdateInventory = (itemId, name, count) => {
    dispatch(updateInventoryThunk({ id: itemId, name, count }));
    setEditItemId(null);
  };

  return (
    <ul className={c.inventory}>
      {isThereInventory.map((item) => (
        <li className={c.inventory__item} key={item.id}>
          {editItemId === item.id ? (
            <div className={c.inventory__form}>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleUpdateInventory(item.id, e.target.value, item.count)}
              />
              <input
                type="text"
                value={item.count}
                onChange={(e) => handleUpdateInventory(item.id, item.name, e.target.value)}
              />
            </div>
          ) : (
            <>
              <p>Название <span>{item.name}</span></p>
              <div>
                Количество{" "}
                {statePlaces?.filter((place) => place.id === selectedPlace)[0]?.parts 
                ? (
                  <span>{item.count}</span>
                ) : (
                  <>
                    <span id="itemCount">{item.count}</span>
                    <p className={c.inventory__buttons}>
                      <button
                        className={c.inventory__editButton}
                        type="button"
                        onClick={() => handleEditClick(item.id)}
                      > &#9998;</button>
                      <button
                        className={c.inventory__delButton}
                        type="button"
                        onClick={() => handleDeleteInventory(item.id)}
                      >&#10006;</button>
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};
