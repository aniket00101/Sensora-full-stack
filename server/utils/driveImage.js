/**
 * Converts a Google Drive "share" link (or a raw file ID) into a direct,
 * hotlink-friendly image URL that can be used straight in an <img src="">.
 *
 * Accepts, and normalizes, all of these forms:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID&export=view
 *   https://drive.google.com/uc?export=view&id=FILE_ID
 *   https://drive.google.com/thumbnail?id=FILE_ID
 *   FILE_ID                                (bare id, no URL at all)
 *
 * Anything that is NOT a recognizable Google Drive link (e.g. a normal
 * https://... image URL from elsewhere) is returned unchanged, so this is
 * always safe to run on any "image" value before saving it.
 *
 * The file MUST be shared as "Anyone with the link -> Viewer" in Drive,
 * otherwise Google will not serve the image publicly.
 */

const DRIVE_ID_PATTERNS = [
  /\/file\/d\/([a-zA-Z0-9_-]{10,})/, // /file/d/FILE_ID/view
  /[?&]id=([a-zA-Z0-9_-]{10,})/, // ?id=FILE_ID  (open?id=... or uc?id=...)
  /\/d\/([a-zA-Z0-9_-]{10,})/, // /d/FILE_ID (thumbnail / lh3 style links)
];

function extractDriveFileId(input) {
  if (!input) return null;
  const value = String(input).trim();

  // Bare Drive file ID pasted directly (no slashes, no protocol)
  if (/^[a-zA-Z0-9_-]{10,}$/.test(value) && !value.includes("http")) {
    return value;
  }

  if (!value.includes("drive.google.com") && !value.includes("googleusercontent.com")) {
    return null; // not a Google Drive link at all
  }

  for (const pattern of DRIVE_ID_PATTERNS) {
    const match = value.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

/**
 * Turn any supported input into a direct-view Drive image URL.
 * Non-Drive URLs (or empty values) are passed through untouched.
 */
function toDirectImageUrl(input) {
  if (!input) return input;
  const value = String(input).trim();
  const fileId = extractDriveFileId(value);
  if (!fileId) return value; // already a normal URL (or nothing we recognize) — leave as-is

  // The Drive "thumbnail" endpoint reliably renders inline (no virus-scan /
  // download interstitial) and supports a size hint via `sz`.
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

module.exports = { toDirectImageUrl, extractDriveFileId };
