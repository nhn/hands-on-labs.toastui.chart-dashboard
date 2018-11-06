import 'tui-chart/dist/tui-chart.css';
import tuiChart from 'tui-chart';

const donutChartData = {
  series: [
    {
      name: 'O',
      data: 234196
    },
    {
      name: 'A',
      data: 292124
    },
    {
      name: 'B',
      data: 230728
    },
    {
      name: 'AB',
      data: 98152
    }
  ]
};

const donutChartOptions = {
  chart: {
    width: 400,
    height: 400,
    title: '혈액형별 수혈 현황',
    format: '1,000'
  },
  series: {
    radiusRange: ['40%', '100%'],
    showLabel: true,
    showLegend: true,
    labelAlign: 'outer'
  },
  legend: {
    visible: true,
    align: 'top'
  }
};

const donutChart = tuiChart.pieChart(document.getElementById('donut-chart'), donutChartData, donutChartOptions);

const barChartData = {
  categories: ['O', 'A', 'B', 'AB'],
  series: [
    {
      name: '남자',
      data: [164350, 207708, 162275, 69444]
    },
    {
      name: '여자',
      data: [69846, 84416, 68453, 28708]
    }
  ]
};

const barChartOptions = {
  chart: {
    width: 700,
    height: 500,
    title: '성별 범례',
    format: '1,000'
  },
  yAxis: {
    title: '혈액형'
  },
  xAxis: {
    title: '수혈자',
    suffix: '명'
  },
  legend: {
    visible: false
  }
};

const barChart = tuiChart.barChart(document.getElementById('bar-chart'), barChartData, barChartOptions);

const lineColumnData = {
  categories: ['남자', '여자', '모두'],
  series: {
    column: [
      {
        name: 'O',
        data: [164350, 69846, 234196]
      },
      {
        name: 'A',
        data: [207708, 84416, 292124]
      },
      {
        name: 'B',
        data: [162275, 68453, 230728]
      },
      {
        name: 'AB',
        data: [69444, 28708, 98152]
      }
    ],
    line: [
      {
        name: 'Average',
        data: [150944, 62855, 213800]
      }
    ]
  }
};

const lineColumnOptions = {
  chart: {
    width: 700,
    height: 500,
    title: '성별로 그룹화한 및 평균값 계산',
    format: '1,000'
  },
  yAxis: {
    title: '혈액형'
  },
  xAxis: {
    title: '수혈자'
  },
  legend: {
    visible: false
  }
};

const lineColumnChart = tuiChart.comboChart(document.getElementById('line-column'), lineColumnData, lineColumnOptions);

donutChart.on('changeCheckedLegends', info => {
  const checkedInfo = info[donutChart.chartType];

  // For barChart
  barChart.setData(reMakeDataForBarChart(barChartData, checkedInfo));

  // For comboChart
  lineColumnChart.setData(reMakeDataForLineColumnChart(lineColumnData, checkedInfo));
});

// 바 차트 가공
function reMakeDataForBarChart(originalData, checkedInfo) {
  const barChartSeriesData = originalData.series;
  const newBarChartSeriesData = barChartSeriesData.map(seriesItem => ({
    name: seriesItem.name,
    data: Array.from(seriesItem.data).filter((value, valueIdx) => checkedInfo[valueIdx])
  }));

  return {
    categories: Array.from(originalData.categories).filter((value, valueIdx) => checkedInfo[valueIdx]),
    series: newBarChartSeriesData
  };
}

// 라인-컬럼 차트 가공
function reMakeDataForLineColumnChart(originalData, checkedInfo) {
  const comboChartSeriesData = originalData.series;

  return {
    categories: originalData.categories,
    series: {
      column: reMakeDataForColumnChart(comboChartSeriesData.column, checkedInfo),
      line: reMakeDataForLineChart(comboChartSeriesData.line, comboChartSeriesData.column, checkedInfo)
    }
  };
}

// 컬럼차트 가공
function reMakeDataForColumnChart(originalData, checkedInfo) {
  return originalData.map((seriesItem, idx) => (
    Object.assign({}, seriesItem, {visible: checkedInfo[idx]})
  ));
}

// 라인차트 가공
function reMakeDataForLineChart(lineChartSeriesData, columnChartSeriesData, checkedInfo) {
  const makeTotalAverage = () => (
    columnChartSeriesData.reduce((accumulator, seriesItem, idx) => {
      if (checkedInfo[idx]) {
        accumulator.forEach((accValue, accIdx) => {
          accumulator[accIdx] += seriesItem.data[accIdx];
        });
      }

      return accumulator;
    }, [0, 0, 0]).map(totalValue => totalValue / (checkedInfo.filter(checkInfo => checkInfo).length))
  );

  return lineChartSeriesData.map(seriesItem => ({
    name: seriesItem.name,
    data: makeTotalAverage()
  }));
}