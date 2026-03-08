// Utility function for standardized API responses
export const sendResponse = (res, status, success, message, data = null) => {
  const response = { success, message };
  if (data) response.data = data;
  res.status(status).json(response);
};

export const sendError = (res, status, error) => {
  res.status(status).json({ success: false, error });
};

export const sendSuccess = (res, status, message, data = null) => {
  const response = { success: true, message };
  if (data) response.data = data;
  res.status(status).json(response);
};
