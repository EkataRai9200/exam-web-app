import * as React from "react";

export interface IVehicle {
  vehicleId: string;
  make: string;
  model: string;
  trimLevel: string;
  features?: IFeature[];
}

export interface IFeature {
  featureId: string;
  featureType: string;
  featureName: string;
}

export interface ExamDetails {
  _id: string;
}

export interface IAppState {
  vehicles: IVehicle[];
  selectedVehicles: IVehicle[];
  features: IFeature[];
  examDetails: ExamDetails[];
}

export const initialState: IAppState = {
  vehicles: [
    {
      vehicleId: "710036",
      make: "Subaru",
      model: "BRZ",
      trimLevel: "2.0L SE LUX Auto 2017",
    },
    {
      vehicleId: "710037",
      make: "Subaru",
      model: "BRZ",
      trimLevel: "1.6L SE LUX Auto 2018",
    },
    {
      vehicleId: "710038",
      make: "Subaru",
      model: "BRZ",
      trimLevel: "1.6L SE Manual 2018",
    },
  ],
  selectedVehicles: [],
  features: [],
  examDetails: [],
};

export interface IAppContext {
  state: IAppState;
  dispatch: React.Dispatch<IAction>;
}

const AppContext = React.createContext<IAppContext>({
  state: initialState,
  dispatch: () => {},
});

export enum ActionType {
  FETCH_VEHICLES = "FETCH_VEHICLES",
  SELECT_ALL = "SELECT_ALL",
  SELECT_NONE = "SELECT_NONE",
  ADD_VEHICLE = "ADD_VEHICLE",
  REMOVE_VEHICLE = "REMOVE_VEHICLE",
  SELECT_LAST_VEHICLE = "SELECT_LAST_VEHICLE",
}

export type IAction = {
  type: ActionType;
  vehicle: IVehicle;
  feature: IFeature;
};

/**
 * Reducer function should simply digest the action payload and return a new state object
 */
const vehicleReducer = (
  state: IAppState,
  action: IAction
): typeof initialState => {
  console.log(`vehicleReducer called: ${action.type}`);

  const selectedVehicle = action.vehicle;

  switch (action.type) {
    case "FETCH_VEHICLES": {
      return {
        ...state,
        vehicles: [...initialState.vehicles],
      };
    }
    case "ADD_VEHICLE": {
      if (selectedVehicle) {
        return {
          ...state,
          selectedVehicles: [
            ...state.selectedVehicles.filter(
              (v) => v.vehicleId !== selectedVehicle.vehicleId
            ),
            selectedVehicle,
          ],
        };
      }
      return {
        ...state,
      };
    }
    case "REMOVE_VEHICLE": {
      if (selectedVehicle) {
        return {
          ...state,
          selectedVehicles:
            selectedVehicle &&
            state.selectedVehicles.filter(
              (v) => v.vehicleId !== selectedVehicle.vehicleId
            ),
        };
      }
      return {
        ...state,
      };
    }
    case "SELECT_ALL": {
      return {
        ...state,
        selectedVehicles: [...state.vehicles],
      };
    }
    case "SELECT_NONE": {
      return {
        ...state,
        selectedVehicles: [],
      };
    }
    case ActionType.SELECT_LAST_VEHICLE.toString(): {
      return {
        ...state,
        selectedVehicles: [state.vehicles.pop()!],
      };
    }
    default:
      throw new Error();
  }
};

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(
    vehicleReducer,
    initialState as IAppState
  );
  const value = { state, dispatch };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
