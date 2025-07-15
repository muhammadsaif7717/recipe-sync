export const getURL = async () => {
  try {
    const url = process.env.NEXT_PUBLIC_URL;
    if (!url) {
      throw new Error('Missing URL');
    }
    return url;
  } catch (err) {
    throw new Error(`Failed to get URL ${err}`);
  }
};
