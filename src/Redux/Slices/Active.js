import {createSlice} from '@reduxjs/toolkit';

const activeSlice = createSlice({
  name: 'active',
  initialState: {
    value: null,
  },
  reducers: {
    setActiveState: (state, action) => {
      if (state.value === action.payload) {
        state.value = null;
      } else {
        state.value = action.payload;
      }
    },
  },
});

export const {setActiveState} = activeSlice.actions;

export default activeSlice.reducer;
