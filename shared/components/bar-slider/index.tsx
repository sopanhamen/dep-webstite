import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useEffect, useState } from 'react';
import { IChartData } from '../charts/custom-chart';

interface IMark {
  value: number;
  label?: string;
  symbol?: string;
}

interface IEndToEndSlider {
  data: IChartData;
  filteredData: (data: IChartData) => void;
}

/**
 *
 * @param data type of  IChartData
 * @returns filteredData with the new values for the chart
 */
// SOURCE: https://mui.com/components/slider/
export default function EndToEndSlider({
  data,
  filteredData,
}: IEndToEndSlider) {
  const [initialValue, setInitialValue] = useState([1, 100]);
  const [maxValue, setMaxValue] = useState(0);
  const [minValue, setMinValue] = useState(0);
  const [marks, setMarks] = useState<IMark[]>([]);

  useEffect(() => {
    let mapValue: number[] = [];

    data.datasets.forEach((e) => mapValue.push(...e.data));

    // sort value highest to lowest
    mapValue.sort((a, b) => b - a);

    // get highest valye
    const highestValue = generateMinMaxString(String(mapValue[0]));

    // get the absolute value
    const absoluteValue = Math.abs(mapValue[mapValue.length - 1]);

    // get lowest value
    const lowestValue = generateMinMaxString(String(absoluteValue));

    // set the new slider value
    setInitialValue([-Math.abs(lowestValue), highestValue]);

    // set marks
    createMarkSlider(highestValue, lowestValue);

    // set up min max
    setMaxValue(highestValue);
    setMinValue(-Math.abs(lowestValue));
  }, [data]);

  const generateMinMaxString = (stringValue: string): number => {
    let highest: string;

    const numberLength: number = stringValue.length;

    if (Number(stringValue.charAt(0)) === 9) {
      highest = `10${generateZeros(numberLength)}`;
    } else {
      highest = `${Number(stringValue.charAt(0)) + 1}${generateZeros(
        numberLength,
      )}`;
    }

    return Number(highest);
  };

  const generateZeros = (length: number): string => {
    let i: number, len: number, zeros: string;

    for (i = 1, len = length, zeros = ''; i < len; i++) {
      zeros += 0;
    }

    return zeros;
  };

  const createMarkSlider = (highest: number, lowest: number) => {
    let dividend = 10;

    let markValues: IMark[] = [];

    if (lowest) {
      const quotientMin = lowest / 5;

      for (let index = 1; index <= 10; index++) {
        const num = quotientMin * index;

        markValues.unshift({
          value: -Math.abs(quotientMin * index),
          label: `-${addLetterSuffix(num)}`,
        });
      }

      dividend = 5;
    }

    for (let index = 0; index <= 10; index++) {
      const quotientMax = highest / dividend;

      const num = quotientMax * index;

      markValues.push({
        value: quotientMax * index,
        label: addLetterSuffix(num),
      });
    }

    setMarks(markValues);
  };

  const addLetterSuffix = (num: number): string => {
    const lookup: IMark[] = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'k' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ];

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

    var item = lookup
      .slice()
      .reverse()
      .find((e: IMark) => num >= e.value);

    return item
      ? (num / item.value).toFixed(1).replace(rx, '$1') + item.symbol
      : '0';
  };

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) return;

    const minDistance = 1000;

    if (activeThumb === 0) {
      setInitialValue([
        Math.min(newValue[0], initialValue[1] - minDistance),
        initialValue[1],
      ]);
    } else {
      setInitialValue([
        initialValue[0],
        Math.max(newValue[1], initialValue[0] + minDistance),
      ]);
    }

    // generate new filtered data
    const newData: IChartData = {
      ...data,
      datasets: data.datasets.map((e) => {
        // filter chart value by the saved data from slider
        const final = e.data
          .filter((x) => predicate(x, newValue[0], 0))
          .filter((x) => predicate(x, newValue[1], 1));

        return { ...e, data: final };
      }),
    };

    // return filtered data
    filteredData(newData);
  };

  var predicate = (
    valueToCheck: number,
    compare: number,
    activeThumb: number,
  ) => {
    return activeThumb === 1 ? valueToCheck < compare : valueToCheck > compare;
  };

  const ariaText = (ariaValue: number) => addLetterSuffix(ariaValue);

  return (
    <Box className="width-90-p">
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        value={initialValue}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={ariaText}
        disableSwap
        marks={marks}
        max={maxValue}
        min={minValue}
      />
    </Box>
  );
}
