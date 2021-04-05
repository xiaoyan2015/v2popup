<p align="center">
    <img src="https://vuejs.org/images/logo.png" width="120" />
</p>

<h1 align="center">V2Popup</h1>

<p align="center">轻量级的移动端 Vue2.x 弹层组件</p>

<p align="center">
    <a href="https://www.npmjs.com/package/v-tooltip"><img src="https://img.shields.io/npm/v/v-tooltip.svg"/></a>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/vue-2.x-brightgreen.svg?style=flat-square"/></a>
    <img src="https://img.badgesize.io/https://unpkg.com/vant/lib/vant.min.js?compression=gzip&style=flat-square&label=gzip%20size&color=#4fc08d" />
</p>

---

### 介绍
V2Popup 一款基于 `vue2.x` 构建的mobile端/微信端弹框组件。

### 特性
- 提供 `20+` 种参数配置
- 组件压缩后体积不到 `10kb`
- 支持 `组件式` + `函数式` 两种调用方式

### 安装
```bash
# 安装依赖
npm i v2popup -S
```

### 引入组件
```js
import Vue from 'vue'

// 引入弹框组件
import V2Popup from 'v2popup'
Vue.use(V2Popup)
```

### 快速上手
***1. 组件式调用***
```html
<!-- msg提示 -->
<v-popup v-model="showMsg" anim="fadeIn" content="msg提示框" shadeClose="false" time="3" />

<!-- 信息框 -->
<v-popup v-model="showInfo" anim="scaleIn" content="信息框提示信息"
    :btns="[
        {text: '知道了', style: 'color:#999;', click: () => showInfo=false},
    ]"
/>

<!-- 询问框 -->
<v-popup v-model="showConfirm" shadeClose="false" xclose z-index="2001"
    title="标题"
    content="<p style='color:#00e0a1;padding:20px;'>确认框提示信息</p>"
    :btns="[
        {text: '取消', click: () => showConfirm=false},
        {text: '确定', style: 'color:#e63d23;', click: handleOK},
    ]"
/>
```
```js
export default {
    data () {
        return {
            showMsg: false,
            showInfo: false,
            showConfirm: false,
            // ...
        }
    },
    methods: {
            handleOK() {
                /**
                 * 通过函数方式调用弹窗（ this.$vpopup({...}) ）
                 */
                let $el = this.$vpopup({
                    title: '标题',
                    content: `<div style="padding:20px;">
                        <p>通过Vue挂载，函数式调用弹窗。</p>
                        <p style="color:#999;">this.$vpopup({...})</p>
                    </div>`,
                    btns: [
                        {
                            text: '取消',
                            click: () => {
                                // 关闭弹窗
                                $el.close();
                            }
                        },
                        {
                            text: '确认',
                            style: 'color:#09f;',
                            click: () => {
                                this.$vpopup({
                                    id: 'nuxt-popup-loading', //设置ID
                                    type: 'toast',
                                    icon: 'loading',
                                    content: '加载中...',
                                    opacity: .2,
                                    time: 2,
                                })
                            }
                        },
                    ],
                    onOpen() {
                        console.log('is opend！')
                    },
                    onClose: () => {
                        console.log('is closed！')
                    }
                })
            },
        }
}
```

***2. 函数式调用***
注册组件的时候，已经在 Vue 的 `prototype` 上挂载 `$popup` 方法。
```js
// toast弱提示
handleToast() {
    this.$vpopup({
        id: 'vToast', // 设置弹框唯一标识
        type: 'toast',
        icon: 'loading', // loading | success | fail
        content: '数据加载中...',
        opacity: .2, // 遮罩层透明度
        time: 2,
    })
}

// 右键/长按菜单
handleContextMenu(e) {
    let points = [e.clientX, e.clientY];
    let $ctx = this.$vpopup({
        type: 'contextmenu',
        follow: points,
        opacity: 0,
        btns: [
            {text: '标记商品信息'},
            {
                text: '删除',
                style: 'color:#f00;',
                click: () => {
                    // 关闭
                    $ctx.close();
                }
            },
        ],
    })
}
```

### API
***Props***
The default global options are:
```js
{
    // 标识符，相同者共享一个实例
    id: {
    type: String, default: ''
    },
    // 接收父组件中v-model的值
    value: { type: Boolean, default: false },
    title: String,
    content: String,
    type: String,
    popupStyle: String,
    icon: String,
    shade: { type: [Boolean, String], default: true },
    shadeClose: { type: [Boolean, String], default: true },
    opacity: { type: [Number, String], default: '' },
    round: Boolean,
    xclose: Boolean,
    xposition: { type: String, default: 'right' },
    xcolor: { type: String, default: '#333' },
    anim: { type: String, default: 'scaleIn' },
    position: String,
    follow: { type: Array, default: null },
    time: { type: [Number, String], default: 0 },
    zIndex: { type: [Number, String], default: '8080' },
    btns: {
    type: Array, default: null
    },
    onOpen: { type: Function, default: null },
    onClose: { type: Function, default: null },
},
```

***Emits***
| 参数 | 说明 | 类型 | 使用
| --- | --- | --- | ---
| open | 打开弹出层时触发 | Function | 组件式调用 `@open="xxx"`
| close | 关闭弹出层时触发 | Function | 组件式调用 `@close="xxx"`

***Events***
| 参数 | 说明 | 类型 | 默认值
| --- | --- | --- | ---
| onOpen | 打开弹框回调函数 | Function | 函数式调用 `onOpen() {...}`
| onClose | 关闭弹框回调函数 | Function | 函数式调用 `onClose() {...}`