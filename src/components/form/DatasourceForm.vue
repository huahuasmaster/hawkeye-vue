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
                    <v-text-field
                            v-model="params.sourceInfo.host"
                            label="数据库地址"
                            placeholder="localhost:3307"
                            required
                            v-if="params.type === 'MYSQL'"
                    ></v-text-field>
                    <v-text-field
                            v-model="params.sourceInfo.user"
                            label="账号"
                            required
                            v-if="params.type === 'MYSQL'"
                            placeholder="root"
                    ></v-text-field>
                    <v-text-field
                            v-model="params.sourceInfo.password"
                            label="密码"
                            required
                            v-if="params.type === 'MYSQL'"
                            placeholder="123456"
                            type="password"
                    ></v-text-field>

                    <!--以下是埋点独占选项（事件名）-->
                    <v-text-field
                            v-model="params.sourceInfo.event"
                            label="埋点事件名称"
                            required
                            v-if="params.type === 'BURY'"
                    ></v-text-field>

                    <v-textarea
                            v-model="params.sample"
                            label="数据样例"
                            required
                            v-if="params.type === 'BURY'"
                    ></v-textarea>


                    <!--                <v-btn @click="submit" color="success">提交</v-btn>-->
                    <!--                <v-btn @click="clear" color="error">重置</v-btn>-->
                </form>
            </v-tab-item>
            <v-tab-item key="2">
                <!--                <form style="padding: 24px">-->
                <!--                    <v-switch v-model="params.rollUp"></v-switch>-->
                <!--                </form>-->
                <VariableTable :fields="mappedFields" ref="table"></VariableTable>
            </v-tab-item>
        </v-tabs>

        <div class="text-xs-center mt-3">
            <v-btn @click="next" color="info" :loading="btnLoading">下一步</v-btn>
        </div>
    </div>
</template>
<script>
    import VariableTable from '../material/VariableTable';
    import {Datasource} from "../../url";

    export default {
        components: {VariableTable},
        data() {
            return {
                btnLoading: false,
                active: 0,
                mysqlVO: {
                    database: '',
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
                    rollUp: false,
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

            }
        },
        computed: {
            mappedFields() {
                if (!this.params.fieldList) {
                    return [];
                } else {
                    return this.params.fieldList.map(field => {
                        return {
                            field, type: this.params.type === 'MYSQL' ? 'dimension' : null
                        }
                    });
                }
            }
        },
        methods: {
            clear() {
                this.params = {
                    type: '',
                    desc: '',
                    fieldList: [],
                    sourceInfo: {},
                    sample: '',
                    dimensionList: [],
                    metricList: [],
                };
                this.active = 0;
            },
            getFields() {
                let json = '';
                try {
                    if (this.params.type === 'BURY') {
                        json = JSON.parse(this.params.sample);
                    }
                } catch (e) {
                    this.$store.dispatch('alert', {type: "error", content: '请检查json格式是否正确'});
                    this.btnLoading = false;
                    return;
                }

                console.log('json', json);
                let params = {
                    info: this.params.type === 'MYSQL' ?
                        this.handlerMysqlInfo() : json,
                    type: this.params.type,
                };

                Datasource.listFields(params)
                    .then(resp => {
                        this.params.fieldList = resp;
                        this.btnLoading = false;
                        this.active++;
                    })
                    .catch(exp => {
                        this.btnLoading = false;
                    });

            },
            handlerMysqlInfo() {
                this.params.sourceInfo = {
                    user: this.params.sourceInfo.user ? this.params.sourceInfo.user : "root",
                    password: this.params.sourceInfo.password ? this.params.sourceInfo.password : "123456",
                    host: this.params.sourceInfo.host ? this.params.sourceInfo.host : "localhost:3307",
                    database: this.params.sourceInfo.database,
                    table: this.params.sourceInfo.table,
                };
                return this.params.sourceInfo;
            },
            next() {
                if (this.active === 0) {
                    this.btnLoading = true;
                    // 进行字段列表解析
                    this.getFields();
                } else {
                    // 提取用户的配置
                    let fields = [];
                    try {
                        fields = this.$refs.table.items;
                    } catch (e) {
                        this.$store.dispatch('alert', {type: "error", content: '请检查json格式是否正确'});
                        return;
                    }
                    this.params.dimensionList = fields.filter(field => field.type === 'dimension')
                        .map(field => field.field);
                    this.params.metricList = fields.filter(field => field.type === 'metric')
                        .map(field => field.field);
                    // todo: 发送提交请求
                    console.log(this.params);
                    Datasource.add(this.params)
                        .then((resp) => {
                            this.$emit('add_over');
                            this.clear();
                        })

                }
            }
        }
    }

</script>