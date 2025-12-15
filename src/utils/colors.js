// Helper: Hash a string to a deterministic Hex Color
export function stringToHex(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to Hex
  let c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  
  // Pad with zeros to ensure 6 digits
  return '#' + "00000".substring(0, 6 - c.length) + c;
}