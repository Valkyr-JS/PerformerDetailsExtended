export const createDuration = (seconds: number): string => {
  const inMinutes = Math.floor(seconds / 60);
  const inHours = Math.floor(inMinutes / 60);
  const inDays = Math.floor(inHours / 24);

  let output = "";

  const totalHours = inHours % 60;
  const totalMinutes = inMinutes % 60;
  const totalSeconds = seconds % 60;

  if (inDays > 0) output += inDays + " days ";
  if (!!totalHours || !!output.length) output += totalHours + "h ";
  if (!!totalMinutes || !!output.length) output += totalMinutes + "m ";
  output += totalSeconds + "s ";

  return output;
};
