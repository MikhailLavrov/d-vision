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
      state.inventory.push(action.payload);
    },
    deleteInventory: (state, action) => {
      state.inventory.filter((item) => item.id !== action.itemId)
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
          let docs = response.docs.map(x => ({
            id: x.id,
            // data: x.data(),
            // placeId: x.data().place ? x.data().place.id : null,
          }));
          dispatch(getInventory(docs));
        });
}
export const addInventoryThunk = (itemName, countNumber, placeId) => (dispatch) => {
  return companyAPI.addInventory(itemName, countNumber, placeId)
        .then(() => {
          dispatch(addInventory({itemName, countNumber, placeId}))
          console.info("addInventoryThunk Done")
        });
}
export const deleteInventoryThunk = (itemId) => (dispatch) => {
  return companyAPI.deleteInventory()
        .then(() => {
          dispatch(deleteInventory(itemId))
          console.info("deleteInventoryThunk Done");
        });
}
export const updateInventoryThunk = (itemId, countNumber) => (dispatch) => {
  return companyAPI.updateInventory(itemId)
        .then(() => {
          dispatch(updateInventory(itemId, countNumber))
          console.info("Done");
        });  
}

export default companySlice.reducer;
