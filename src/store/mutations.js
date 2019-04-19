// https://vuex.vuejs.org/en/mutations.html

export default {
    info(state, content) {
        this.alert(state, {content, type: 'info'})
    },
    error(state, content) {
        this.alert(state, {content, type: 'error'})
    },
    success(state, content) {
        this.alert(state, {content, type: 'success'})
    },
    warning(state, content) {
        this.alert(state, {content, type: 'warning'})
    },
    doAlert(state, props) {
        // console.log(props);
        state.type = props.type;
        state.content = props.content;
        state.showAlert = true;
    },
    cancelAlert(state) {
        // console.log(props);
        state.content = '';
        state.showAlert = false;
    }
}
