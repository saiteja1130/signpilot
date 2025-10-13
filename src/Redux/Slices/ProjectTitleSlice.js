import {createSlice} from '@reduxjs/toolkit';

const projectTitleSlice = createSlice({
  name: 'projecttitle',
  initialState: {
    value: '',
  },
  reducers: {
    addProjectTitle: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {addProjectTitle} = projectTitleSlice.actions;

export default projectTitleSlice.reducer;
