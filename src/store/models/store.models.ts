import { WineState } from "../../pages/Wine/models/wine.model";
import { PostState } from "../../pages/UserFeed/store/reducer";
import { AuthState } from "../../pages/Login/store/reducer";
import { WineryState } from "../../pages/Winery/store/reducer";

export interface MainState {
  wineryModule: WineryState;
  wineModule: WineState;
  authModule: AuthState;
  postModule: PostState;
}
