export const formatConfidence = (value) => `${(value * 100).toFixed(2)}%`;
export const formatDate = (value) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
