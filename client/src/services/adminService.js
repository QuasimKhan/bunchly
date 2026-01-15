import api from "../lib/api.js";

// Analytics API
export const getAnalyticsOverview = async (period = "7d") => {
  const response = await api.get(`/api/admin/analytics/overview?period=${period}`);
  return response.data;
};

export const getAnalyticsTimeSeries = async (period = "7d") => {
  const response = await api.get(`/api/admin/analytics/time-series?period=${period}`);
  return response.data;
};

export const getAnalyticsGeoResult = async (period = "7d") => {
  const response = await api.get(`/api/admin/analytics/geo?period=${period}`);
  return response.data;
};

export const getAnalyticsDeviceResult = async (period = "7d") => {
  const response = await api.get(`/api/admin/analytics/devices?period=${period}`);
  return response.data;
};

export const getAnalyticsTopPages = async (period = "7d", page = 1, limit = 10) => {
  const response = await api.get(`/api/admin/analytics/pages?period=${period}&page=${page}&limit=${limit}`);
  return response.data;
};
