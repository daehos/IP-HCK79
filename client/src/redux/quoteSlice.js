import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk untuk fetch quotes
export const fetchQuote = createAsyncThunk("quote/fetchQuote", async () => {
  const { data } = await axios.get("https://api.quotable.io/random");
  return data.content;
});

const quoteSlice = createSlice({
  name: "quote",
  initialState: {
    quote: "",
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quote = action.payload;
      })
      .addCase(fetchQuote.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default quoteSlice.reducer;
