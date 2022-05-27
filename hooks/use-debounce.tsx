import { ISharedCommonQueries } from '@shared/interfaces';
import { APIServices } from '@shared/services/api.service';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

function useDebounce(
  cb: (debounceDependencies: ISharedCommonQueries) => void,
  dependencies: any,
  duration: number = 1000,
) {
  const ac = new AbortController();
  const firstRender = useRef(false);

  const [debounceChanged, setDebounceChanged] = useState({});

  //   functions section
  const debounceDependencies = _.debounce(setDebounceChanged, duration);
  const setDebounceDependencies = useCallback((dep) => {
    debounceDependencies(dep);
  }, []);

  // hooks section
  useEffect(() => {
    if (!firstRender?.current) {
      firstRender.current = true;
      return;
    }
    cb(debounceChanged);
    return () => {
      ac.abort();
      APIServices.axiosCancelToken();
    };
  }, [debounceChanged]);

  useEffect(() => {
    setDebounceDependencies(dependencies);
    return () => {
      ac.abort();
      APIServices.axiosCancelToken();
    };
  }, [JSON.stringify(dependencies)]);

  return;
}

export default useDebounce;
