import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { deleteInventoryThunk, updateInventoryThunk } from '../../../redux/company/companySlice';
import c from './Inventory.module.css';

export const Inventory = ({ selectedPlace, statePlaces, isThereInventory }) => {
  const dispatch = useDispatch();
  const [editItemId, setEditItemId] = useState(null);
  const [count, setCount] = useState('');
  const [name, setName] = useState('');

  const handleEditItem = useCallback(
    (item) => {
      setEditItemId(item.id);
      setCount(item.count);
      setName(item.name);
    }, []
  );
  
  const handleUpdateInventory = useCallback(
    (item) => {
      dispatch(updateInventoryThunk(item.id, count, name));
      setEditItemId(null);
    }, [count, name, dispatch]
  );

  const inventoryItems = useMemo(
    () =>
      isThereInventory.map((item) => {
        const selectedPlaceParts = statePlaces?.filter((place) => place.id === selectedPlace)[0]?.parts || false;

        return (
          <li className={c.inventory__item} key={item.id}>
            {editItemId === item.id ? (
              <form
                className={c.inventory__form}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateInventory(item);
                }}
              >
                <div className={c.inventory__formEditWrapper}>
                  <input type="text" 
                         value={name} 
                         onChange={(e) => setName(e.target.value)} />
                  <input type="number" 
                         value={count} 
                         onChange={(e) => setCount(e.target.value)} />
                </div>
                <button type="submit">Сохранить</button>
              </form>
            ) : (
              <>
                <p>
                  Название <span>{item.name}</span>
                </p>
                <div>
                  Количество{" "}
                  {selectedPlaceParts ? (
                    <span>{item.count}</span>
                  ) : (
                    <>
                      <span>{item.count}</span>
                      <p className={c.inventory__buttons}>
                        <button
                          className={c.inventory__editButton}
                          type="button"
                          onClick={() => handleEditItem(item)}
                        >
                          {" "}
                          &#9998;
                        </button>
                        <button
                          className={c.inventory__delButton}
                          type="button"
                          onClick={() => dispatch(deleteInventoryThunk(item.id))}
                        >
                          &#10006;
                        </button>
                      </p>
                    </>
                  )}
                </div>
              </>
            )}
          </li>
        );
      }),
    [count, name, dispatch, editItemId, handleEditItem, handleUpdateInventory, isThereInventory, selectedPlace, statePlaces]
  );

  return <ul className={c.inventory}>{inventoryItems}</ul>;
};
