export function userFacingRequestError(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : "";
  if (/Unsupported FormData(?:Part)? implementation/i.test(message)) {
    return "The selected file could not be prepared. Choose it again and retry.";
  }
  if (/network request failed|failed to fetch|networkerror|timed out/i.test(message)) {
    return "Unable to connect to Agape. Check your internet connection and retry.";
  }
  return message || fallback;
}
