<template>
    <v-data-table
            :headers="headers"
            :items="items"
            hide-actions
            style="margin-right: 16px;margin-left: 16px"
    >
        <template
                slot="headerCell"
                slot-scope="{ header }"
        >
              <span
                      class="font-weight-light text-warning text--darken-3"
                      v-text="header.text"></span>
        </template>
        <template
                slot="items"
                slot-scope="{ index, item }"
        >
            <td>{{ item.field }}</td>
            <td>
                <v-select
                        v-model="item.type"
                        :items="types"
                        label="存储类型"
                        item-text="text"
                        item-value="value"
                ></v-select>
            </td>
        </template>
    </v-data-table>
</template>
<script>
    export default {
        props: ['fields'],
        watch: {
            fields(to, from) {
                // console.log('监听到参数变更');
                this.items = to;
            },
        },
        data() {
            return {
                headers: [
                    {
                        sortable: false,
                        text: '字段名',
                        value: 'field',
                        align: 'left'
                    },
                    {
                        sortable: false,
                        text: '存储类型',
                        value: 'type',
                        align: 'left'

                    },
                ],
                types: [
                    {
                        text: '维度',
                        value: 'dimension',
                    },
                    {
                        text: '指标',
                        value: 'metric'
                    },
                    {
                        text: '不存储',
                        value: null
                    }
                ],
                items:[],
            }
        },
        mounted() {
            this.items = this.fields;
        }
    }
</script>