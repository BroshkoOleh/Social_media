import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config"; // Імпортуємо базову URL

// Запит на отримання усіх користувачів
export const fetchAllUsers = createAsyncThunk(
  "chat/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profiles`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Помилка отримання користувачів");
    }
  }
);

// Запит на отримання усіх повідомлень з користувачем
export const fetchAllMessageByParams = createAsyncThunk(
  "chat/fetchAllMessageByParams",
  async ({ currentIdUser, idOtherProfile }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/chat`, {
        withCredentials: true,
        params: {
          id1: currentIdUser,
          id2: idOtherProfile,
          page: 0,
          size: 300,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Помилка отримання повідомлень");
    }
  }
);

// Отримання по роуту
export const fetchAllMessageByRout = createAsyncThunk(
  "chat/fetchAllMessageByRout",
  async ({ id, currentIdUser }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/chat`, {
        withCredentials: true,
        params: {
          id1: currentIdUser,
          id2: id,
          page: 0,
          size: 300,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Помилка отримання повідомлень");
    }
  }
);

// Відправлення нового повідомлення користувачу
export const postMessage = createAsyncThunk(
  "chat/postMessage",
  async ({ senderId, recipientId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/messages/create`,
        { senderId, recipientId, content },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Помилка надсилання повідомлення");
    }
  }
);

const initialState = {
  users: [],
  message: [],
  newMessage: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateNewMessage: (state, action) => {
      state.newMessage = action.payload;
    },
    clearNewMessage: (state) => {
      state.newMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchAllMessageByParams.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(fetchAllMessageByRout.fulfilled, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const { updateNewMessage, clearNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
