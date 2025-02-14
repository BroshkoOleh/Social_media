import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config";

// Запит для створення профілю
export const createProfile = createAsyncThunk(
  "profile/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/profiles`, profileData, {
        withCredentials: true,
      });
      console.log("Запит для створення профілю (відповідь модалки)", response.data);

      return response.data; // Очікуємо об'єкт з profileId
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Запит для оновлення профілю
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ newProfileData, profileId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/profiles/${profileId}`, newProfileData, {
        withCredentials: true,
      });
      console.log("Запит для оновлення профілю пройшло успішно", response.data);

      console.log("response.status", response.status);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Запит для отримання профілю за profileId
export const fetchProfileByProfileId = createAsyncThunk(
  "profile/fetchProfile",
  async (profileId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profiles/${profileId}`, {
        withCredentials: true,
      });
      console.log("отримання профілю за profileId", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProfileByUserId = createAsyncThunk(
  "profile/fetchProfileByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profiles/user`, {
        params: {
          userId: userId, // передаємо userId як параметр запиту
        },
        withCredentials: true,
      });
      console.log("отримання профілю за userId ", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  profileData: {},
  profileId: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = {
        ...state.profileData,
        ...action.payload,
      };
    },
    logoutProfile(state) {
      Object.assign(state, initialState); // Скидаємо стейт до початкового
    },
  },

  extraReducers: (builder) => {
    builder
      // Створення профілю
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileId = action.payload.profileId; // Зберігаємо profileId
        state.profileData = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Отримання профілю за profileId
      .addCase(fetchProfileByProfileId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileByProfileId.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(fetchProfileByProfileId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Оновлення профілю
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Отримання профілю за userId
      .addCase(fetchProfileByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.profileId = action.payload.profileId; // Зберігаємо profileId
        state.profileData = action.payload; // Оновлюємо профільні дані
      })
      .addCase(fetchProfileByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setProfileData, logoutProfile } = profileSlice.actions;
export default profileSlice.reducer;
