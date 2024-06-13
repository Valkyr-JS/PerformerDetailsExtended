import type { DetailItemProps } from "../components/DetailItem";

/** Get the performer's career length based on scenes in the user's library.
 * Returns a string formatted as "YYYY - YYYY" or "YYYY". */
const getLibraryCareerSpan = (
  oldestScene: StashGQLScene,
  newestScene: StashGQLScene,
  isCollapsed: boolean
): DetailItemProps => {
  const years = {
    oldest: oldestScene.date.split("-")[0],
    newest: newestScene.date.split("-")[0],
  };

  /**
   * TODO - Currently returns a string value. Could be repurposed to return
   * scene data so that the oldest and latest scenes can be clicked through
   * to.
   *
   * Returns YYYY - YYYY, unless the years are the same in which case it
   * returns just YYYY.
   */

  const props = {
    id: "library-career",
    isCollapsed,
    title: "Library Career Span",
    value:
      years.oldest === years.newest
        ? years.oldest
        : `${years.oldest} - ${years.newest}`,
  };

  return props;
};

export default getLibraryCareerSpan;
