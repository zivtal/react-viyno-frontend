import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { wineService } from "../service/wine.service";
import { HiddenInput } from "../../../components/HiddenInput/HiddenInput";
import { EditMultiSelect } from "./components/EditMultiSelect/EditMultiSelect";
import { ScaleRate } from "../WineView/components/TasteLike/components/ScaleRate/ScaleRate";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { tryRequire } from "../../../shared/helpers/require";
import "./WineEdit.scss";
import { MainState } from "../../../store/models/store.models";
import { ADD_WINE, GET_WINE_KEYWORDS, WINE_SECTIONS } from "../store/types";
import { WineSections } from "../models/wine.model";
import { imageUpload } from "../../../shared/services/image-upload.service";
import ImageService from "../../../shared/services/image.service";
import StringService from "../../../shared/services/string.service";

export const WineEdit = (props) => {
  const location = useLocation();
  const [database, setDatabase] = useState({});
  const queries = new URLSearchParams(location.search);
  const sections: WineSections = useSelector(
    (state: MainState) => state.wineModule[WINE_SECTIONS]
  );

  const img = useRef(null);
  const history = useHistory();
  const [edit, setEdit] = useState({
    name: queries.get("name") || "",
    winery: queries.get("winery") || "",
    country: queries.get("country") || "",
    region: queries.get("region") || "",
    type: queries.get("type") || null,
    style: queries.get("style") || "",
    grapes: queries.get("grapes") || "",
    pairings: queries.get("pairings") || "",
    imageSmall: null,
    imageLarge: null,
    imageType: null,
    bold: null,
    tannic: null,
    sweet: null,
    acidic: null,
    alcohol: null,
  });

  useEffect(() => setDatabase(sections), [sections]);

  useEffect(() => {
    const seo = database.style?.find((style) => style.seo === edit.style)?.seo;
    if (seo) {
      (async () => {
        try {
          const style = await wineService[GET_WINE_KEYWORDS]({
            section: "style",
            seo,
          });
          if (style) {
            setEdit({
              ...edit,
              country: style[0].country,
              grapes: style[0].grapes,
              pairings: style[0].pairings,
              type: style[0].type,
              bold: style[0].body,
              acidic: style[0].acidity,
            });
          }
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [edit.style]);

  useEffect(() => {
    const _compare = (
      { country: c1, region: r1 },
      { country: c2, region: r2 }
    ) => {
      return !((c1 && c2 && c1 !== c2) || (r1 && r2 && r1 !== r2));
    };
    setDatabase({
      ...database,
      winery: sections?.winery.filter((winery) => _compare(winery, edit)),
      style: sections?.style.filter((style) => _compare(style, edit)),
      region: sections?.region.filter((region) => _compare(region, edit)),
    });
  }, [edit]);

  const upload = async (ev) => {
    const image = await imageUpload(ev.target.files[0], [800, 300]);
    setEdit({
      ...edit,
      imageLarge: image.data[0],
      imageSmall: image.data[1],
      imageType: image.extension,
    });

    img.current.src = ImageService.fromBase64(image.data[1], image.extension);
  };

  const onSubmit = async () => {
    const res = await wineService[ADD_WINE](edit);
    history.push(
      `/wine/${StringService.toKebabCase(`${res?.winery} ${res?.name}`)}`
    );
  };

  const BOTTLE_IMAGE = tryRequire("imgs/bottle.png");

  return edit ? (
    <>
      <form className="wine-edit__header full">
        <div className="information fit-media">
          <div className="picture">
            <label>
              <input type="file" onChange={upload} accept="image/*" hidden />

              <img
                ref={img}
                src={
                  ImageService.fromBase64(
                    edit.base64ImageLarge,
                    edit.imageType
                  ) || BOTTLE_IMAGE
                }
              />
              {!edit.base64ImageLarge ? <span>UPLOAD IMAGE</span> : null}
            </label>
          </div>

          <div className="wine-content">
            <HiddenInput
              className="winery"
              data={edit}
              database={database["winery"]}
              input="winery"
              set={(value, input) => setEdit({ ...edit, [input]: value })}
              placeholder="winery name"
            />

            <HiddenInput
              data={edit}
              input="name"
              set={(value, input) => setEdit({ ...edit, [input]: value })}
              placeholder="wine name"
              duplicate={false}
            />

            <HiddenInput
              data={edit}
              database={database["country"]}
              input="country"
              set={(value, input) => setEdit({ ...edit, [input]: value })}
              placeholder="country"
              duplicate={true}
            />

            <HiddenInput
              data={edit}
              database={database["region"]}
              input="region"
              set={(value, input) => setEdit({ ...edit, [input]: value })}
              placeholder="region"
              duplicate={true}
            />

            <HiddenInput
              data={edit}
              database={database["style"]}
              input="style"
              set={(value, input) => setEdit({ ...edit, [input]: value })}
              // database={styles}
              placeholder="wine style"
              duplicate={true}
            />

            <EditMultiSelect
              data={edit}
              input="grapes"
              set={(value, input) => setEdit({ ...edit, [input]: value })}
              placeholder="Select grapes"
            />

            <EditMultiSelect
              data={edit}
              input="pairings"
              set={(value, input) => setEdit({ ...edit, [input]: value })}
              placeholder="Select food pairings"
            />
          </div>
        </div>
      </form>

      <ScaleRate wine={edit} set={(scale) => setEdit({ ...edit, ...scale })} />

      <div className="wine-edit__controls">
        <button onClick={onSubmit}>Save</button>
      </div>
    </>
  ) : null;
};
