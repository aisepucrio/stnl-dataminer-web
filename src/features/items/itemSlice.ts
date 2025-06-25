import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemState {
  value: string;
  itemName: string;
}

const initialState: ItemState = {
  value: "",
  itemName: "",
};

const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setItem(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
    setItemName(state, action: PayloadAction<string>) {
      state.itemName = action.payload;
    },
  },
});

export const { setItem, setItemName } = itemSlice.actions;
export default itemSlice.reducer;
