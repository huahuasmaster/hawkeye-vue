<template>
    <div>
        <ve-line :data="chartData" :colors="colors"></ve-line>
        <VariablePanel></VariablePanel>
        <MyDatetimePicker :label="'开始时间'" :default-date="new Date().valueOf()" v-on:pick_datetime="params => log(params)"></MyDatetimePicker>
        <VariableTable :fields="items" ref="table"></VariableTable>
        <v-btn block color="success" @click="getItems">提取数据</v-btn>
        <PreviewDataTable></PreviewDataTable>
    </div>
</template>

<script>
    import VariablePanel from '../components/material/VariablePanel'
    import MyDatetimePicker from '../components/material/MyDatetimePicker';
    import VariableTable from '../components/material/VariableTable'
    import PreviewDataTable from '../components/material/PreviewDataTable'

    export default {
        components: {VariableTable, VariablePanel, MyDatetimePicker,PreviewDataTable},
        data: function () {
            return {
                colors: [
                    '#4caf50',
                    '#82B1FF',
                    '#f55a4e',

                    '#495057',
                ],
                chartData: {
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
                items: [
                    {
                        name:'book_id',
                        type:'dimension'
                    },
                    {
                        name:'amount',
                        type:'metric'
                    }
                ]
            }
        },
        methods: {
            log(item) {
                console.log(item);
            },
            getItems() {
                let items = this.$refs.table.items;
                console.log(items);
            }
        }
    }
</script>