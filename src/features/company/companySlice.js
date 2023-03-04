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
      console.log(action.payload);
      state.inventory.push(action.payload);
    },
    deleteInventory: (state, action) => {
      state.inventory = state.inventory.filter((item) => item.id !== action.payload);
    },
    updateInventory: (state, action) => {
      state.inventory.map(item => {
        if (item.id === action.itemId) {
          return item.count = action.countNumber;
        }
        return console.log('Не сработал updateInventory action :((((');
      })
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
          dispatch(addInventory({id, name, count, placeId}))
        });
}
export const deleteInventoryThunk = (itemId) => (dispatch) => {
  return companyAPI.deleteInventory(itemId)
        .then(() => dispatch(deleteInventory(itemId)));
}
export const updateInventoryThunk = (itemId, countNumber) => (dispatch) => {
  return companyAPI.updateInventory(itemId)
        .then(() => {
          dispatch(updateInventory(itemId, countNumber))
          console.info("Done");
        });  
}

export default companySlice.reducer;
