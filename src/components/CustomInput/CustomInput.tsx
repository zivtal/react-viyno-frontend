import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { Suggestions } from "./components/Suggestions/Suggestions";
import { Loader } from "../Loader/Loader";
import { tryRequire } from "../../services/require.service";
import { CloseButton } from "../CloseButton/CloseButton";
import useDebounce from "../../shared/hooks/useDebounce";
import { Dropdown } from "./components/Dropdown/Dropdown";
import "./CustomInput.scss";
import { Icon } from "../Icon/Icon";

export enum CustomInputType {
  SUGGESTIONS = "SUGGESTIONS",
  DROPDOWN = "DROPDOWN",
}

export interface CustomInputDropdown {
  text: string;
  value: any;
}

export interface CustomInputResults extends CustomInputDropdown {
  image?: string;
  imageData?: string;
  imageType?: string;
}

interface CustomInputProps {
  type: CustomInputType;
  debounce?: boolean;
  clearable?: boolean;
  items?: Array<CustomInputResults> | Array<CustomInputDropdown>;
  loading?: boolean;
  iconName?: string;
  onInput(value?: string): void;
  onSelect?(value: any): void;
}

export function CustomInput(props: CustomInputProps): JSX.Element {
  const elSearch = useRef(null);
  const elInput = useRef(null);

  const [isDropdownActive, setIsDropdownActive] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [resSelect, setResSelect] = useState<number | null>(null);
  const debounceValue = useDebounce<string>(value, 1000);

  const data = props.items;

  useEffect(() => {
    props.onInput(value);
  }, [debounceValue]);

  const cleanUp = (ev?: any) => {
    setValue("");
    props.onInput();

    if (!ev) {
      return;
    }

    ev.target.value = "";
  };

  const searchInput = (ev: any) => {
    setValue(ev.target.value);

    if (!ev.target.value) {
      cleanUp();
      return;
    }
  };

  const handleKey = (ev: any) => {
    const { key } = ev;

    if (!data || !isDropdownActive) {
      return;
    }

    if (key === "Enter" && resSelect !== null) {
      props.onSelect?.(data[resSelect].value);
      cleanUp(ev);
      return;
    }

    if (resSelect === null || !data?.length) {
      return;
    }

    switch (key) {
      case "ArrowDown":
        ev.preventDefault();
        setResSelect(resSelect < data.length - 1 ? resSelect + 1 : 0);
        break;
      case "ArrowUp":
        ev.preventDefault();
        setResSelect(!resSelect ? data.length - 1 : resSelect - 1);
        break;
    }
  };

  const onSelect = (value: any) => {
    if (!isDropdownActive) {
      return;
    }

    props.onSelect?.(value);
    cleanUp();
  };

  useEffect(() => {
    if (!data) {
      setIsDropdownActive(false);
      return;
    }

    setResSelect(data.length ? 0 : null);

    if (props.type === CustomInputType.SUGGESTIONS) {
      setIsDropdownActive(true);
    }
  }, [data]);

  return (
    <>
      <div
        ref={elSearch}
        className="custom-input__field"
        style={value && data ? { zIndex: 100 } : {}}
      >
        {props.iconName ? (
          <div className="custom-input__icon">
            <img
              src={tryRequire(`imgs/icons/${props.iconName}.svg`)}
              alt="Search"
            />
          </div>
        ) : null}

        <div className="custom-input__text-input">
          <input
            ref={elInput}
            style={{ padding: props.iconName ? `4px 0` : `4px 12px` }}
            placeholder="Search any wine"
            onKeyDown={handleKey}
            onInput={searchInput}
            onFocus={searchInput}
            spellCheck="false"
            value={value}
          ></input>
        </div>

        {value && !props.loading ? (
          <div className="custom-input__clear">
            <CloseButton
              size={10}
              onClick={() => setValue("")}
              color="black"
            ></CloseButton>
          </div>
        ) : null}

        {props.type === CustomInputType.DROPDOWN && props.items?.length ? (
          <div
            className={`custom-input__dropdown ${
              isDropdownActive
                ? "custom-input__dropdown-close"
                : "custom-input__dropdown-open"
            }`}
          >
            <Icon
              name="prev"
              size={11}
              onClick={() => setIsDropdownActive(!isDropdownActive)}
            />
          </div>
        ) : null}

        {props.loading ? (
          <div className="custom-input__loading">
            <Loader
              className="custom-input__loading"
              type="spinner-1"
              size={16}
            ></Loader>
          </div>
        ) : null}
      </div>

      {value ? (
        <div className="background-dimm" onClick={cleanUp}>
          {props.type === CustomInputType.SUGGESTIONS &&
          isDropdownActive &&
          (data || []).length ? (
            <Suggestions
              results={data}
              value={value}
              onClose={cleanUp}
              selected={resSelect}
              loading={props.loading || false}
              el={elSearch.current}
              onSelect={onSelect}
              onChangeSelect={setResSelect}
            />
          ) : null}

          {props.type === CustomInputType.DROPDOWN &&
          isDropdownActive &&
          (data || []).length ? (
            <Dropdown
              el={elSearch.current}
              items={props.items}
              value={value}
              selected={resSelect}
              onClose={cleanUp}
              onSelect={onSelect}
              onChangeSelect={setResSelect}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}
