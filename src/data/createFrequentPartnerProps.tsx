import { DetailItemProps } from "../components/DetailItem";

const { React } = window.PluginApi;

/** Get the performer's most frequest scene partner based on scenes in the
 * user's library. Returns a string formatted as "Name (count)" */
const createFrequentPartnerProps: FnCreateFrequentPartnerProps = (
  { performerID, scenes, gender },
  collapsed
) => {
  // Create an array of performer data from all scenes
  const partners: {
    count: number;
    gender: Performer["gender"];
    id: Performer["id"];
    name: Performer["name"];
  }[] = [];

  // Check each scene
  scenes.forEach((sc) => {
    // Check each performer in the scene
    sc.performers.forEach((pf) => {
      // Check this is not the featured performer
      if (pf.id !== performerID) {
        // Check if the performer already exists in the array
        const perfomersIndex = partners.findIndex((ptnr) => ptnr.id === pf.id);

        if (perfomersIndex !== -1) {
          // Increase the performer count
          partners[perfomersIndex].count++;
        } else {
          // Add the performer to the array
          partners.push({
            id: pf.id,
            count: 1,
            gender: pf.gender,
            name: pf.name,
          });
        }
      }
    });
  });

  // Sort count from highest to lowest
  partners.sort((a, b) => b.count - a.count);

  const scenesText = (count: number) =>
    count + " " + (count === 1 ? "scene" : "scenes");

  if (!gender) {
    // Return the performer with the highest overall count.
    return partners.length
      ? {
          id: "frequent-partner",
          collapsed,
          title: "Most Frequent Partner",
          value: (
            <>
              {partners[0].name}
              <span className="additional-data scene-count">
                {scenesText(partners[0].count)}
              </span>
            </>
          ),
          wide: true,
        }
      : null;
  } else {
    // Else return the performer with the highest overall count of the
    // required gender.
    const genderedPartner = partners.find((ptnr) => ptnr.gender === gender);
    const genderWord =
      gender.substring(0, 1) + gender.substring(1).toLowerCase();
    return genderedPartner
      ? {
          id: "frequent-partner",
          collapsed,
          title: `Most Frequent ${genderWord} Partner`,
          value: (
            <>
              {genderedPartner.name}
              <span className="additional-data scene-count">
                {scenesText(genderedPartner.count)}
              </span>
            </>
          ),
          wide: true,
        }
      : null;
  }
};

export default createFrequentPartnerProps;

interface IcreateFrequentPartner {
  performerID: Performer["id"];
  scenes: Scene[];
  gender?: Performer["gender"];
}

type FnCreateFrequentPartnerProps = (
  args: IcreateFrequentPartner,
  /** Identifies whether the PerformerDetailsPanel is currently collapsed. */
  collapsed: boolean
) => DetailItemProps | null;
