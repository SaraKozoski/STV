export const extractYoutubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

export const getYoutubeThumbnail = (youtubeId, quality = 'maxresdefault') => {
  if (!youtubeId) return null;
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
};

export const isValidYoutubeUrl = (url) => {
  return extractYoutubeId(url) !== null;
};
