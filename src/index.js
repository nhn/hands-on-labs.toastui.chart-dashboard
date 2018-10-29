import './index.html';
import '../node_modules/tui-chart/dist/tui-chart.css';
import tuiChart from 'tui-chart';


/**
 * Donut Chart
 */
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
    title: '혈액형별 범례',
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
  },
};

const donutChart = tuiChart.pieChart(document.getElementById('donut-chart'), donutChartData, donutChartOptions);


/**
 * Bar Chart
 */
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
    title: '혈액형',
    min: 0
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


/**
 * Combo Chart
 */
const lineColumnData = {
  categories: ['남자', '여자' , '모두'],
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
      },
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
    width: 1000,
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
  },
};


const lineColumn = tuiChart.comboChart(document.getElementById('line-column'), lineColumnData, lineColumnOptions);


donutChart.on('changeCheckedLegends', info => {
  const checkedInfo = info[donutChart.chartType];

  // Excute Set Data
  barChart.setData(reMakeDataForBarChart(barChartData, checkedInfo));
  lineColumn.setData(reMakeDataForComboChart(lineColumnData, checkedInfo));
});


// DATA 가공 함수 구현

// 바 차트
function reMakeDataForBarChart(barChartData, checkedInfo) {
  const barChartSeriesData = barChartData.series;
  const newBarChartSeriesData = barChartSeriesData.map((seriesItem, idx) => ({
    name: seriesItem.name,
    data: Array.from(seriesItem.data).filter((value, valueIdx) => checkedInfo[valueIdx])
  }));

  return {
    categories: Array.from(barChartData.categories).filter((value, valueIdx) => checkedInfo[valueIdx]),
    series: newBarChartSeriesData,
  };
}

// 콤보차트 차트 (컬럼차트, 라인차트)
function reMakeDataForComboChart(lineColumnData, checkedInfo) {
  const lineColumnChartSeriesData = lineColumnData.series;
  const columnChartSeriesData = lineColumnChartSeriesData['column'];
  const lineChartSeriesData = lineColumnChartSeriesData['line'];

  return {
    categories: lineColumnData.categories,
    series: {
      column: reMakeDataForColumnChart(columnChartSeriesData, checkedInfo),
      line: reMakeDataForLineChart(lineChartSeriesData, columnChartSeriesData, checkedInfo)
    }
  };
}

// 컬럼차트
function reMakeDataForColumnChart(columnChartSeriesData, checkedInfo) {
  return columnChartSeriesData.map((seriesItem, idx) => {
    return Object.assign({}, seriesItem, {
      visible: checkedInfo[idx]
    });
  });
}

// 라인차트
function reMakeDataForLineChart(lineChartSeriesData, columnChartSeriesData, checkedInfo) {
  const makeTotalAverage = function(columnChartSeriesData, checkedInfo) {
    const checkedCount = checkedInfo.filter(checkedItem => checkedItem).length;

    return columnChartSeriesData.reduce((accumulator, seriesItem, idx) => {
      if (checkedInfo[idx]) {
        accumulator[0] += seriesItem.data[0];
        accumulator[1] += seriesItem.data[1];
        accumulator[2] += seriesItem.data[2];
      }

      return accumulator;
    }, [0, 0, 0]).map(totalValueForCategory => totalValueForCategory / checkedCount);
  };

  return lineChartSeriesData.map((seriesItem, idx) => {
    return {
      name: seriesItem.name,
      data: makeTotalAverage(columnChartSeriesData, checkedInfo)
    };
  });
}

