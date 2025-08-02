import { createSlice } from "@reduxjs/toolkit";

const initialState = {
     videos: [],
     videosCount: 0
}

const videoSlice = createSlice({
    name: 'videos', 
    initialState,
    reducers: {
         addToSaveList : (state:any, action) =>{
             state.videos.push(action.payload);
             state.videosCount = state.videos.length;
         },
         deleteFromSaveList: (state, action) => {
            state.videos = state.videos.filter((video: any) => video.video_id !== action.payload);
            state.videosCount = state.videos.length;
         },
         clearSaveList: (state) => {
            state.videos = [];
            state.videosCount = 0;
        }
    }
});
export const { addToSaveList, deleteFromSaveList, clearSaveList } = videoSlice.actions;
export default videoSlice.reducer;