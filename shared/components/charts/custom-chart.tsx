import { EChartType } from '@shared/enum';
import { Dataset } from '@shared/models/common.model';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useState } from 'react';
import { Bar, Doughnut, Line, Pie, Scatter } from 'react-chartjs-2';
import EndToEndSlider from '../bar-slider';

ChartJS.register(
  CategoryScale,
  LinearScale,
  //  Bar
  BarElement,
  CategoryScale,
  // Line
  PointElement,
  LineElement,
  //Pie chart
  ArcElement,

  Title,
  Tooltip,
  Legend,
);

export interface IChartData {
  labels: string[];
  datasets: Dataset[];
}

interface ICustomChart {
  chartType: EChartType;
  currentData: IChartData;
  title: string;
  withSlider?: boolean;
}
/**
 *
 * @param chartType type of EChartType
 * @param currentData type of IChartData
 * @param title title of the chart
 * @display Chart type with the values
 *
 *  NOTE: Scattter has a different kind of dataset to be displayed, It needs an X and Y axis
 */
function CustomChart({
  chartType,
  currentData,
  title,
  withSlider,
}: Required<ICustomChart>): JSX.Element {
  const [displayData, setDisplayData] = useState<IChartData>(currentData);

  const options = {
    responsive: true,
    options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } },
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: title },
    },
  };

  const renderChartType = () => {
    switch (chartType) {
      case EChartType.BAR:
        return <Bar options={options} data={displayData} />;
      case EChartType.LINE:
        return <Line options={options} data={displayData} />;
      case EChartType.PIE:
        return <Pie data={displayData} />;
      case EChartType.DOUGHNUT:
        return <Doughnut data={displayData} />;
      case EChartType.SCATTER:
        // if the NOTE is not followed, this chart will not show
        return <Scatter options={options} data={currentData} />;
      default:
        return <Bar options={options} data={displayData} />;
    }
  };

  return (
    <div className="center flex-column">
      {renderChartType()}

      {withSlider && (
        <EndToEndSlider
          data={currentData}
          filteredData={(x: IChartData) => setDisplayData(x)}
        />
      )}
    </div>
  );
}

export default CustomChart;
