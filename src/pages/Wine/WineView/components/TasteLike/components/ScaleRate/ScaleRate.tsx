import { useEffect, useState } from "react";
import { postService } from "../../../../../../UserFeed/service/post.api-service";
import { GET_REVIEW_STRUCTURE } from "../../../../../../UserFeed/store/types";
import { Wine, WineStructure } from "../../../../../models/wine.model";
import { useSelector } from "react-redux";
import { MainState } from "../../../../../../../store/models/store.models";
import { BaseProps } from "../../../../../../../shared/models/base-props";
import React from "react";
import { WineStructureSection } from "./models/wine-structure-sections.model";
import { WINE_STRUCTURE_SECTIONS } from "./constants";
import StringService from "../../../../../../../shared/services/string.service";

interface Props extends BaseProps {
  wine: Wine;
  onSet?: Function;
  isMinimal?: boolean;
}

export function ScaleRate(props: Props) {
  type ObjectKey = keyof WineStructure;
  const sections = WINE_STRUCTURE_SECTIONS;

  const rtl = document.dir === "rtl";
  const [isDragging, setIsDragging] = useState(false);
  const [targetElement, setTargetElement] = useState<any>(null);
  const [isSelfRate, setIsSelfRate] = useState(false);

  const [wineScale, setWineScale] = useState<WineStructure>({});
  const [loadScale, setLoadedScale] = useState<WineStructure>({});

  const user = useSelector((state: MainState) => state.authModule.user);

  const barWidth = 15;
  const slideRange = 100 - barWidth;

  const isManualChange = ((): boolean => {
    if (!wineScale || !loadScale) {
      return false;
    }

    for (const key in wineScale) {
      if (wineScale[key as ObjectKey] !== loadScale[key as ObjectKey]) {
        return true;
      }
    }

    return false;
  })();

  useEffect(() => {
    wineChanged();
  }, [props.wine]);

  useEffect(() => {
    (async () => {
      await userChanged();
    })();
  }, [user]);

  useEffect(() => {
    setWineScale(loadScale ? { ...loadScale } : {});
  }, [loadScale]);

  useEffect(() => {
    if (!isManualChange) {
      return;
    }

    props.onSet?.(wineScale);
  }, [wineScale, loadScale]);

  const wineChanged = () => {
    const data = {
      bold: props.wine?.bold,
      tannic: props.wine?.tannic,
      sweet: props.wine?.sweet,
      acidic: props.wine?.acidic,
    };

    setLoadedScale(data);
    setIsSelfRate(false);
  };

  const userChanged = async () => {
    if (!props.wine._id || !props.onSet || !user) {
      return;
    }

    try {
      const data = await postService[GET_REVIEW_STRUCTURE](props.wine._id);
      setLoadedScale(data);
      setIsSelfRate(!!data);
    } catch (err) {}
  };

  if (!props.wine || !wineScale) {
    return null;
  }

  const BasedOn = ({ wine }: { wine: Wine }) => {
    const content = `The taste profile of ${wine?.winery} ${wine?.name} is based on ${wine?.ratings} user reviews`;
    return !props.isMinimal && wine?.ratings ? (
      <div className="more">
        <h4>Members taste summary</h4>
        <p>{content}</p>
      </div>
    ) : null;
  };

  const startDrag = (ev: any) => {
    if (isDragging || !props.onSet) {
      return;
    }

    setIsDragging(true);
    setTargetElement(ev.target);
  };

  const stopDrag = () => {
    setIsDragging(false);
    setTargetElement(null);
  };

  const setPosition = (ev: any, key: ObjectKey, isTouch = false) => {
    if (!isDragging) return;
    const bondClient = targetElement.parentElement.getBoundingClientRect();
    const thumbClient = targetElement.getBoundingClientRect();
    const scaleWidth = targetElement.parentElement.offsetWidth;
    const x = isTouch ? ev.touches[0].clientX : ev.pageX;

    if (rtl) {
      const currPos = Math.min(x - bondClient.left, scaleWidth);
      setWineScale({
        ...wineScale,
        [key]: Math.min((1 - currPos / scaleWidth) * 100, 100),
      });
      return;
    }

    const scaleMin = bondClient.left;
    const thumbLeft = (x - thumbClient.left) / 2;
    const currPos = Math.min(x + thumbLeft - scaleMin, scaleWidth);
    setWineScale({
      ...wineScale,
      [key]: Math.max((currPos / scaleWidth) * 100, 0),
    });
  };

  return sections.filter(
    (scale: WineStructureSection) => wineScale[scale.max as ObjectKey]
  ).length || props.onSet ? (
    <>
      <div className="structure-details">
        <table onMouseLeave={stopDrag}>
          <tbody>
            {sections.map((scale: WineStructureSection, index: number) => {
              const position = rtl
                ? Math.max(((wineScale[scale.max] || 0) / 100) * slideRange, 0)
                : Math.max(((wineScale[scale.max] || 0) / 100) * slideRange, 0);
              return typeof wineScale[scale.max] === "number" || props.onSet ? (
                <tr
                  key={"SCALE_RATE_" + index}
                  onMouseMove={(ev) => setPosition(ev, scale.max)}
                  onMouseUp={stopDrag}
                  onMouseLeave={stopDrag}
                  onTouchMove={(ev) => setPosition(ev, scale.max, true)}
                  onTouchEnd={stopDrag}
                >
                  <td>{StringService.fromCamelCase(scale.min)}</td>

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

                  <td>{StringService.fromCamelCase(scale.max)}</td>
                </tr>
              ) : null;
            })}
          </tbody>
        </table>

        <BasedOn wine={props.wine} />
      </div>
    </>
  ) : null;
}
