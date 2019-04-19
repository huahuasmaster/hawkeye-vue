// https://vuex.vuejs.org/en/actions.html

export default {
    alert({commit}, props) {
        commit('doAlert', props);
        setTimeout(() => {
            commit('cancelAlert');
        }, 3000);
    }
}
