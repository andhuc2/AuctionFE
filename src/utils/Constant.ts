export const Constant = {
  SUCCESS: {
    SUCCESS: "Success!",
    DATA_FETCHED: "Get data successfully!",
    DATA_SAVED: "Data saved successfully!",
    DATA_UPDATED: "Data updated successfully!",
    DATA_DELETED: "Data deleted successfully!",
    AUTHENTICATED: "Authenticated successfully!",
  },
  ERROR: {
    FAIL: "Failed!",
    REQUEST: "There was an error with your request.",
    RESPONSE: "An error occurred!",
    UNAUTHENTICATED: "Authentication failed!",
    UNAUTHORIZED: "You are not authorized to perform this action.",
    NOT_FOUND: "Not found.",
    TIMEOUT: "Disconnected from the server.",
  },
  ASSET: {
    LOGO_URL: import.meta.env.VITE_LOGO_URL || "/logo.svg"
  }
};
