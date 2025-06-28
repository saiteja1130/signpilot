import {createSlice} from '@reduxjs/toolkit';

const photosActiveSlice = createSlice({
  name: 'photosActive',
  initialState: {
    value: null,
  },
  reducers: {
    setPhotoState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {setPhotoState} = photosActiveSlice.actions;
export default photosActiveSlice.reducer;
