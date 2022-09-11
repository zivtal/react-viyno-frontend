import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WineryHeader } from './components/WineryHeader/WineryHeader';
import { Wines } from './components/Wines/Wines';
// @ts-ignore
import { getWinery } from '../store/action';
import { Winery } from '../models/winery.model';
import { MainState } from '../../../store/models/store.models';
import { RouteComponentProps } from 'react-router-dom';
import { BaseProps } from '../../../shared/interfaces/base-props';
import { WINERIES_CACHE } from '../store/types';
import './WineryView.scss';
import LocationService from '../../../shared/services/location.service';

interface MatchParams {
  id: string;
}

export const WineryView = (props: BaseProps & RouteComponentProps<MatchParams>): JSX.Element | null => {
  const dispatch = useDispatch();
  const [winesCount, setWinesCount] = useState<number>();
  const wineries = useSelector((state: MainState) => state.wineryModule[WINERIES_CACHE]);

  useEffect(() => {
    const id = props.match.params.id;
    (async () => {
      try {
        const location = await LocationService.current();
        dispatch(getWinery(id, { ...location }));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [props.match?.params?.id]);

  const winery = wineries.find((winery: Winery) => winery.seo === props.match?.params?.id);

  return winery ? (
    <>
      <WineryHeader winery={winery} winesCount={winesCount} />
      <Wines winery={winery} setWinesCount={setWinesCount} />
    </>
  ) : null;
};
