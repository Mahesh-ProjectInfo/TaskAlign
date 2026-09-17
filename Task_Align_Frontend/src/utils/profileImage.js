const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const getProfileImageUrl = (profilePicture) => {
  if (!profilePicture) {
    return null;
  }

  // Already full URL
  if (
    profilePicture.startsWith("http://") ||
    profilePicture.startsWith("https://")
  ) {
    return profilePicture;
  }

  // DB path → Backend URL
  return `${API_BASE_URL}${profilePicture}`;
};