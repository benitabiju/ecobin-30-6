export const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('blob:')) return path; // For local preview

  const backendUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  try {
    const url = new URL(backendUrl);
    return `${url.origin}${cleanPath}`;
  } catch (e) {
    return `http://127.0.0.1:8000${cleanPath}`;
  }
};
