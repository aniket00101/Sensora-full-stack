/**
 * Converts a Google Drive "share" link (or a raw file ID) into a direct,
 * hotlink-friendly image URL usable straight in an <img src="">.
 *
 * The backend already normalizes image URLs before they're saved, so most
 * of the time `item.image` coming from the API is already a direct link.
 * This is kept on the client too so:
 *   - admin gets a live preview before saving
 *   - any legacy/unsaved value still renders correctly
 *
 * Accepts:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID&export=view
 *   https://drive.google.com/thumbnail?id=FILE_ID
 *   FILE_ID                                (bare id)
 *
 * Any other URL (non Google-Drive) is returned unchanged.
 */

const DRIVE_ID_PATTERNS = [
  /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
  /[?&]id=([a-zA-Z0-9_-]{10,})/,
  /\/d\/([a-zA-Z0-9_-]{10,})/,
];

export function extractDriveFileId(input) {
  if (!input) return null;
  const value = String(input).trim();

  if (/^[a-zA-Z0-9_-]{10,}$/.test(value) && !value.includes("http")) {
    return value;
  }

  if (!value.includes("drive.google.com") && !value.includes("googleusercontent.com")) {
    return null;
  }

  for (const pattern of DRIVE_ID_PATTERNS) {
    const match = value.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

export function toDirectImageUrl(input) {
  if (!input) return input;
  const value = String(input).trim();
  const fileId = extractDriveFileId(value);
  if (!fileId) return value;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}
