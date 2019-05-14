<template>
    <form style="padding: 24px">
        <v-select
                v-model="params.type"
                :items="types"
                label="图表类型"
                item-text="text"
                item-value="value"
                :disabled="isUpdating"
        ></v-select>
        <v-text-field
                v-model="params.name"
                label="名称"
                required
        ></v-text-field>
        <v-text-field
                v-model="params.desc"
                label="描述"
                required
        ></v-text-field>
        <v-select
                v-model="params.datasourceId"
                :items="datasources"
                label="数据源"
                item-text="desc"
                item-value="id"
                v-if="this.params.type !== 'funnel'"
                :disabled="isUpdating"
        ></v-select>
        <v-select
                v-model="params.config.datasourceIds"
                :items="datasources"
                label="数据源（多选）"
                item-text="desc"
                item-value="id"
                multiple
                chips
                v-else
        ></v-select>


        <!------------------------------选择指标------------------------------>
        <v-container
                v-for="(item,index) in params.aggregations"
                :key="'agg'+index"
                v-if="allowMetric"
        >
            <!--选择指标字段-->
            <v-layout>
                <v-flex
                        md4
                        lg4
                        xs12
                >
                    <v-select
                            v-model="item.metric"
                            :items="choosedDatasource.metricList"
                            label="指标字段"
                    ></v-select>
                </v-flex>
                <v-flex
                        md4
                        lg4
                        xs12
                >
                    <v-select
                            v-model="item.metricAggregationType"
                            :items="getAggregationsTypeOption(item.metric)"
                            label="聚合类型"
                            item-text="k"
                            item-value="v"
                    ></v-select>
                </v-flex>
                <v-flex
                        md4
                        lg4
                        xs12
                >
                    <v-text-field
                            v-model="item.alias"
                            label="别名"
                            required
                    ></v-text-field>
                </v-flex>
                <!--<v-flex-->
                        <!--md3-->
                        <!--lg3-->
                        <!--xs12-->
                <!--&gt;-->
                    <!--<v-btn flat color="success" v-if="params.aggregations.length === index + 1"-->
                           <!--@click="putNewEmptyAggregation">新增指标-->
                    <!--</v-btn>-->
                    <!--<v-btn flat color="error" @click="params.aggregations.splice(index, 1)">删除此项</v-btn>-->
                <!--</v-flex>-->
            </v-layout>
        </v-container>

        <!------------------------------选择维度（非必填）------------------------------>
        <!--<v-select-->
        <!--v-model="choosedDimensions"-->
        <!--:items="choosedDatasource.dimensionList"-->
        <!--v-if="choosedDatasource.dimensionList.length > 1"-->
        <!--label="分组维度（非必填）"-->
        <!--multiple-->
        <!--&gt;</v-select>-->
        <v-container
                v-for="(item,index) in params.dimensions"
                :key="'dimen'+index"
                v-if="allowDimension"

        >
            <!--选择指标字段-->
            <v-layout>
                <v-flex
                        md5
                        lg5
                        xs12
                >
                    <v-select
                            v-model="item.dimensionField"
                            :items="choosedDatasource.dimensionList"
                            label="维度字段"
                    ></v-select>
                </v-flex>

                <v-flex
                        md4
                        lg4
                        xs12
                >
                    <v-text-field
                            v-model="item.alias"
                            label="别名"
                            required
                    ></v-text-field>
                </v-flex>
                <v-flex
                        md3
                        lg3
                        xs12
                        v-if="!singleDimension"
                >
                    <v-btn flat color="success" v-if="params.dimensions.length === index + 1"
                           @click="putNewEmptyDimension">新增维度
                    </v-btn>
                    <v-btn flat color="error" @click="params.dimensions.splice(index, 1)">删除此项</v-btn>
                </v-flex>
                <v-flex
                        md3
                        lg3
                        xs12
                        v-else
                >
                    <v-text-field
                            v-model="params.threshold"
                            label="阈值"
                            required
                    ></v-text-field>
                </v-flex>
            </v-layout>
        </v-container>

        <!--状态图独占属性：前缀与后缀-->
        <v-container
                v-if="this.params.type === 'stats'"
        >
            <!--选择指标字段-->
            <v-layout>
                <v-flex
                        md6
                        lg6
                        xs12
                >
                    <v-text-field
                            v-model="params.config.prefix"
                            label="显示前缀"
                    ></v-text-field>
                </v-flex>

                <v-flex
                        md6
                        lg6
                        xs12
                >
                    <v-text-field
                            v-model="params.config.suffix"
                            label="显示后缀"
                            required
                    ></v-text-field>
                </v-flex>
            </v-layout>
        </v-container>
        <v-btn @click="submit" color="success">提交</v-btn>
        <v-btn @click="clear" color="error">重置</v-btn>
    </form>
</template>
<script>
    import {Datasource, Chart} from "../../url";

    export default {
        props: ['dashboardId', 'isUpdating', 'targetChart'],
        watch: {
            "params.datasourceId": {
                handler(to, from) {
                    // console.log(`datasource发生了变更:${this.params.datasourceId}`)
                    if (this.params.datasourceId !== 0) {
                        if (this.params.aggregations.length < 1) {
                            this.putNewEmptyAggregation();
                        }
                        if (this.params.dimensions.length < 1) {
                            this.putNewEmptyDimension();
                        }
                    }
                },
                deep: true,
            },
            targetChart(to, from) {
                this.params = this.targetChart;
            }
        },
        computed: {
            choosedDatasource() {
                let result = this.datasources.find(ds => ds.id === this.params.datasourceId);
                if (!result) {
                    result = {metricList: [], dimensionList: []}
                }
                return result;
            },
            allowMetric() {
                // 大部分允许指标，只有漏斗图不允许自定指标（默认为count）
                return this.params.type !== 'funnel';
            },
            allowDimension() {
                // 大部分允许维度，只有漏斗图和状态图不允许维度分组
                return !['funnel', 'stats', 'line'].includes(this.params.type);
            },
            singleDimension() {
                // 允许单维度，暂时只有饼图
                return ['pie'].includes(this.params.type);
            },
            singleMetric() {
                // 只允许单指标：饼图，状态图
            }
        },
        data() {
            return {
                params: {
                    type: '',
                    desc: '',
                    name: '',
                    datasourceId: 0,
                    dashboardId: '',
                    aggregations: [],
                    dimensions: [],
                    filters: [],
                    config: {},
                    threshold: 4,
                },
                types: [
                    {
                        text: '折线图',
                        value: 'line',
                    },
                    {
                        text: '状态图',
                        value: 'stats',
                    },
                    // {
                    //     text: '柱状图',
                    //     value: 'histogram'
                    // },
                    {
                        text: '饼图',
                        value: 'pie'
                    },
                    {
                        text: '漏斗图',
                        value: 'funnel',
                    }
                ],
                datasources: [],
                choosedDimensions: [],
                newChartId: -1,
            }
        },
        methods: {
            getAggregationsTypeOption(name) {
                if (this.choosedDatasource && this.choosedDatasource.metricList.length < 1) return [];
                // let isDistinctVariable = this.variableMetrics.find(v => v.useDistinct && v.queryName === name) != null;
                // let isDruid = this.formItem.metricQueryType === 'DRUID';
                // if (isDruid && name === 'count') {
                if (name === 'count') {
                    return [{k: '计数:COUNT()', v: 'COUNT'}];
                } else {
                    return [{k: '总和', v: 'SUM'}, {k: '最大值', v: 'MAX'},
                        {k: '最小值', v: 'MIN'}, {k: '去重计数:COUNT(DISTINCT)', v: 'DISTINCT'},
                        {k: '计数:COUNT()', v: 'COUNT'}];
                }
            },
            putNewEmptyAggregation() {
                this.params.aggregations.push({
                    metric: '',
                    alias: '',
                    metricAggregationType: '',
                });
            },
            putNewEmptyDimension() {
                this.params.dimensions.push({
                    dimensionField: '',
                    alias: '',
                });
            },
            clear() {
                this.params = {
                    type: '',
                    desc: '',
                    name: '',
                    datasourceId: 1,
                    dashboardId: 0,
                    aggregations: [],
                    dimensions: [],
                    filters: [],
                    config: {},
                };
            },
            submit() {
                this.params.aggregations = this.params.aggregations.filter(agg => agg.metric && agg.metric !== '');
                this.params.dimensions = this.params.dimensions.filter(dimen => dimen.dimensionField && dimen.dimensionField !== '');
                this.params.dashboardId = this.dashboardId;
                console.log(this.params);
                if (this.isUpdating) {
                    console.log('想要更新的图表id为', this.params.id);
                    Chart.update(this.params.id, this.params)
                        .then(resp => {
                            this.$store.dispatch('alert', {type: "success", content: "更新成功"})
                            this.$emit('chart_submit', this.params.id);
                        })
                } else {
                    if (this.params.type !== 'pie') {
                        this.params.threshold = 200;
                    }
                    if (this.params.type === 'funnel') {
                        this.params.aggregations = [{
                            alias: "数量",
                            metric: "count",
                            metricAggregationType: "COUNT"
                        }];
                        this.params.dimensions = [{alias: "名称", dimensionField: "name"}];
                    }
                    Chart.add(this.params)
                        .then(resp => {
                            this.newChartId = resp;
                            console.log('提交成功,图表id=' + this.newChartId);
                            this.$emit('chart_submit', this.newChartId);
                            this.clear();
                        });

                }

            },
            getDatasources() {
                Datasource.list()
                    .then(resp => {
                        this.datasources = resp;
                    });
            }
        },
        mounted() {
            this.getDatasources();
        },
    }

</script>