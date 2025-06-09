import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {}
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        addUser: (state, payload) => {
            state.user = payload;
        },
        removeUser: (state) => {
            state.user = {}
        }
    }
})

export const { addUser, removeUser } = authSlice.actions;
export default authSlice.reducer
