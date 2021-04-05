<!-- //Popup弹出层演示 -->
<template>
    <div style="height:100%;">
        <div class="sec-demo">
            <div class="hd">DEMO演示（普通型弹窗）</div>
            <div class="cnt">
                <span @click="showMsg = true">msg提示</span>
                <span @click="showMsgBg = true">msg提示（黑色背景）</span>
                <span @click="showInfo = true">信息框</span>
                <span @click="showConfirm = true">询问框</span>
                <span @click="showMulityBtns = true">自定义多按钮</span>
                <span @click="showFooter = true">底部对话框</span>
                <span @click="showActionSheet = true">ActionSheet<br/><b>弹出式菜单</b></span>
                <span @click="showActionPicker = true">ActionSheetPicker<br/><b>仿微信picker</b></span>
                <span @click="showTop = true">顶部弹出</span>
                <span @click="showBottom = true">底部弹出</span>
                <span @click="showLeft = true">左侧弹出</span>
                <span @click="showRight = true">右侧弹出</span>
                <span @click="showToast = true">Toast弹窗</span>
            </div>
        </div>

        <div class="sec-demo">
            <div class="hd">DEMO演示（仿微信|android|ios弹窗）</div>
            <div class="cnt">
                <span @click="showIos1 = true">iso 样式一</span>
                <span @click="showIos2 = true">iso 样式二</span>
                <span @click="showAndroid1 = true">android 样式一</span>
                <span @click="showAndroid2 = true">android 样式二</span>
                <span @click="showAndroid3 = true">android 样式三</span>
            </div>
        </div>

        <div class="sec-demo">
            <div class="hd">DEMO演示（扩展功能）</div>
            <div class="cnt">
                <span @click="handleContextMenu1">长按弹窗一</span>
                <span @contextmenu.prevent="handleContextMenu2">长按弹窗二</span>
                <span @click="showComponent = true" style="width:95%;">组件调用</span>
            </div>
        </div>


        <!-- 演示模板///////////////////////////////////////////////////////////////////// -->
        <!-- msg提示 -->
        <v-popup v-model="showMsg" anim="fadeIn" content="msg提示框测试（3s后窗口关闭）" shadeClose="false" time="3" />

        <!-- msg提示（自定义背景） -->
        <v-popup v-model="showMsgBg" anim="footer" content="自定义背景颜色" shade="false" time="2" popup-style="background:rgba(0,0,0,.6);color:#fff;" />

        <!-- 信息框 -->
        <v-popup v-model="showInfo" anim="scaleIn"
            content="信息框（这里演示信息框功能效果，这里演示信息框功能效果，这里演示信息框功能效果）"
            :btns="[
                {text: '知道了', style: 'color:#999;', click: () => showInfo=false},
            ]"
        />

        <!-- 询问框 -->
        <v-popup v-model="showConfirm" shadeClose="false" title="警告信息" xclose z-index="2001"
            content="<div style='color:#00e0a1;padding:20px 40px;'>确认框（这里是确认框提示信息，这里确认框提示信息，这里是确认框提示信息）</div>"
            :btns="[
                {text: '取消', click: () => showConfirm=false},
                {text: '确定', style: 'color:#e63d23;', click: handleInfo},
            ]"
        />

        <!-- 自定义多按钮 -->
        <v-popup v-model="showMulityBtns" anim="fadeIn" title="<b style='color:red;'>系统更新</b>" :z-index="6666"
            content="<div style='padding:10px 35px;'>是否检查软件更新并下载最新的更新？通过移动网络下载可能产生额外的费用。如果可能，通过WLAN网络下载。</div>"
            :btns="[
                {text: '稍后提示', style: 'color:#01b9ff;', click: () => null},
                {text: '取消', style: 'color:#a9a9a9;', click: () => showMulityBtns=false},
                {text: '立即更新', style: 'color:#00e0a1;', click: handleInfo},
            ]"
        />

        <!-- 底部对话框 -->
        <v-popup v-model="showFooter" anim="footer" type="footer" :shadeClose="false" z-index="1001"
            content="确定删除该条数据吗？删除后可在7天之内恢复数据，超过7天后数据就无法恢复啦！"
            :btns="[
                {text: '恢复', style: 'color:#00e0a1;', click: handleInfo},
                {text: '删除', style: 'color:#ee0a24;', click: () => null},
                {text: '取消', style: 'color:#a9a9a9;', click: () => showFooter=false},
            ]"
        />

        <!-- ActionSheet底部弹出式菜单 -->
        <v-popup v-model="showActionSheet" anim="footer" type="actionsheet" :z-index="2020"
            content="弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内"
            :btns="[
                {text: '拍照', style: 'color:#09f;', disabled: true, click: handleInfo},
                {text: '从手机相册选择', style: 'color:#00e0a1;', click: handleInfo},
                {text: '保存图片', style: 'color:#e63d23;', click: () => null},
                {text: '取消', click: () => showActionSheet=false},
            ]"
        />

        <!-- ActionSheet底部弹出式菜单（仿微信weui-picker顶部按钮） -->
        <v-popup v-model="showActionPicker" anim="footer" type="actionsheetPicker" round title="标题内容"
            :btns="[
                {text: '取消', click: () => showActionPicker=false},
                {text: '确定', style: 'color:#00e0a1;', click: () => null},
            ]"
        >
            <!-- 自定义内容 -->
            <ul class="goods-list" style="padding:50px;text-align:center;">
                <li>双肩包</li>
                <li>鞋子</li>
                <li>运动裤</li>
            </ul>
        </v-popup>

        <!-- 顶部弹出（自定义页面） -->
        <v-popup v-model="showTop" position="top" time="2"
            content="这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容"
        >
        </v-popup>
        <v-popup v-model="showTop" position="top" time="5" content="通知内容" popupStyle="background:#00e0a1;color:#fff;" />

        <!-- 底部弹出（自定义页面） -->
        <v-popup v-model="showBottom" position="bottom" round xclose title="标题内容">
            <!-- 自定义内容 -->
            <ul class="goods-list" style="padding:50px;text-align:center;">
                <li>双肩包</li>
                <li>鞋子</li>
                <li>运动裤</li>
            </ul>
        </v-popup>

        <!-- 左侧弹出（自定义页面） -->
        <v-popup v-model="showLeft" position="left"
            content="这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容"
        />

        <!-- 右侧弹出（自定义页面） -->
        <v-popup v-model="showRight" position="right"
            content="这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容，这是自定义页面内容"
        />

        <!-- Toast弹窗 -->
        <v-popup v-model="showToast" type="toast" icon="loading" time="2" content="加载中..." />
        <!-- <v-popup v-model="showToast" type="toast" icon="success" shade="false" time="2" content="成功提示" /> -->
        <!-- <v-popup v-model="showToast" type="toast" icon="fail" shade="false" time="2" content="失败提示" /> -->

        <!-- /////////////////////////////////////////////////////////////////////// -->

        <!-- Ios样式1 -->
        <v-popup v-model="showIos1" type="ios" shadeClose="false" title="标题内容" z-index="1990"
            content="弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内"
            :btns="[
                {text: '知道了', click: () => showIos1=false},
                {text: '确定', style: 'color:#00e0a1;', click: handleInfo},
            ]"
        >
        </v-popup>

        <!-- Ios样式2（无标题） -->
        <v-popup v-model="showIos2" type="ios" anim="fadeIn"
            content="弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内"
            :btns="[
                {text: '知道了', style: 'color:#00e0a1;', click: () => showIos2=false},
            ]"
        >
        </v-popup>

        <!-- Android样式1 -->
        <v-popup v-model="showAndroid1" type="android" shadeClose="false" xclose title="标题内容" z-index="2000"
            content="弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内"
            :btns="[
                {text: '知道了', click: () => showAndroid1=false},
                {text: '确定', style: 'color:#00e0a1;', click: handleInfo},
            ]"
        >
        </v-popup>

        <!-- Android样式2（无标题） -->
        <v-popup v-model="showAndroid2" type="android"
            content="在设置-应用-权限中开启位置信息权限，为您推荐本地资讯"
            :btns="[
                {text: '取消', click: () => showAndroid2=false},
                {text: '去设置', disabled: btnDisabled, style: 'color:#00e0a1;', click: handleBtnDisabled},
            ]"
        >
        </v-popup>

        <!-- Android样式3 -->
        <v-popup v-model="showAndroid3" type="androidSheet" z-index="1111"
            :btns="[
                {text: '添加备注', style: 'color:#00e0a1;', click: handleInfo},
                {text: '设置分组', disabled: true,},
                {text: '删除', style: 'color:#e63d23;', click: () => showAndroid3=false},
            ]"
        >
        </v-popup>

        <!-- /////////////////////////////////////////////////////////////////////// -->

        <!-- 长按弹窗1 -->
        <v-popup v-model="showContextMenu1" type="contextmenu" :follow="follow1" opacity=".85"
            :btns="[
                {text: '标为未读', click: handleContextPopup},
                {text: '置顶聊天', style: 'color:#00e0a1;'},
                {text: '确定要删除该条信息吗？删除后不可恢复！', style: 'color:#09f;'},
                {text: '删除', style: 'color:#e63d23;', click: () => showContextMenu1=false},
            ]"
        >
        </v-popup>

        <!-- 长按弹窗2 -->
        <v-popup v-model="showContextMenu2" type="contextmenu" :follow="follow2" opacity="0"
            :btns="[
                {text: '标为未读', click: handleContextPopup},
                {text: '消息免打扰'},
                {text: '置顶聊天'},
                {text: '删除', click: () => showContextMenu2=false},
            ]"
        >
        </v-popup>

        <!-- 组件调用 -->
        <v-popup v-model="showComponent" xclose xposition="bottom" :shadeClose="false" content="这里是内容信息"
            :btns="[
                {text: '确认', style: 'color:#f60;', click: () => showComponent=false},
            ]"
            @open="handleOpen" @close="handleClose"
        >
            <template #content><b style="color:#00e0a1;">当 content 和 自定义插槽 内容同时存在，只显示插槽内容！！！</b></template>
            <!-- <div slot="content">自定义插槽内容！</div> -->
            <div style="padding:30px 15px;">
                <img src="https://img.yzcdn.cn/vant/apple-3.jpg" style="width:100%;" @click="handleContextPopup" />
            </div>
        </v-popup>

        <div style="color:#bbb;font-size:12px;text-align:center;padding: 200px 0 10px;">—— 分割线 ——</div>
    </div>
</template>

<script>
    // ***如果不在main.js中引入，也可以在页面单独引入
    // import Popup from './index'
    // 标签式调用：<v-popup ... />    函数式调用：this.$vpopup({...})或Popup({...})
    export default {
        data () {
            return {
                showMsg: false,
                showMsgBg: false,
                showInfo: false,
                showConfirm: false,
                showMulityBtns: false,
                showFooter: false,
                showActionSheet: false,
                showActionPicker: false,
                showTop: false,
                showBottom: false,
                showLeft: false,
                showRight: false,
                showToast: false,
                showIos1: false,
                showIos2: false,
                showAndroid1: false,
                showAndroid2: false,
                showAndroid3: false,
                showContextMenu1: false,
                showContextMenu2: false,
                showComponent: false,

                follow1: null,
                follow2: null,

                btnDisabled: false,
            }
        },
        components: {},
        methods: {
            handleBtnDisabled() {
                this.btnDisabled = true;
                this.$vpopup({
                    content: '正在设置中，请稍后...',
                    shadeClose: false,
                    anim: 'footer',
                    popupStyle: 'background:rgba(0,0,0,.6);color:#fff;',
                    opacity: .1,
                    time: 2,
                    onClose: () => {
                        this.btnDisabled = false;
                    }
                });
            },
            // 提示信息
            handleInfo() {
                /**
                 * 通过函数方式调用弹窗（ this.$vpopup({...}) ）
                 */
                // 返回当前弹窗实例，可以手动调用实例中的close方法关闭
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
                                // 动态更新内容
                                // $el.content = `<p style="color:red;padding:20px;">这里是动态更新内容！</p>`;
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
            handleOpen() {
                console.log('打开了！！');
            },
            handleClose() {
                console.log('关闭了！！');
            },

            // 长按弹窗1
            handleContextMenu1(e) {
                this.showContextMenu1 = true;
                let points = [e.clientX, e.clientY];
                this.follow1 = points;
            },
            handleContextMenu2(e) {
                this.showContextMenu2 = true;
                let points = [e.clientX, e.clientY];
                this.follow2 = points;
            },
            handleContextPopup(e) {
                let points = [e.clientX, e.clientY];
                let $ctx = this.$vpopup({
                    // title: '标题',
                    // content: '这里是内容信息，这里是内容信息',
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
        }
    }
</script>

<style>
.sec-demo{font-family:Helvetica;}
.sec-demo .hd{background: #00e0a1; color: #fff; font-size: 12px; font-weight: 700; padding: 9px 0; text-align: center;}
.sec-demo .cnt{display: flex; flex-wrap: wrap; justify-content: space-around; padding: 10px;}
.sec-demo .cnt span{background:#fff; border-radius: 2px; box-shadow: 0 1px 3px #90f3bf; color: #09d49b; font-size: 12px; margin-bottom: 8px; padding:3px 0; text-align: center; line-height: 18px; width: 45%;}
</style>