import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemState {
  item: string;
}

const initialState: ItemState = {
  item: "",
};

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItem(state, action: PayloadAction<string>) {
      state.item = action.payload;
    },
  },
});

export const { setItem } = itemSlice.actions;
export default itemSlice.reducer;
