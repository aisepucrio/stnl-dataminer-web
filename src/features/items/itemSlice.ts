import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemState {
  value: string;
}

const initialState: ItemState = {
  value: "",
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setItem(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

export const { setItem } = itemSlice.actions;
export default itemSlice.reducer;
