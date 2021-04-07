/**
@函数式写法
    let $el = this.$vpopup({
        title: '标题',
        content: '<div style="padding:20px;">这里是内容</div>',
        btns: [
            {text: '取消'},
            {text: '更新', disabled: true},
            {
                text: '确认',
                style: 'color:#f60;',
                click: () => {
                    $el.close()
                }
            },
        ]
    });
    ##关闭弹窗
    $el.close();

@标签式写法
    <v-popup v-model="showAndroid1" type="android" shadeClose="false" xclose title="标题内容" z-index="2000"
        content="弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内"
        :btns="[
            {text: '知道了', click: () => showAndroid1=false},
            {text: '确定', style: 'color:#00e0a1;', click: handleInfo},
        ]"
    >
    </v-popup>
 */ 

import Vue from 'vue';
import VuePopup from './popup.vue';

let PopupConstructor = Vue.extend(VuePopup);

let $instance;

let VPopup = function(options = {}) {
    // 同一个页面中，id相同的Popup的DOM只会存在一个，不指定id时，id的默认值为nuxt-popup-id
    options.id = options.id || 'nuxt-popup-id';

    $instance = new PopupConstructor({
        propsData: options
    });

    $instance.vm = $instance.$mount();

    // 判断id是否存在
    let popupDom = document.querySelector('#' + options.id);
    if(options.id && popupDom) {
        popupDom.parentNode.replaceChild($instance.$el, popupDom);
    } else {
        document.body.appendChild($instance.$el);
    }

    Vue.nextTick(() => {
        $instance.value = true;
    })

    // 返回弹窗实例
    return $instance;
}

// 引入 Popup 组件后，会自动在 Vue 的 prototype 上挂载 $popup 方法，在所有组件内部都可以直接调用此方法。
// 引入 Popup 组件后，会自动在 Vue 中注册popup组件 <popup></popup>
VPopup.install = () => {
    Vue.prototype['$vpopup'] = VPopup;
    Vue.component('v-popup', VuePopup);
}

Vue.use(VPopup);

export default VPopup;