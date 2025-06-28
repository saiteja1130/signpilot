import {configureStore} from '@reduxjs/toolkit';
import activereducer from './Slices/Active';
import loginReducer from './Slices/LoginData';
import projectReducer from './Slices/ProjectData';
import signProjectReducer from './Slices/SigProject';
import photoReducer from './Slices/PhotosActive';

export const store = configureStore({
  reducer: {
    active: activereducer,
    login: loginReducer,
    project: projectReducer,
    signProject: signProjectReducer,
    photoActive: photoReducer,
  },
});
