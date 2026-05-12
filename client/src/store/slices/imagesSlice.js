import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    images: {},
    audio:{}
};

const imagesSlice = createSlice({
    name: "images",
    initialState,
    reducers: {
        setImages: (state, action) => {
            state.images = action.payload;
        },
        setAudio: (state, action) => {
            state.audio = action.payload;
        },
    },
});


export const { setImages, setAudio } = imagesSlice.actions;
export default imagesSlice.reducer;