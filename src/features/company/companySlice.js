import { createSlice } from '@reduxjs/toolkit';
import { companyAPI } from './companyAPI';

const initialState = {
  places: [],
  inventory: [],
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    getPlaces: (state, action) => {
      state.places = action.payload;
    },
    getInventory: (state, action) => {
      state.inventory = action.payload;
    },
    addInventory: (state, action) => {
      state.inventory.unshift(action.payload);
    },
    deleteInventory: (state, action) => {
      state.inventory = state.inventory.filter((item) => item.id !== action.payload);
    },
    updateInventory: (state, action) => {
      console.log('Редюсер редактор!', action.payload);
      state.inventory = state.inventory.map((item) => {
        if (item.id === action.payload.id) {
          console.log('Совпало item.id === action.id в редюсере: ', action.payload.id);
          return {
            ...item,
            count: action.payload.count
          };
        } else {
          return item;
        }
      });
    },
    
  },
}); 

export const { getPlaces, getInventory, addInventory, deleteInventory, updateInventory } = companySlice.actions;

export const getPlacesThunk = () => (dispatch) => {
  return companyAPI.getPlaces()
        .then(response => {
          let docs = response.docs.map(x => {
            const data = x.data()

            return {
              id: x.id,
              name: data.name,
              parts: data.parts && data.parts.map(part => part.id)
            }
          });
          dispatch(getPlaces(docs));
        })
}
export const getInventoryThunk = () => (dispatch) => {
  return companyAPI.getInventory()
        .then(response => {
          let docs = response.docs.map(x => {
            const data = x.data()

            return {
              id: x.id,
              name: data.name,
              count: data.count,
              placeId: data.place ? data.place.id : null
            }
          });
          dispatch(getInventory(docs));
        });
}
export const addInventoryThunk = (id, name, count, placeId) => (dispatch) => {
  return companyAPI.addInventory(id, name, count, placeId)
        .then(() => {
          dispatch(addInventory({name, count, placeId}))
        });
}
export const deleteInventoryThunk = (itemId) => (dispatch) => {
  return companyAPI.deleteInventory(itemId)
        .then(() => dispatch(deleteInventory(itemId)));
}
export const updateInventoryThunk = (id, count) => (dispatch) => {
  console.log('Санк редактора!',"// id: ",id, "// count: ", count);
  return companyAPI.updateInventory(id, count)
    .then(() => {
      dispatch(updateInventory({ id, count }));
    });
};


export default companySlice.reducer;
