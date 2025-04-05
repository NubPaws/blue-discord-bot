
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function isSpotifyUrl(url: string): boolean {
  return url.includes('spotify.com');
}
