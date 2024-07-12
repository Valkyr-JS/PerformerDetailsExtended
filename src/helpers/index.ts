/** Create a link to a given partner's page, filtering scenes to only include
 * both performers. */
export const linkToPartnerProfile = (
  performer: Performer,
  targetID: Performer["id"]
) =>
  `/performers/${targetID}/scenes?c=("type":"performers","value":("items":%5B("id":"${
    performer.id
  }","label":"${encodeURIComponent(
    performer.name
  )}")%5D,"excluded":%5B%5D),"modifier":"INCLUDES")`;

/** Create a link to a given studio's page, filtering scenes to only include
 * this performer. */
export const linkToStudioProfile = (
  performer: Performer,
  studioID: Studio["id"]
) =>
  `/studios/${studioID}/scenes?c=("type":"performers","value":("items":%5B("id":"${
    performer.id
  }","label":"${encodeURIComponent(
    performer.name
  )}")%5D,"excluded":%5B%5D),"modifier":"INCLUDES")`;

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

/** Returns a boolean identifying whether a given tag is a descendant of another
 * tag. */
export const tagIsDescendantOf = (
  allTagData: FindTagsResultType,
  tagName?: string,
  ancestorName?: string
): boolean => {
  /**
   * ! Ideally this needs refactoring if/when more tag data becomes available in
   * the `findScenes` query. That query doesn't return full tag data, so only
   * basic parent data is returned. In order for this to work, the full data for
   * the specific tag needs to be taken from a `findTags` query. This works for
   * now but could be quite slow and intensive.
   */

  const tag = allTagData.tags.find((tg) => tg.name === tagName);
  const ancestor = allTagData.tags.find((tg) => tg.name === ancestorName);

  // Only run check if data for both tags is available
  if (tag && ancestor) {
    // If the tag has no parents, it's not a descendant
    if (tag.parent_count === 0) return false;

    // Loop through each parent tag
    for (const parent of tag.parents) {
      if (parent.id === ancestor.id) return true;
      else
        return tagIsDescendantOf(
          allTagData,
          allTagData.tags.find((tg) => tg.name === parent.name)?.name,
          allTagData.tags.find((tg) => tg.name === ancestor.name)?.name
        );
    }
  }

  return false;
};
