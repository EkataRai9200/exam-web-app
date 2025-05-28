import ReactGA from "react-ga4";
import { REACTGA_MID } from "./configAnalytics";

export const initGA = () => {
  ReactGA.initialize(REACTGA_MID); // Replace with your Measurement ID
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
