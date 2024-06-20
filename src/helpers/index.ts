/** Converts the given seconds into a uniform string showing an amount of time.
 * */
export const createDuration = (seconds: number): string => {
  const inMinutes = Math.floor(seconds / 60);
  const inHours = Math.floor(inMinutes / 60);
  const inDays = Math.floor(inHours / 24);

  let output = "";

  const totalHours = inHours % 24;
  const totalMinutes = inMinutes % 60;
  const totalSeconds = seconds % 60;

  if (inDays > 0) output += inDays + " days ";
  if (!!totalHours || !!output.length) output += totalHours + "h ";
  if (!!totalMinutes || !!output.length) output += totalMinutes + "m ";

  // Round down to match native
  output += Math.floor(totalSeconds) + "s ";

  return output;
};

/** Converts the given bytes into a uniform string showing a filesize, from
 * bytes to terabytes. */
export const createFilesize = (bytes: number): string => {
  const b = roundToTwo(bytes);
  const kb = roundToTwo(bytes / 1024);
  if (kb < 1) return b + "B";
  const mb = roundToTwo(kb / 1024);
  if (mb < 1) return kb + "KB";
  const gb = roundToTwo(mb / 1024);
  if (gb < 1) return mb + "MB";
  const tb = roundToTwo(gb / 1024);
  if (tb < 1) return gb + "GB";
  return tb + "TB";
};

/** Returns the associated string GenderEnum as a human-readable value. */
export const getGenderFromEnum = (gender: GenderEnum): string | null => {
  switch (gender) {
    case "MALE":
      return "Male";
    case "FEMALE":
      return "Female";
    case "TRANSGENDER_MALE":
      return "Transgender male";
    case "TRANSGENDER_FEMALE":
      return "Transgender female";
    case "INTERSEX":
      return "Intersex";
    case "NON_BINARY":
      return "Non-binary";
  }
  return null;
};

/** Round the provided number to two decimal places. */
const roundToTwo = (number: number): number =>
  Math.round((number + Number.EPSILON) * 100) / 100;

/** Creates a string list of names from an array of data which overflowa an item
 * */
export const createOverflowText = (arr: string[], overflowAt: number) => {
  let overflow = "";
  for (let i = overflowAt; i < arr.length; i++) {
    overflow += arr[i];
    const isOneBeforeLast = i === arr.length - 2;
    const isAnyBeforeLast = i < arr.length - 1;

    if (arr.length - overflowAt === 2) {
      overflow += isOneBeforeLast ? " and " : "";
    } else {
      if (isAnyBeforeLast) overflow += ", ";
      if (isOneBeforeLast) overflow += "and ";
    }
  }

  return overflow;
};
