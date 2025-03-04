import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },
    updateStart : (state)=>{
      state.loading = true
      state.error = null
    },
    updateSuccess: (state, action)=>{
      state.loading = false
      state.error = null
      state.currentUser = action.payload
    },
    updateFailure : (state, action)=>{
      state.loading = false
      state.error = action.payload
    },
    deleteUserStart: (state)=>{
      state.loading = true
      state.error = null
    },
    deleteUserSuccess :(state)=>{
      state.currentUser = null
      state.loading = false
      state.error = null
    },
    deleteUserFailure: (state, action)=>{
      state.loading = false
      state.error = action.payload
    },
    signoutSuccess: (state)=>{
      state.currentUser = null
      state.loading = false
      state.error = null
    }
  },
});

export const { signInStart, signInSuccess, signInFailure, updateFailure, updateStart, updateSuccess, deleteUserFailure, deleteUserSuccess, deleteUserStart, signoutSuccess } = userSlice.actions;

export default userSlice.reducer;
