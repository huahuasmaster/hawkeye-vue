<template>
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


            <v-btn @click="submit" color="success">提交</v-btn>
            <v-btn @click="clear" color="error">重置</v-btn>
        </form>
</template>
<script>
    export default {
        data() {
            return {
                mysqlVO: {
                    database:'',
                    table: '',
                },
                params: {
                    type: '',
                    desc: '',
                    fieldList: [],
                    sourceInfo: {},
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
        }
    }

</script>