"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  useGetMeQuery,
} from "@/store/api/authApi";

import {
  setCredentials,
  setAuthInitialized,
  clearCredentials,
} from "@/store/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  const {
    data,
    isSuccess,
    isError,
  } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setCredentials(data.data));
      dispatch(setAuthInitialized());
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(clearCredentials());
      dispatch(setAuthInitialized());
    }
  }, [isError, dispatch]);

  return null;
}

