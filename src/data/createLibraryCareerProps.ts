/** Get the performer's career length based on scenes in the user's library.
 * Returns a string formatted as "YYYY - YYYY" or "YYYY". */
const createLibraryCareerSpan: createItemProps<IcreateLibraryCareerSpan> = (
  { oldestScene, newestScene },
  collapsed
) => {
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
    collapsed,
    id: "library-career",
    title: "Library Career Span",
    value:
      years.oldest === years.newest
        ? years.oldest
        : `${years.oldest} - ${years.newest}`,
    wide: false,
  };

  return props;
};

export default createLibraryCareerSpan;

interface IcreateLibraryCareerSpan {
  oldestScene: StashGQLScene;
  newestScene: StashGQLScene;
}
