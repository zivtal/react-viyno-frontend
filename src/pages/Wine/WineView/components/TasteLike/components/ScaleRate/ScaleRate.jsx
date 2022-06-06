import sections from "../../../../../../../assets/json/scale-sections.json";
import { useEffect, useRef, useState } from "react";
import { postService } from "../../../../../../UserFeed/service/post.api-service";
import { camelCaseToSentence } from "../../../../../../../services/dev.service";
import { GET_REVIEW_STRUCTURE } from "../../../../../../UserFeed/store/types";
import { Wine } from "../../../../../models/wine.models";
import { useSelector } from "react-redux";
import { MainState } from "../../../../../../../store/models/store.models";

interface Props {
  wine: Wine;
  onSet?: Function;
  isMinimal?: boolean;
}

export function ScaleRate({ wine, onSet, isMinimal = false }: Props) {
  const rtl = document.dir === "rtl";
  const isManualChange = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [targetElement, setTargetElement] = useState(null);
  const [wineScale, setScale] = useState();
  const [loadScale, setLoadedScale] = useState({});
  const [isSelfRate, setIsSelfRate] = useState({});

  const user = useSelector((state: MainState) => state.authModule.user);

  const barWidth = 15;
  const slideRange = 100 - barWidth;

  useEffect(() => {
    (async () => {
      wineChanged();
      await userChanged();
    })();
  }, [wine]);

  useEffect(() => {
    isManualChange.current = false;
    setScale(loadScale ? { ...loadScale } : null);
  }, [loadScale]);

  useEffect(() => {
    if (!wineScale) return;
    if (!isManualChange.current) {
      isManualChange.current = true;
      return;
    }

    onSet?.(wineScale);
  }, [wineScale]);

  const wineChanged = () => {
    const data = {
      bold: wine?.bold,
      tannic: wine?.tannic,
      sweet: wine?.sweet,
      acidic: wine?.acidic,
    };

    setLoadedScale(data);
    setIsSelfRate(false);
  };

  const userChanged = async () => {
    if (onSet && user) {
      try {
        const data = await postService[GET_REVIEW_STRUCTURE](wine._id);
        setLoadedScale(data);
        setIsSelfRate(!!data);
      } catch (err) {}
      return;
    }

    wineChanged();
  };

  if (!wine || !wineScale) {
    return null;
  }

  const BasedOn = ({ wine }) => {
    const content = `The taste profile of ${wine?.winery} ${wine?.name} is based on ${wine?.ratings} user reviews`;
    return !isMinimal && wine?.ratings ? (
      <div className="more">
        <h4>Members taste summary</h4>
        <p>{content}</p>
      </div>
    ) : null;
  };

  const startDrag = ({ target }) => {
    if (isDragging || !onSet) {
      return;
    }

    setIsDragging(true);
    setTargetElement(target);
  };

  const stopDrag = () => {
    setIsDragging(false);
    setTargetElement(null);
  };

  const setPosition = (ev, scale, isTouch = false) => {
    if (!isDragging) return;
    const bondClient = targetElement.parentElement.getBoundingClientRect();
    const thumbClient = targetElement.getBoundingClientRect();
    const scaleWidth = targetElement.parentElement.offsetWidth;
    const x = isTouch ? ev.touches[0].clientX : ev.pageX;

    if (rtl) {
      const currPos = Math.min(x - bondClient.left, scaleWidth);
      setScale({
        ...wineScale,
        [scale]: Math.min((1 - currPos / scaleWidth) * 100, 100),
      });
      return;
    }

    const scaleMin = bondClient.left;
    const thumbLeft = (x - thumbClient.left) / 2;
    const currPos = Math.min(x + thumbLeft - scaleMin, scaleWidth);
    setScale({
      ...wineScale,
      [scale]: Math.max((currPos / scaleWidth) * 100, 0),
    });
  };

  return sections.filter((scale) => wineScale[scale.max]).length || onSet ? (
    <>
      <div className="structure-details">
        <table onMouseLeave={stopDrag}>
          <tbody>
            {sections.map((scale, index) => {
              const position = rtl
                ? Math.max((wineScale[scale.max] / 100) * slideRange, 0)
                : Math.max((wineScale[scale.max] / 100) * slideRange, 0);
              return typeof wineScale[scale.max] === "number" || onSet ? (
                <tr
                  key={"SCALE_RATE_" + index}
                  onMouseMove={(ev) => setPosition(ev, scale.max)}
                  onMouseUp={stopDrag}
                  onMouseLeave={stopDrag}
                  onTouchMove={(ev) => setPosition(ev, scale.max, true)}
                  onTouchEnd={stopDrag}
                >
                  <td>{camelCaseToSentence(scale.min)}</td>

                  <td className="scale-container">
                    <div className="scale">
                      <div
                        className={`thumb ${isSelfRate ? "self" : ""} ${
                          typeof wineScale[scale.max] !== "number"
                            ? "unrated"
                            : ""
                        }`}
                        style={{
                          [rtl ? "right" : "left"]: position + "%",
                          width: barWidth + "%",
                        }}
                        onMouseDown={startDrag}
                        onTouchStart={startDrag}
                      ></div>
                    </div>
                  </td>

                  <td>{camelCaseToSentence(scale.max)}</td>
                </tr>
              ) : null;
            })}
          </tbody>
        </table>

        <BasedOn wine={wine} />
      </div>
    </>
  ) : null;
}
