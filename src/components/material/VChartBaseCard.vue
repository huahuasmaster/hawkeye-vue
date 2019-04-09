<template>
    <material-card
            v-bind="$attrs"
            class="v-card--material-chart"
            v-on="$listeners"
    >
        <ve-line :data="chartData" :colors="colors" slot="header" :dataZoom="dataZoom"
                 v-if="chartDetail.type === 'line'" height="360px"></ve-line>

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
                    columns: ['日期', '访问用户', '下单用户', '下单率'],
                    rows: [
                        {'日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32},
                        {'日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26},
                        {'日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76},
                        {'日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49},
                        {'日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323},
                        {'日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78}
                    ]
                },
                metricList:[],
            }
        },

        methods: {
            // 根据现有的各项参数获取数据
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
                Chart.getViewByChart(1,params)
                    .then((resp) => {
                        console.log(resp);
                        this.metricList = resp.metricList;
                        this.metricList.forEach((result) => {
                            let row = {}, intervalMs = 1554800400000 - 1554775200000;
                            // 如果查询时间间距大于一天，则显示日期
                            row.xAxis = intervalMs >= one_day ? moment(result.timestamp).format('MM/DD H:mm ') : moment(result.timestamp).format('H:mm ');
                            row['下单量'] = result.data.length > 0 ? result.data[0].count : 0;
                            console.log('row:')
                            console.log(row);
                            this.chartData.rows.push(row);
                        });
                        this.chartData.columns = Array.from(columns);
                        console.log(this.chartData);
                    });
                // columns：指标和维度的展示名集合
                const columns = new Set();
                columns.add('xAxis');
                columns.add('下单量');
                console.log('results');
                console.log(this.metricList);


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
