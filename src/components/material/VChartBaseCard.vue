<template>
    <material-card
            v-bind="$attrs"
            class="v-card--material-chart"
            v-on="$listeners"
    >
<!--        折线图-->
        <ve-line :data="chartData" :colors="colors" slot="header" :dataZoom="dataZoom" :loading="!readyToShow"
                 v-if="chartDetail.type === 'line'" height="360px"></ve-line>
<!--        柱状图-->
        <ve-histogram :data="chartData" :colors="colors" slot="header" :dataZoom="dataZoom"
                 v-if="chartDetail.type === 'histogram'" height="360px"></ve-histogram>

<!--        饼图，只有一个维度和一个指标（数量）-->
        <ve-pie :data="chartData" :colors="colors" slot="header"
                      v-if="chartDetail.type === 'pie'" ></ve-pie>

        漏斗图，只有一个维度和一个指标（数量）
        <ve-funnel :data="chartData" :colors="colors" slot="header"
                v-if="chartDetail.type === 'funnel'" ></ve-funnel>

        <h4 class="title font-weight-light">{{chartDetail.name}}</h4>
        <p class="category d-inline-flex font-weight-light">{{chartDetail.desc}}</p>

        <template slot="actions">
            <v-icon
                    class="mr-2"
                    small
            >
                mdi-clock-outline
            </v-icon>
            <span class="caption grey--text font-weight-light">updated 10 minutes ago</span>
        </template>
    </material-card>
</template>

<script>
    import {Chart} from "../../url";

    let moment = require('moment')
    const thirty_minutes = 1000 * 60 * 30;
    const one_hour = 1000 * 60 * 60;
    const six_hour = 1000 * 6 * 60 * 60;
    const twelve_hour = 1000 * 12 * 60 * 60;
    const one_day = 1000 * 24 * 60 * 60;
    const three_day = 1000 * 60 * 60 * 24 * 3;
    const one_week = 1000 * 60 * 60 * 24 * 7;
    const one_month = 1000 * 60 * 60 * 24 * 31;
    const three_month = 1000 * 60 * 60 * 24 * 31 * 3;

    export default {
        inheritAttrs: false,

        props: ['chartDetail', 'queryInterval', 'showStyle', 'extraFilters'],

        data() {
            return {
                colors: [
                    '#4caf50',
                    '#82B1FF',
                    '#f55a4e',
                    '#495057',
                ],
                dataZoom: [{type: 'slider'}],
                chartData:{
                    columns: [],
                    rows: []
                },
                metricList:[],
            }
        },

        computed: {
          readyToShow() {return this.chartData && this.chartData.columns && this.chartData.columns.length >= 1},
        },

        methods: {
            // 根据传入的图标配置的各项参数获取数据
            getMetric() {
                this.chartData.rows = [];
                this.chartData.columns = [];
                let params = {
                    chartId: 1,
                    intervals: [{
                        startTime: 1554775200000,
                        endTime: 1554800400000 + 1000 * 60 * 60 *2,
                    }],
                    period: '1小时',
                    filter: {},
                };

                // columns：指标和维度的展示名集合
                const columns = new Set();
                columns.add('xAxis');
                columns.add('下单量');
                Chart.getViewByChart(1,params)
                    .then((resp) => {
                        console.log(resp);
                        this.metricList = resp.metricList;
                        this.metricList.forEach((result) => {
                            let row = {}, intervalMs = 1554800400000 - 1554775200000;
                            // 如果查询时间间距大于一天，则显示日期
                            row.xAxis = intervalMs >= one_day ? moment(result.timestamp).format('MM/DD H:mm ') : moment(result.timestamp).format('H:mm ');
                            row['下单量'] = result.data.length > 0 ? result.data[0].count : 0;
                            // console.log('row:');
                            // console.log(row);
                            this.chartData.rows.push(row);
                        });
                        this.chartData.columns = Array.from(columns);
                        console.log(this.chartData);
                    });

                // console.log('results');
                // console.log(this.metricList);
            },
        },

        mounted() {
            this.getMetric();
        }

    }
</script>

<style lang="scss">
    .v-card--material-chart {
        .v-card--material__header {
            .ct-label {
                color: inherit;
                opacity: .7;
                font-size: 0.975rem;
                font-weight: 100;
            }

            .ct-grid {
                stroke: rgba(255, 255, 255, 0.2);
            }

            .ct-series-a .ct-point,
            .ct-series-a .ct-line,
            .ct-series-a .ct-bar,
            .ct-series-a .ct-slice-donut {
                stroke: rgba(255, 255, 255, .8);
            }

            .ct-series-a .ct-slice-pie,
            .ct-series-a .ct-area {
                fill: rgba(255, 255, 255, .4);
            }
        }
    }
</style>
