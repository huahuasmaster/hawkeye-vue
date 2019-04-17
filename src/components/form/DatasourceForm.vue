<template>
    <div>
    <v-tabs
            v-model="active"
            color="cyan"
            dark
            slider-color="yellow"
    >
        <v-tab
                ripple
                key="1"
        >
            连接配置
        </v-tab>
        <v-tab
                ripple
                key="2"
        >
            存储配置
        </v-tab>
        <v-tab-item
                key="1"
        >
            <form style="padding: 24px">
                <v-text-field
                        v-model="params.desc"
                        label="数据源描述"
                        required
                ></v-text-field>
                <v-select
                        v-model="params.type"
                        :items="types"
                        label="数据源类型"
                        item-text="text"
                        item-value="value"
                ></v-select>

                <!--以下是mysql独占选项（数据库名称，表名称）-->
                <v-text-field
                        v-model="params.sourceInfo.database"
                        label="数据库名称"
                        required
                        v-if="params.type === 'MYSQL'"
                ></v-text-field>
                <v-text-field
                        v-model="params.sourceInfo.table"
                        label="表名称"
                        required
                        v-if="params.type === 'MYSQL'"
                ></v-text-field>

                <!--以下是埋点独占选项（事件名）-->
                <v-text-field
                        v-model="params.sourceInfo.event"
                        label="埋点事件名称"
                        required
                        v-if="params.type === 'BURY'"
                ></v-text-field>

                <v-text-field
                        v-model="params.sample"
                        label="数据样例"
                        required
                        v-if="params.type === 'BURY'"
                ></v-text-field>


<!--                <v-btn @click="submit" color="success">提交</v-btn>-->
<!--                <v-btn @click="clear" color="error">重置</v-btn>-->
            </form>
        </v-tab-item>
        <v-tab-item key="2">
            <VariableTable :fields="fields" ref="table"></VariableTable>
        </v-tab-item>
    </v-tabs>

    <div class="text-xs-center mt-3">
        <v-btn @click="next"  color="info">下一步</v-btn>
    </div>
    </div>
</template>
<script>
    import VariableTable from '../material/VariableTable'

    export default {
        components: {VariableTable},
        data() {
            return {
                active: 0,
                mysqlVO: {
                    database:'',
                    table: '',
                },
                params: {
                    type: '',
                    desc: '',
                    fieldList: [],
                    sourceInfo: {},
                    sample: '',
                    dimensionList: [],
                    metricList: [],
                },
                types: [
                    {
                        text: '数据库',
                        value: 'MYSQL',
                    },
                    {
                        text: '埋点',
                        value: 'BURY',
                    }
                ],
                fields:[]
            }
        },
        methods:  {
            next() {
                if (this.active === 0) {
                    // 进行字段列表解析
                    this.fields = [
                        {
                            name:'book_id',
                            type:'dimension'
                        },
                        {
                            name:'amount',
                            type:'metric'
                        }
                    ];
                    this.active++;
                } else  {
                    // 提取用户的配置
                    let fields = this.$refs.table.items;
                    // 发送提交请求
                    console.log(fields)
                    this.active = 0;
                }
            }
        }
    }

</script>