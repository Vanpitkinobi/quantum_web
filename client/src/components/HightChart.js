import React from 'react';
import Highcharts from 'highcharts';
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend, LineSeries,
} from 'react-jsx-highcharts';
import PropTypes from "prop-types";
import {styles} from "./common/styles";


const plotOptions = {
  series: {
    pointStart: 2020
  }
};

const HighChart = (props) => (
  <div className="app">
    <HighchartsChart plotOptions={plotOptions}>
      <Chart />

      <Title>Evolution log</Title>

      <Legend layout="vertical" align="right" verticalAlign="middle" />

      <XAxis type="datetime">
        <XAxis.Title>Time</XAxis.Title>
      </XAxis>

      <YAxis>
        <YAxis.Title>Energy</YAxis.Title>
        <LineSeries name="Energy" data={props.data} />

      </YAxis>

    </HighchartsChart>

    <div style={styles.spanBlock}>
      {props.data && props.data.length > 0 ?
          <span style={styles.solverSpan}>Min energy: {props.data[props.data.length - 1]}</span> : null}
    </div>

  </div>
);

HighChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default withHighcharts(HighChart, Highcharts);
