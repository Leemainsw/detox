export const extractJsonChunk = (text: string) => {
  const marker = "[JSON_DATA]";
  const markerIndex = text.indexOf(marker);

  if (markerIndex !== -1) {
    return {
      textPart: text.slice(0, markerIndex).trim(),
      jsonPart: text.slice(markerIndex + marker.length).trim(),
    };
  }

  const jsonStart = text.indexOf("{");
  const markerStart = text.indexOf("[");
  const indices = [jsonStart, markerStart].filter((idx) => idx !== -1);
  const splitIndex = indices.length > 0 ? Math.min(...indices) : undefined;

  if (splitIndex !== undefined) {
    return {
      textPart: text.slice(0, splitIndex).trim(),
      jsonPart: "",
    };
  }

  return { textPart: text.trim(), jsonPart: "" };
};
