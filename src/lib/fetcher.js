// src/lib/fetcher.js
export const fetcher = (...args) =>
  fetch(...args).then((res) => {
    if (!res.ok) {
      const error = new Error("An error occurred while fetching the data.");
      // Attach extra info to the error object.
      error.info = res.statusText;
      error.status = res.status;
      throw error;
    }
    return res.json();
  });
