import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-1RSRE352DM"); // Replace with your Measurement ID
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
