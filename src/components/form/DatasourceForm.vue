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
            <form style="padding: 24px">

            </form>
        </v-tab-item>
    </v-tabs>

    <div class="text-xs-center mt-3">
        <v-btn @click="next"></v-btn>
    </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                active: 1,
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
                ]
            }
        },
        methods:  {
            next() {

            }
        }
    }

</script>