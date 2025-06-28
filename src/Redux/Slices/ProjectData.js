import {createSlice} from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    value: {},
  },
  reducers: {
    addProject: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {addProject} = projectSlice.actions;

export default projectSlice.reducer;
