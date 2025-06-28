import {createSlice} from '@reduxjs/toolkit';

const signSlice = createSlice({
  name: 'signproject',
  initialState: {
    value: {},
  },
  reducers: {
    addSignProject: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {addSignProject} = signSlice.actions;
export default signSlice.reducer;
