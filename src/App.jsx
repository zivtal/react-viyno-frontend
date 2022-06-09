import "reflect-metadata";
import { lazy, useEffect } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { wineService } from "./pages/Wine/service/wine.service";
import { setWinesKeywords } from "./pages/Wine/store/action";
import "./styles/global.scss";

import { AppHeader } from "./components/AppHeader/AppHeader";
import { UserFeed } from "./pages/UserFeed/UserFeed";
import { Login } from "./pages/Login/Login";
import { WineView } from "./pages/Wine/WineView/WineView";
import { WineSearch } from "./pages/Wine/WineSearch/WineSearch";
import { WineEdit } from "./pages/Wine/WineEdit/WineEdit";
import { WineryView } from "./pages/Winery/WineryView/WineryView";
import { WinerySearch } from "./pages/Winery/WinerySearch/WinerySearch";
import { MainState } from "./store/models/store.models";
import { GET_WINE_KEYWORDS } from "./pages/Wine/store/types";

// const WinePage = lazy(() =>
//     import(/* webpackChunkName: wine */ './pages/Wine/WineView/WineView')
//         .then(module => ({ default: module.WinePage }))
// );

export function App() {
  const user = useSelector((state: MainState) => state.authModule.user);
  const keywords = useSelector((state: MainState) => state.wineModule.keywords);
  const dispatch = useDispatch();
  // document.dir = "rtl";

  useEffect(() => {
    (async () => {
      if (keywords) return;
      try {
        const res = await wineService[GET_WINE_KEYWORDS]();
        dispatch(setWinesKeywords(res));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [keywords]);

  const AuthRoute = (props) => {
    return props.user ? <Route {...props} /> : <Redirect to="/" />;
  };

  return (
    <Router>
      <div className="App">
        <AppHeader />
        <div className="content">
          <Switch>
            {/* <Route exact path="/Wine/add">
              {user ? <WineEditPage /> : <Redirect to="/wine" />}
            </Route>
            <Route exact path="/Wine/WineEdit/:id">
              {user ? <WineEditPage /> : <Redirect to="/wine" />}
            </Route> */}
            <AuthRoute user={user} component={WineEdit} path="/wine/add" />
            <AuthRoute user={user} component={WineEdit} path="/wine/edit/:id" />
            <Route component={WineView} exact path="/wine/:id" />
            <Route component={WineSearch} exact path="/wine" />
            <Route component={WineryView} exact path="/winery/:id" />
            <Route component={WinerySearch} exact path="/winery" />
            <Route component={Login} path="/login" />
            <Route component={UserFeed} path="/" />
          </Switch>
        </div>
      </div>
    </Router>
  );
}
