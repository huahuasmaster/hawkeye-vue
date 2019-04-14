<template>
    <div>
        <material-card
                v-if="chartDetail.type !== 'stats'"
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
                    v-if="chartDetail.type === 'pie'"></ve-pie>

            <!--漏斗图，只有一个维度和一个指标（数量）-->
            <ve-funnel :data="chartData" :colors="colors" slot="header"
                       v-if="chartDetail.type === 'funnel'"></ve-funnel>

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
        <material-stats-card
                v-if="chartDetail.type === 'stats'"
                color="green"
                icon="mdi-store"
                :title="chartDetail.name"
                :value="wholeStats"
                sub-icon="mdi-calendar"
                :sub-text="chartDetail.desc"></material-stats-card>
    </div>
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
    const period_option = [
        {min: -1, max: thirty_minutes, options: ['1分钟', '2分钟', '5分钟']},
        {min: thirty_minutes, max: one_hour, options: ['2分钟', '5分钟', '10分钟']},
        {min: one_hour, max: six_hour, options: ['5分钟', '10分钟', '15分钟']},
        {min: six_hour, max: twelve_hour, options: ['10分钟', '15分钟', '20分钟']},
        {min: twelve_hour, max: one_day, options: ['15分钟', '20分钟', '30分钟']},
        {min: one_day, max: three_day, options: ['2小时', '6小时', '12小时']},
        {min: three_day, max: one_week, options: ['6小时', '12小时', '1天']},
        {min: one_week, max: three_month, options: ['1天']},
    ];
    export default {
        inheritAttrs: false,

        props: ['chartDetail', 'queryInterval', 'showStyle', 'extraFilters'],

        watch: {
            queryInterval: {
                handler(to, from) {

                    this.queryTime.interval.startTime = this.queryInterval.startTime;
                    this.queryTime.interval.endTime = this.queryInterval.endTime;
                    console.log('查询时间变化，起始时间：%s 结束时间：%s', this.queryTime.interval.startTime, this.queryTime.interval.endTime);
                    if (!this.granularityOptions.includes(this.queryTime.period)) {
                        this.queryTime.period = this.granularityOptions[0];
                    }
                    this.getMetric();
                },
                deep: true
            }
        },

        data() {
            return {
                colors: [
                    '#4caf50',
                    '#82B1FF',
                    '#f55a4e',
                    '#495057',
                ],
                dataZoom: [{type: 'slider'}],
                chartData: {
                    columns: [],
                    rows: []
                },
                metricList: [],
                queryTime: {interval: {startTime: 0, endTime: 0}, period: ''},
                xAxis: {axisLabel: {interval: 0}},
                compareMetricText: null,
                compareTime: [
                    {v: one_hour, t: '一小时前'},
                    {v: one_day, t: '一天前'},
                    {v: one_week, t: '一周前'}],
                lastRefreshTime: new Date().valueOf(),
            }
        },

        computed: {
            readyToShow() {
                return this.chartData && this.chartData.columns && this.chartData.columns.length >= 1
            },
            wholeStats() {
                return this.chartDetail.config.prefix + this.chartData + this.chartDetail.config.suffix;
            },
            // dimensions为该图表定义的维度
            dimensions: function () {
                let dimension = [];
                this.chartDetail.dimensions.forEach(d => dimension.push(d.alias));
                if (this.compareMetric) {
                    dimension.push('同比');
                }
                return dimension;
            },
            // metrics为该图表定义的指标，包含后聚合指标
            metrics: function () {
                let metric = [];
                this.chartDetail.aggregations.forEach(a => metric.push(a.alias));
                this.chartDetail.postAggregations.forEach(p => metric.push(p.name));
                return metric;
            },
            granularityOptions: function () {
                let intervalTime = (this.queryTime.interval.endTime - this.queryTime.interval.startTime);
                console.log('当前时间间隔' + intervalTime + '秒');
                return period_option.find(o => o.min < intervalTime && o.max >= intervalTime).options;
            },
            needTimeSlice: function () {
                return this.chartDetail.type === 'line';
            },
            needSortCharts: function () {
                return this.chartDetail.type === 'bar';
            },
            dataAxis: function () {
                let xAxis = [];
                this.chartData.rows.forEach(row => xAxis.push(row['xAxis']));
                return xAxis;
            },
            columns: function () {
                let columns = [];
                if (this.chartData.rows < 1) {
                    return columns;
                } else {
                    let dimension = this.dimensions.length > 1 ? '分组维度' : this.dimensions[0];
                    let xAxisKey = this.needTimeSlice ? '时间' : dimension;
                    columns.push({title: xAxisKey, key: 'xAxis', sortable: true});
                    Object.keys(this.chartData.rows[0])
                        .filter(key => key !== 'xAxis')
                        .forEach(key => columns.push({title: key, key: key, sortable: true}));
                    return columns;
                }
            },

        },

        methods: {
            // 根据传入的图标配置的各项参数获取数据
            getMetric() {
                if (!this.chartId) return;
                console.log('更新指标数据');
                this.clear();

                let params = {
                    chartId: this.chartId,
                    intervals: [{
                        startTime: this.queryTime.interval.startTime,
                        endTime: this.queryTime.interval.endTime,
                    }],
                    period: this.queryTime.period,
                    filter: {},
                };



                // columns：指标和维度的展示名集合
                const columns = new Set();
                columns.add('xAxis');
                Chart.getViewByChart(1, params)
                    .then((resp) => {
                        console.log(resp);
                        this.metricList = resp.metricList;
                        this.calMetric();
                        // stats图表需要特殊处理
                        // if (this.chartDetail.type === 'stats') {
                        //     if (this.metricList.length <= 0 || this.metricList[0].data.length <= 0) {
                        //         this.chartData = 0;
                        //     } else {
                        //         this.chartData = this.metricList[0].data[0].amount_sum;
                        //     }
                        //     return;
                        // }
                        //
                        // this.chartData.rows = [];
                        // this.chartData.columns = [];
                        //
                        // this.metricList.forEach((result) => {
                        //     let row = {}, intervalMs = params.intervals[0].endTime - params.intervals[0].startTime;
                        //     // 如果查询时间间距大于一天，则显示日期
                        //     row.xAxis = intervalMs >= one_day ? moment(result.timestamp).format('MM/DD H:mm ') : moment(result.timestamp).format('H:mm ');
                        //     row['下单量'] = result.data.length > 0 ? result.data[0]['下单量'] : 0;
                        //     // console.log('row:');
                        //     // console.log(row);
                        //     this.chartData.rows.push(row);
                        // });
                        // this.chartData.columns = Array.from(columns);
                        // console.log(this.chartData);
                    });

                // console.log('results');
                // console.log(this.metricList);
            },
            /**
             * 生成前端展示的指标集合
             */
            calMetric() {

                console.log('当前图表：' + this.chartDetail.name + '  维度：' + this.dimensions);
                console.log('当前图表：' + this.chartDetail.name + '  度量：' + this.metrics);

                // columns：指标和维度的展示名集合
                const columns = new Set();
                columns.add('xAxis');
                // stats图表需要特殊处理
                if (this.chartDetail.type === 'stats') {
                    if (this.metricList.length <= 0 || this.metricList[0].data.length <= 0) {
                        this.chartData = 0;
                    } else {
                        this.chartData = this.metricList[0].data[0].amount_sum;
                    }
                    return;
                }
                // 按时间排序
                this.metricList.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);


                if (this.needTimeSlice) {
                    // 需要时间切片，x轴为时间维度的，将多维度名拼接进指标展示名称中，例如 column = '用户数『产品名:20;订单状态:6』';
                    this.metricList.forEach(metric => {
                        let row = {}, intervalMs = this.queryTime.interval.endTime - this.queryTime.interval.startTime;
                        // 时间序列
                        row.xAxis = intervalMs >= one_day ? moment(metric.timestamp).format('MM/DD H:mm ') : moment(metric.timestamp).format('H:mm ');
                        metric.data.forEach(obj => {
                            let entry = Object.entries(obj);
                            // entry为一个指标数据集合，包含度量和维度，key为名称，value为指标或维度的值
                            entry.forEach(map => {
                                let key = map[0], value = map[1];
                                // metricViewName 作为指标展示名称
                                if (this.metrics.includes(key)) {
                                    let metricViewName = key + '『';
                                    entry.forEach(objMap => {
                                        if (this.dimensions.includes(objMap[0])) {
                                            metricViewName = metricViewName + objMap[0] + ':' + objMap[1] + '.';
                                        }
                                    });
                                    metricViewName = metricViewName + '』';
                                    metricViewName = metricViewName.replace('『』', '');
                                    row[metricViewName] = value;
                                    columns.add(metricViewName);
                                }

                            });
                        });
                        this.chartData.rows.push(row);
                    });
                } else {
                    // 不需要时间切片的指标数据处理，将多维度笛卡尔积后生成单一维度，例如 column = '『产品名:20;订单状态:6』';
                    this.metricList[0].data.forEach(obj => {
                        let row = {}, xAxisValue = '', entry = Object.entries(obj);
                        entry.forEach(map => {
                            let key = map[0], value = map[1];
                            if (this.metrics.includes(key)) {
                                row[key] = value;
                                columns.add(key);
                            }
                            if (this.dimensions.includes(key)) xAxisValue = this.dimensions.length === 1 ? value : xAxisValue + key + ':' + value + '.';
                        });
                        row.xAxis = xAxisValue;
                        this.chartData.rows.push(row);
                    });
                }
                // 当指标数据为空时需要在这里将指标列添加进去，正常情况下columns.size大于1(至少包含一个指标一个维度)
                if (columns.size <= 1) this.metrics.forEach((m) => columns.add(m));
                if (this.chartData.rows.length < 1) this.chartData.rows.push({});
                // 为了使折线图连续，如果当前指标没有数据则设置值为0
                columns.forEach((item) => {
                    this.chartData.columns.push(item);
                    this.chartData.rows.forEach((row) => {
                        if (row[item] === undefined) row[item] = 0;
                    });
                });
                // 排序 使用GroupBy查询出的数据是无序的，对于柱状图和条形图需要排序使得看起来美观
                if (this.needSortCharts && this.chartData.columns.filter(c => c !== 'xAxis').length > 0) {
                    let sortMetricName = this.chartData.columns.filter(c => c !== 'xAxis')[0];
                    this.chartData.rows.sort((f, s) => f[sortMetricName] > s[sortMetricName] ? 1 : -1);
                }
                console.log('图表渲染数据', this.chartData);
                this.xAxis.data = this.dataAxis;
                this.lastRefreshTime = new Date().getTime();
            },
            clear() {
                if (this.chartDetail.type === 'stats') {
                    this.chartData = 0;
                } else {
                    this.chartData.columns = [];
                    this.chartData.rows = [];
                }
                this.metricList = [];
            },
        },

        mounted() {
            this.queryTime.interval.startTime = this.queryInterval.startTime;
            this.queryTime.interval.endTime = this.queryInterval.endTime;
            this.queryTime.period = this.granularityOptions[0];
            this.chartId = this.chartDetail.id;
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
