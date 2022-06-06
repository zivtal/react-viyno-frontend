import { WineState } from "../../pages/Wine/models/wine.models";
import { PostState } from "../../pages/UserFeed/store/reducer";
import { AuthState } from "../../pages/Login/store/reducer";

export interface MainState {
  wineModule: WineState;
  authModule: AuthState;
  postModule: PostState;
}
