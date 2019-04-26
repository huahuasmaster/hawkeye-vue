<template>
    <div>
        <material-card
                v-if="chartDetail.type !== 'stats'"
                v-bind="$attrs"
                class="v-card--material-chart"
                v-on="$listeners"
                ref="chart-content"
        >
            <div class="mycontent">
                <!--        折线图-->
                <ve-line :data="chartData" :colors="colors" slot="header" :dataZoom="dataZoom" :loading="!readyToShow"
                         ref="chart" judge-width :toolbox="toolbox"
                         v-if="chartDetail.type === 'line'"></ve-line>
                <!--        柱状图-->
                <!--<ve-histogram :data="chartData" :colors="colors" slot="header" :dataZoom="dataZoom" ref="chart" judge-width :xAxis="xAxis"-->
                <!--v-if="chartDetail.type === 'histogram'" height="360px"></ve-histogram>-->

                <!--        饼图，只有一个维度和一个指标（数量）-->
                <ve-pie :data="chartData" :colors="colors" slot="header" ref="chart" judge-width
                        :chartSetting="chartSetting"
                        v-if="chartDetail.type === 'pie'"></ve-pie>

                <!--漏斗图，只有一个维度和一个指标（数量）-->
                <ve-funnel :data="chartData" :colors="colors" slot="header" ref="chart" judge-width :chartSetting="{useDefaultOrder: true,
                    filterZero: true}"
                           v-if="chartDetail.type === 'funnel'"></ve-funnel>
            </div>


            <v-container style="padding: 0px" align-space-around justify-center row  ref="chart-detail">
                <v-layout>
                    <v-flex>
                        <h4 class="title font-weight-light" ref="chart-name">{{chartDetail.name}}</h4>
                        <p class="category d-inline-flex font-weight-light" ref="chart-desc">{{chartDetail.desc}}</p>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex
                            style="margin-right: 32px"

                            lg3
                            md3
                            v-if="this.chartDetail.type === 'line'"
                    >
                        <v-select
                                v-model="compareText"
                                :items="compareTime"
                                label="选择同比"
                                item-text="t"
                                item-value="v"
                        >

                        </v-select>
                    </v-flex>


                        <!--<v-icon-->
                                <!--class="mr-2"-->
                                <!--color="success"-->

                                <!--@click="edit()"-->
                        <!--&gt;-->
                            <!--mdi-pencil-->
                        <!--</v-icon>-->
                        <v-icon
                                color="error"
                                @click="delete1()"
                        >
                            mdi-close
                        </v-icon>
                </v-layout>
            </v-container>

            <!--<div slot="actions" ref="chart-action">-->
            <!--<v-container style="padding: 0px"  align-center justify-center row fill-height>-->
            <!--<v-layout>-->
            <!--<v-flex>-->
            <!--<v-icon-->
            <!--class="mr-2"-->
            <!--small-->
            <!--&gt;-->
            <!--mdi-clock-outline-->
            <!--</v-icon>-->
            <!--<span class="caption grey&#45;&#45;text font-weight-light">刷新于{{new Date(lastRefreshTime).toLocaleTimeString()}}</span>-->
            <!--</v-flex>-->
            <!--<v-spacer></v-spacer>-->
            <!--<v-flex-->
            <!--lg4-->
            <!--md4-->
            <!--&gt;-->
            <!--<v-select-->
            <!--v-model="compareText"-->
            <!--:items="compareTime"-->
            <!--label="选择同比"-->
            <!--item-text="t"-->
            <!--item-valie="v"-->
            <!--&gt;-->

            <!--</v-select>-->
            <!--</v-flex>-->
            <!--</v-layout>-->
            <!--</v-container>-->


            <!--</div>-->
        </material-card>
        <material-stats-card
                v-if="chartDetail.type === 'stats'" ref="chart-stats"
                color="green"
                icon="mdi-store"
                :title="chartDetail.name"
                :value="wholeStats"
                sub-icon="mdi-calendar"
                v-on:delete_it="delete1"
                :sub-text="chartDetail.desc">
        </material-stats-card>
        <v-dialog
                v-model="dialog"
                max-width="290"
        >
            <v-card>
                <v-card-title class="headline">确认要删除图表?</v-card-title>

                <v-card-text>
                    该操作无法撤销
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                            color="green darken-1"
                            flat="flat"
                            @click="dialog = false"
                    >
                        取消
                    </v-btn>

                    <v-btn
                            color="red darken-1"
                            flat="flat"
                            @click="doDelete"
                    >
                        删除
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import {Chart} from "../../url";
    import VeLine from 'v-charts/lib/line.common'
    import VePie from 'v-charts/lib/pie.common'
    import VeFunnel from 'v-charts/lib/funnel.common'
    import 'v-charts/lib/histogram.common'
    import 'echarts/lib/component/dataZoom'
    import 'echarts/lib/component/toolbox'
    import {Dashboard} from "../../url";

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
        {min: one_hour, max: six_hour, options: ['10分钟', '15分钟', '20分钟']},
        {min: six_hour, max: twelve_hour, options: ['15分钟', '20分钟', '30分钟']},
        {min: twelve_hour, max: one_day, options: ['15分钟', '20分钟', '30分钟']},
        {min: one_day, max: three_day, options: ['2小时', '6小时', '12小时']},
        {min: three_day, max: one_week, options: ['6小时', '12小时', '1天']},
        {min: one_week, max: three_month, options: ['1天']},
    ];
    const extraHeights = [
        {type: 'line', height: 60},
        {type: 'pie', height: 70},
        {type: 'funnel', height: 70},
    ];
    export default {
        inheritAttrs: false,

        props: ['chartDetail', 'queryInterval', 'showStyle', 'extraFilters'],

        components: {
            VeLine,
            VePie,
            VeFunnel,
        },

        watch: {
            queryInterval: {
                handler(to, from) {

                    this.queryTime.interval.startTime = this.queryInterval.startTime;
                    this.queryTime.interval.endTime = this.queryInterval.endTime;
                    console.log('查询时间变化，起始时间：%s 结束时间：%s', this.queryTime.interval.startTime, this.queryTime.interval.endTime);

                    this.getMetric();
                },
                deep: true
            },
            compareText(to, from) {
                this.getMetric();
            }
        },

        data() {
            return {
                colors: [
                    '#4caf50',
                    '#82B1FF',
                    '#f55a4e',
                    '#495057',
                    '#00d3ee',
                    '#ffa21a',
                    '#5cb860',
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
                compareText: null,
                compareTime: [
                    {v: one_hour, t: '一小时前'},
                    {v: one_day, t: '一天前'},
                    {v: one_week, t: '一周前'}],
                lastRefreshTime: new Date().valueOf(),
                chartSetting: {
                    coordinateSystem: 'geo',

                },
                first: true,
                toolbox: {
                    feature: {
                        magicType: {type: ['line', 'bar']},
                        saveAsImage: {}
                    }
                },
                dialog: false,
            }
        },

        computed: {
            compareMetric: function () {
                return this.compareTime.find(c => c.v === this.compareText);
            },
            readyToShow() {
                return this.chartData && this.chartData.columns && this.chartData.columns.length >= 1
            },
            wholeStats() {
                let prefix = this.chartDetail.config.prefix ? this.chartDetail.config.prefix : '';
                let suffix = this.chartDetail.config.suffix ? this.chartDetail.config.suffix : '';
                return prefix + this.chartData + suffix;
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
                // this.chartDetail.postAggregations.forEach(p => metric.push(p.name));
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
            edit() {
                console.log('想要编辑图表' + this.chartDetail.name);
            },
            delete1() {
                // console.log('想要删除图表' + this.chartDetail.name);
                this.dialog = true;
            },
            doDelete() {
                let dashbordId = this.$route.params.id;
                let chartId = this.chartDetail.id;
                Dashboard.delete(dashbordId, chartId)
                    .then(resp => {
                        this.$store.dispatch('alert', {type: "success", content: "删除成功"});
                        this.$emit('delete-chart')
                    })
                    .catch(error => {
                        this.$store.dispatch('alert', {type: "error", content: "删除失败"})
                    })
                    .finally(() => this.dialog = false);
            },
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
                    period: this.needTimeSlice ? this.queryTime.period : 'all',
                    filter: {},
                };


                // columns：指标和维度的展示名集合
                const columns = new Set();
                columns.add('xAxis');
                Chart.getViewByChart(params.chartId, params)
                    .then((resp) => {
                        console.log(`图表${this.chartDetail.name}`, resp);
                        console.log(this.compareText);
                        this.metricList = resp.metricList;
                        if (this.needTimeSlice && this.compareMetric) {
                            // 增加同比
                            console.log('添加同比，时间间隔', this.compareMetric.v);
                            params.intervals = [{
                                startTime: this.queryTime.interval.startTime - this.compareMetric.v,
                                endTime: this.queryTime.interval.endTime - this.compareMetric.v,
                            }];
                            // 获取同比指标
                            return Chart.getViewByChart(params.chartId, params);
                        } else {
                            this.calMetric();
                        }
                    })
                    .then((resp) => {
                        // 对同比数据进行处理
                        if (!resp) return;
                        console.log("同比数据", resp);
                        resp.metricList.forEach(metric => {
                            let originData = this.metricList.find(m => m.timestamp === metric.timestamp + this.compareMetric.v).data;
                            originData.forEach(d => d['同比'] = '当前时间');
                            metric.data.forEach(d => {
                                d['同比'] = this.compareMetric.t;
                                originData.push(d);
                            });
                        });
                        this.calMetric();
                    })
                    .catch(exp => {
                        this.$store.dispatch('alert', {type: 'info', content: `图表${this.chartDetail.name}数据获取失败`})
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
                        let data = this.metricList[0].data[0];
                        let metricName = this.metrics[0];
                        console.log('data:', data);
                        console.log(data[metricName]);
                        this.chartData = data[metricName].toString();
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
                                // 漏斗图的指标需要转化一下
                                row[key] = this.chartDetail.type === 'funnel' && key === '数量' ? parseInt(value) : value;
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
                this.viewReSize(this.$parent.$el.clientHeight);
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
            autoRefresh(time) {
                this.queryTime.interval.startTime = this.queryTime.interval.startTime + time;
                this.queryTime.interval.endTime = this.queryTime.interval.endTime + time;
                this.getMetric();
            },
            viewReSize: function (newHPx, newWPx) {
                console.log(`${this.chartDetail.name}开始更新大小, 容器大小${newHPx}`);
                //需要计算出图表的实际新高度
                if (!this.chartDetail || this.chartDetail.type === 'stats') {
                    return;
                }
                console.log(this.$refs);
                // let nameHeight = this.$refs['chart-name'].clientHeight;
                // let descHeight = this.$refs['chart-desc'].clientHeight;
                let detailHeight = this.$refs['chart-detail'].clientHeight;
                // let actionHeight = this.$refs['chart-action'].clientHeight;
                let extraHeight = extraHeights.find(e => e.type === this.chartDetail.type).height;
                // let chartHeight = newHPx - nameHeight - descHeight - extraHeight;
                let chartHeight = newHPx - detailHeight - extraHeight;
                this.$nextTick(_ => {
                    let chart = this.$refs[`chart`];
                    if (chart) {
                        chart.height = chartHeight + 'px';
                        chart.echarts.resize();
                    }
                });
                // this.$nextTick(_ => {
                //     let table = this.$refs[`table`];
                //     if (table) table.height = chartHeight;
                // });
            },
        },

        mounted() {
            this.queryTime.interval.startTime = this.queryInterval.startTime;
            this.queryTime.interval.endTime = this.queryInterval.endTime;
            this.queryTime.period = this.granularityOptions[0];
            this.chartId = this.chartDetail.id;
            this.getMetric();
            // console.log(this.$parent.$el);
            let parentheight = this.$parent.$el.clientHeight;
            // console.log('parentheight', parentheight);
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

    .mycontent {

    }
</style>
