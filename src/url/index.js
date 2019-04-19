import axios from 'axios';

import store from '../store'

export const instance = axios.create({
    // axios 实例配置，如没有其他配置项，可以置空
});

// 错误拦截
instance.interceptors.response.use(
    (resp) => {
        // 判断是否正常
        // console.log(resp);
        if (resp.data.result === true) {
            return resp.data.data;
        } else {
            console.log("指明的错误");
            store.dispatch('alert', {type: "error", content: resp.data.errorMsg});
        }
    },
    error => {
        console.log('error');
        console.log(error);
        console.log(JSON.stringify(error));// No message available
        let status  = JSON.parse(JSON.stringify(error)).response.status;
        let message = status.message;
        // let code = status.
        let text = JSON.parse(JSON.stringify(error)).response.status === 404
            ? '访问的资源不存在'
            : message && message === 'No message available' ? "网络出错，请重试" : '服务器开小差了';
        store.dispatch('alert', {type: "error", content: text});
        return Promise.reject(error);

    }
);

export const Chart = {
    getViewByChart: (chartId, params) => instance.post(`/hawkeye/api/charts/${chartId}/data`, params, {}),
    add: (params) => instance.post(`/hawkeye/api/charts/`, params, {}),
};

export const Dashboard = {
    listChartsByDashboardId: (dashboardId) => instance.get(`/hawkeye/api/dashboards/${dashboardId}/charts`),
};

export const Datasource = {
    list: () => instance.get(`/hawkeye/api/datasources`),
    listFields: (params) => instance.get(`/hawkeye/api/datasources/fields`, {params}),
    add: (params) => instance.post('/hawkeye/api/datasources/', params, {}),

};