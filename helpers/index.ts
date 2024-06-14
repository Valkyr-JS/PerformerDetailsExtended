export const createDuration = (seconds: number): string => {
  const inMinutes = Math.floor(seconds / 60);
  const inHours = Math.floor(inMinutes / 60);
  const inDays = Math.floor(inHours / 24);

  let output = "";

  const totalHours = inHours % 60;
  const totalMinutes = inMinutes % 60;
  const totalSeconds = seconds % 60;

  if (inDays > 0) output += (inDays < 10 ? "0" + inDays : inDays) + ":";
  output += (totalHours < 10 ? "0" + totalHours : totalHours) + ":";
  output += (totalMinutes < 10 ? "0" + totalMinutes : totalMinutes) + ":";
  output += totalSeconds < 10 ? "0" + totalSeconds : totalSeconds;

  return output;
};
