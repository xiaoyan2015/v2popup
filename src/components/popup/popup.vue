<!-- //Popup 弹出层 -->
<!--
  @@Props
  v-model     当前组件是否显示
  title       标题
  content     内容（支持自定义插槽内容）
  type        弹窗类型（toast | footer | actionsheet | actionsheetPicker | android/ios）
  popupStyle  自定义弹窗样式
  icon        toast图标（loading | success | fail）
  shade       是否显示遮罩层
  shadeClose  是否点击遮罩时关闭弹窗
  opacity     遮罩层透明度
  round       是否显示圆角
  xclose      是否显示关闭图标
  xposition   关闭图标位置（left | right | top | bottom）
  xcolor      关闭图标颜色
  anim        弹窗动画（scaleIn | fadeIn | footer | fadeInUp | fadeInDown）
  position    弹出位置（top | right | bottom | left）
  follow      长按/右键弹窗（坐标点）
  time        弹窗自动关闭秒数（1、2、3）
  zIndex      弹窗层叠（默认8080）
  btns        弹窗按钮（参数：text|style|disabled|click）
  ------------------------------------------
  @@$emit
  open        打开弹出层时触发（@open="xxx"）
  close       关闭弹出层时触发（@close="xxx"）
  ------------------------------------------
  @@Event
  onOpen      打开弹窗回调
  onClose     关闭弹窗回调
-->
<template>
  <div v-show="opened" class="nuxt__popup" :class="{'nuxt__popup-closed': closeCls}" :id="id">
    <!-- //遮罩 -->
    <div v-if="JSON.parse(shade)" class="nuxt__overlay" @click="shadeClicked" :style="{opacity}"></div>
    <!-- //窗体 -->
    <div class="nuxt__wrap">
      <div class="nuxt__wrap-section">
        <div class="nuxt__wrap-child" :class="['anim-'+anim, type&&'popui__'+type, round&&'round', position]" :style="popupStyle">
          <div v-if="title" class="nuxt__wrap-tit" v-html="title"></div>
          <div v-if="type=='toast'&&icon" class="nuxt__toast-icon" :class="['nuxt__toast-'+icon]" v-html="toastIcon[icon]"></div>
          <!-- 判断 content插槽 是否存在 -->
          <template v-if="$slots.content">
            <div class="nuxt__wrap-cnt"><slot name="content" /></div>
          </template>
          <template v-else>
            <div v-if="content" class="nuxt__wrap-cnt" v-html="content"></div>
          </template>
          <slot />
          <div v-if="btns" class="nuxt__wrap-btns">
            <span v-for="(btn,index) in btns" :key="index" class="btn" :class="{'btn-disabled': btn.disabled}" :style="btn.style" @click="btnClicked($event,index)" v-html="btn.text"></span>
          </div>
          <span v-if="xclose" class="nuxt__xclose" :class="xposition" :style="{'color': xcolor}" @click="close"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 弹窗索引，遮罩次数，定时器
  let $index = 0, $lockCount = 0, $timer = {};
  export default {
    props: {
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
      /*
      btns: {
        type: Array,
        default: () => [
          {
            text: '取消',
            style: 'color:#999;',
            click: null
          },
          {
            text: '确定',
            style: 'color:red;font-size:14px;',
            click: null
          },
        ]
      }
      */
      onOpen: { type: Function, default: null },
      onClose: { type: Function, default: null },
    },
    data() {
      return {
        opened: false,
        closeCls: '',
        toastIcon: {
          loading: '<svg viewBox="25 25 50 50"><circle fill="none" cx="50" cy="50" r="20"></circle></svg>',
          success: '<svg viewBox="0 0 1024 1024"><path fill="none" d="M75.712 445.712l240.176 185.52s13.248 6.624 29.808 0l591.36-493.872s84.272-17.968 68.64 71.488c-57.04 57.968-638.464 617.856-638.464 617.856s-38.096 21.536-74.544 0C256.272 790.256 12.816 523.568 12.816 523.568s-6.672-64.592 62.896-77.856z"/></svg>',
          fail: '<svg viewBox="0 0 1024 1024"><path fill="none" d="M450.602 665.598a62.464 62.464 0 0 0 122.88 0l40.96-563.198A102.615 102.615 0 0 0 512.042 0a105.256 105.256 0 0 0-102.4 112.64l40.96 552.958zm61.44 153.6a102.4 102.4 0 1 0 102.4 102.4 96.74 96.74 0 0 0-102.4-102.4z"/></svg>',
        }
      }
    },
    watch: {
      value(val) {
        const type = val ? 'open' : 'close';
        this[type]();
      },
    },
    methods: {
      // 打开弹窗
      open() {
        if(this.opened) return;
        this.opened = true;
        this.$emit('open');
        typeof this.onOpen === 'function' && this.onOpen();
        this.$el.style.zIndex = this.getZIndex() + 1;

        // JSON.parse('false') 转换字符串'false'为false
        if(JSON.parse(this.shade)) {
          if(!$lockCount) {
            document.body.classList.add('nt-overflow-hidden');
          }
          $lockCount++;
        }
        
        // 倒计时关闭
        if(this.time) {
          $index++;
          // 防止重复点击
          if($timer[$index] !== null) clearTimeout($timer[$index])
          $timer[$index] = setTimeout(() => {
            this.close();
          }, parseInt(this.time) * 1000);
        }

        // 长按/右键弹窗
        if(this.follow) {
          // 避免获取不到弹窗宽高
          this.$nextTick(() => {
            let obj = this.$el.querySelector('.nuxt__wrap-child');
            let oW, oH, winW, winH, pos;

            oW = obj.clientWidth;
            oH = obj.clientHeight;
            winW = window.innerWidth;
            winH = window.innerHeight;
            pos = this.getPos(this.follow[0], this.follow[1], oW, oH, winW, winH);

            obj.style.left = pos[0] + 'px';
            obj.style.top = pos[1] + 'px';
          });
        }
      },
      // 关闭弹窗
      close() {
        if(!this.opened) return;
        
        this.closeCls = true;
        setTimeout(() => {
          this.opened = false;
          this.closeCls = false;
          if(JSON.parse(this.shade)) {
            $lockCount--;
            if(!$lockCount) {
              document.body.classList.remove('nt-overflow-hidden');
            }
          }
          if(this.time) {
            $index--;
          }
          this.$emit('input', false);
          this.$emit('close');
          typeof this.onClose === 'function' && this.onClose();
        }, 200);
      },

      // 点击遮罩层
      shadeClicked() {
        if(JSON.parse(this.shadeClose)) {
          this.close();
        }
      },
      // 按钮事件
      btnClicked(e, index) {
        let btn = this.btns[index];
        if(!btn.disabled) {
          typeof btn.click === 'function' && btn.click(e)
        }
      },
      // 获取弹窗层级
      getZIndex() {
        for(var $idx = parseInt(this.zIndex), $el = document.getElementsByTagName('*'), i = 0, len = $el.length; i < len; i++)
          $idx = Math.max($idx, $el[i].style.zIndex)
        return $idx;
      },
      // 获取弹窗坐标点
      getPos(x, y, ow, oh, winW, winH) {
        let l = (x + ow) > winW ? x - ow : x;
        let t = (y + oh) > winH ? y - oh : y;
        return [l, t];
      }
    },
  }
</script>

<style>
/**
	popup.css v1.0 styleSheet（2020-09-14）
*/
body.nt-overflow-hidden{overflow-y: hidden!important; touch-action:none;}
.nuxt__popup{position: relative;}
.nuxt__popup *{font-style: normal; list-style: none;}
.nuxt__overlay {background: black;opacity: .6;pointer-events: auto;height: 100%;width: 100%;position: fixed;top: 0;left: 0;z-index: inherit; animation: mask-fadeIn .5s;}
@keyframes mask-fadeIn {0% {opacity: 0;}}
.nuxt__wrap{display: table; color:#1f1f1f; font-family: "PingFang SC","Helvetica Neue",Helvetica,Arial,sans-serif; pointer-events: none; height: 100%; width: 100%; position: fixed; left: 0; top: 0; z-index: inherit;}
.nuxt__wrap .nuxt__wrap-section{display: table-cell; vertical-align: middle; text-align: center;}
.nuxt__wrap-child{background: #fff; border-radius: 2px; display: inline-block; pointer-events: auto; font-size: 14px; text-align: left; max-width: 300px; position: relative;}
.nuxt__wrap-tit{color:#1f1f1f; font-size: 14px; padding: 7px 20px; text-align: center;}
.nuxt__wrap-cnt{padding: 12px 15px; text-align: center; line-height: 1.3; word-wrap: break-word; word-break: break-all;}
.nuxt__wrap-btns{
	display: flex; align-items: center; line-height: 48px; position: relative;
	-webkit-touch-callout:none; -webkit-user-select:none; -moz-user-select:none; user-select:none;
}
.nuxt__wrap-btns:after{content: ''; border-top: 1px solid #d5d5d5; color:#d5d5d5; height:1px; position: absolute; left: 0; right: 0; top: 0; z-index:5; transform:scaleY(.5);-webkit-transform:scaleY(.5);transform-origin:0 0;-webkit-transform-origin:0 0;}
.nuxt__wrap-btns .btn{color:#1f1f1f;cursor: pointer; display: block; flex: 1; font-size: 14px; text-align: center; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); position: relative; z-index: 3; transition:background .3s;}
.nuxt__wrap-btns .btn:active{background: #e5e5e5;}
.nuxt__wrap-btns .btn.btn-disabled {color: #d5d5d5!important; cursor: not-allowed;}
.nuxt__wrap-btns .btn.btn-disabled:active {background: none;}
.nuxt__wrap-btns .btn:after{content:"";border-left:1px solid #d5d5d5;color:#d5d5d5; width:1px; position:absolute;top:0;bottom:0;left:0; transform:scaleX(.5);-webkit-transform:scaleX(.5);transform-origin:0 0;-webkit-transform-origin:0 0;}
.nuxt__wrap-btns .btn:first-child:after{display:none;}
.nuxt__wrap-btns .btn:first-child{border-bottom-left-radius: 2px;}
.nuxt__wrap-btns .btn:last-child{border-bottom-right-radius: 2px;}
/* 关闭按钮 */
.nuxt__xclose{display: flex; align-items: center; justify-content: center; height: 30px; width: 30px; position: absolute; top: 0; right: 0; z-index: 1001;}
.nuxt__xclose.left {left: 0; right: auto;}
.nuxt__xclose.top {background: #fff; border-radius: 50%; top: -40px; right: 50%; transform: translateX(50%);}
.nuxt__xclose.bottom {background: #fff; border-radius: 50%; top: auto; bottom: -40px; right: 50%; transform: translateX(50%);}
.nuxt__xclose:after{content:'\2715'; color: inherit;font-size:16px; font-family: 'Segoe UI'; line-height: 1;}
/* ———— 关闭动画效果 */
.nuxt__popup-closed .nuxt__overlay{animation: anim-fadeOut .3s;}
.nuxt__popup-closed .nuxt__wrap-child{animation: anim-fadeOut .3s;}
.nuxt__popup-closed .popui__footer, .nuxt__popup-closed .popui__actionsheet, .nuxt__popup-closed .popui__actionsheetPicker{animation: anim-fadeOutUp .3s;}
.nuxt__popup-closed .anim-scaleIn{animation: anim-ScaleOut .3s;}
.nuxt__popup-closed .anim-fadeInDownBig, .nuxt__popup-closed .nuxt__wrap-child.top{animation: anim-fadeOutUpBig .3s!important;}
.nuxt__popup-closed .anim-fadeInRightBig, .nuxt__popup-closed .nuxt__wrap-child.right{animation: anim-fadeOutLeftBig .3s!important;}
.nuxt__popup-closed .anim-fadeInUpBig, .nuxt__popup-closed .nuxt__wrap-child.bottom{animation: anim-fadeOutDownBig .3s!important;}
.nuxt__popup-closed .anim-fadeInLeftBig, .nuxt__popup-closed .nuxt__wrap-child.left{animation: anim-fadeOutRightBig .3s!important;}


/* __ 自定义样式 */
/* 样式1（toast） */
.popui__toast{
  display:-webkit-box; display:-webkit-flex; display:flex; display:-ms-flexbox; align-items: center; justify-content: center;
  background: rgba(17,17,17,.7); border-radius:4px; color: #fff; box-sizing: content-box; margin: 0 auto; padding: 15px; min-height: 90px; width: 90px;
  -webkit-box-direction: normal;-moz-box-direction: normal;-webkit-box-orient: vertical;-moz-box-orient: vertical;-webkit-flex-direction: column;-ms-flex-direction: column;flex-direction: column;
}
.popui__toast .nuxt__wrap-cnt{padding: 0;}
.popui__toast .nuxt__toast-icon{display: inline-block; color: #fff; margin-bottom: 10px; height: 32px; width: 32px; position: relative;}
.popui__toast .nuxt__toast-icon svg{display: block; height: 100%; width: 100%;}
.popui__toast .nuxt__toast-icon svg path{fill: currentColor;}
.popui__toast .nuxt__toast-loading{animation:anim__rotate 2s linear infinite;}
.popui__toast .nuxt__toast-loading circle{stroke: currentColor; stroke-width: 3; stroke-linecap: round; animation: anim__circular 1.5s ease-in-out infinite;}
/* 样式2（footer底部弹出） */
.popui__footer{background: 0 0; margin:0 auto; max-width: 100%; position: fixed; left: 0; right: 0; bottom: 10px; width: 95%;}
.popui__footer .nuxt__wrap-cnt{background-color: rgba(255,255,255,.9); border-radius: 6px 6px 0 0; padding: 15px 10px;}
.popui__footer .nuxt__wrap-btns{display: block;}
.popui__footer .nuxt__wrap-btns:after{display:none;}
.popui__footer .nuxt__wrap-btns .btn{background: rgba(255,255,255,.9); border-radius:0;}
.popui__footer .nuxt__wrap-btns .btn:active{background:#d5d5d5;}
.popui__footer .nuxt__wrap-btns .btn:after{display: none;}
.popui__footer .nuxt__wrap-btns .btn:before{content: ''; border-top: 1px solid #c5c5c5; color:#c5c5c5; height:1px; position: absolute; left: 0; right: 0; top: 0; z-index:5; transform:scaleY(.5);-webkit-transform:scaleY(.5);transform-origin:0 0;-webkit-transform-origin:0 0;}
.popui__footer .nuxt__wrap-btns .btn:last-child:before{display: none;}
.popui__footer .nuxt__wrap-btns:first-child .btn:first-child{border-radius:6px 6px 0 0;}
.popui__footer .nuxt__wrap-btns:first-child .btn:first-child:before{display:none;}
.popui__footer .nuxt__wrap-btns .btn:nth-last-child(2){border-radius: 0 0 6px 6px;}
.popui__footer .nuxt__wrap-btns .btn:nth-last-child(1){border-radius: 6px; margin-top: 10px;}
/* 样式3（actionsheet底部弹出式菜单） */
.popui__actionsheet{border-radius: 0; margin:0 auto; max-width: 100%; position: fixed; left: 0; right: 0; bottom: 0; width: 100%;}
.popui__actionsheet.round{border-radius: 10px 10px 0 0;}
.popui__actionsheet .nuxt__wrap-cnt{padding: 15px 10px;}
.popui__actionsheet .nuxt__wrap-btns{display: block;}
.popui__actionsheet .nuxt__wrap-btns:after{display: none;}
.popui__actionsheet .nuxt__wrap-btns .btn:after{display: none;}
.popui__actionsheet .nuxt__wrap-btns .btn:before{content: ''; border-top: 1px solid #d5d5d5; color:#d5d5d5; height:1px; position: absolute; left: 0; right: 0; top: 0; z-index:5; transform:scaleY(.5);-webkit-transform:scaleY(.5);transform-origin:0 0;-webkit-transform-origin:0 0;}
.popui__actionsheet .nuxt__wrap-btns .btn:nth-last-child(1){border-top: 8px solid #f5f5f5; border-bottom-right-radius: 0;}
.popui__actionsheet .nuxt__wrap-btns .btn:nth-last-child(1):before {display: none;}
/* 样式4（actionsheet底部弹出式菜单【仿微信weui-picker顶部按钮】） */
.popui__actionsheetPicker{border-radius: 0; margin:0 auto; max-width: 100%; position: fixed; left: 0; right: 0; bottom: 0; width: 100%;}
.popui__actionsheetPicker.round{border-radius: 10px 10px 0 0;}
.popui__actionsheetPicker .nuxt__wrap-tit{font-size:16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 0 70px;line-height:48px;}
.popui__actionsheetPicker .nuxt__wrap-cnt{padding: 15px 20px; text-align:left;}
.popui__actionsheetPicker .nuxt__wrap-btns{display:block;width:100%; position:absolute;left:0;top:0;}
.popui__actionsheetPicker .nuxt__wrap-btns:after{display:none;}
.popui__actionsheetPicker .nuxt__wrap-btns .btn{border-radius:0;display:inline-block;padding:0 20px;text-align:left;}
.popui__actionsheetPicker .nuxt__wrap-btns .btn:active {background: none; opacity: .7;}
.popui__actionsheetPicker .nuxt__wrap-btns .btn:last-child{float:right;}
.popui__actionsheetPicker .nuxt__wrap-btns .btn:last-child:after{display:none;}
/* 样式5（ios、android） */
.nuxt__popup-closed .popui__ios, .nuxt__popup-closed .popui__android, .nuxt__popup-closed .popui__androidSheet{animation: anim-ScaleOut .3s;}
.popui__ios{width: 80%;}
.popui__ios .nuxt__wrap-tit{font-size:16px; padding: 20px 25px 10px;}
.popui__ios .nuxt__wrap-cnt{color:#808080; padding: 0 25px 15px; min-height:40px;}
.popui__ios .nuxt__wrap-cnt:first-child{color:#1f1f1f; padding: 40px 20px 25px;}
.popui__ios .nuxt__wrap-btns .btn{font-size: 14px;}
.popui__android{width: 80%;}
.popui__android .nuxt__wrap-tit{font-size:18px; padding: 20px 25px 10px; text-align: left;}
.popui__android .nuxt__wrap-cnt{color:#808080; font-size: 15px; padding: 5px 25px 35px; text-align: left; min-height:40px;}
.popui__android .nuxt__wrap-cnt:first-child{color:#1f1f1f; padding: 25px 25px 35px;}
.popui__android .nuxt__wrap-btns{display: block; padding: 0 25px 15px; text-align: right; line-height: 30px;}
.popui__android .nuxt__wrap-btns:after{display: none;}
.popui__android .nuxt__wrap-btns .btn{border-radius:2px; font-size: 14px; display: inline-block; vertical-align: top; padding: 0 15px;}
.popui__android .nuxt__wrap-btns .btn:after{display: none;}
.popui__android .nuxt__wrap-btns .btn:first-child{color: #808080;}
.popui__android .nuxt__wrap-btns .btn:last-child{margin-right: -10px;}
.popui__androidSheet{width: 80%;}
.popui__androidSheet .nuxt__wrap-tit{font-size:21px; padding: 15px 20px 5px; text-align: left;}
.popui__androidSheet .nuxt__wrap-cnt{color:#808080; font-size: 17px; padding: 0 20px 15px; text-align: left;}
.popui__androidSheet .nuxt__wrap-cnt:first-child{color:#1f1f1f; padding: 15px 20px 5px;}
.popui__androidSheet .nuxt__wrap-btns{display: block;}
.popui__androidSheet .nuxt__wrap-btns:after{display: none;}
.popui__androidSheet .nuxt__wrap-btns .btn{border-radius:0; font-size: 14px; padding: 0 20px; text-align: left;}
.popui__androidSheet .nuxt__wrap-btns .btn:first-child{border-top-left-radius:2px;border-top-right-radius:2px;}
.popui__androidSheet .nuxt__wrap-btns .btn:last-child{border-bottom-left-radius:2px;border-bottom-right-radius:2px;}
.popui__androidSheet .nuxt__wrap-btns .btn:before{content: ''; border-top: 1px solid #e5e5e5; color:#e5e5e5; height:1px; position: absolute; left: 0; right: 0; top: 0; transform:scaleY(.5);-webkit-transform:scaleY(.5);transform-origin:0 0;-webkit-transform-origin:0 0;}
.popui__androidSheet .nuxt__wrap-btns .btn:first-child:before{display: none;}
.popui__androidSheet .nuxt__wrap-btns .btn:after{display: none;}
/* 样式6（右键菜单） */
.popui__contextmenu{box-shadow: 0 0 12px rgba(0,0,0,.15); max-width: 200px; position:absolute;}
.popui__contextmenu .nuxt__wrap-tit{font-size:18px; padding:15px 20px 5px; text-align:left;}
.popui__contextmenu .nuxt__wrap-cnt{color:#808080; font-size:15px; padding:0 20px 15px; text-align:left;}
.popui__contextmenu .nuxt__wrap-cnt:first-child{color:#1f1f1f; padding:15px 20px 5px;}
.popui__contextmenu .nuxt__wrap-btns{display:block;}
.popui__contextmenu .nuxt__wrap-btns:after{display:none;}
.popui__contextmenu .nuxt__wrap-btns .btn{border-radius:0; display:flex; align-items:center; font-size:14px; padding:0 20px; text-align:left; height:45px; line-height:18px;}
.popui__contextmenu .nuxt__wrap-btns .btn:first-child{border-radius:2px 2px 0 0;}
.popui__contextmenu .nuxt__wrap-btns .btn:last-child{border-radius:0 0 2px 2px;}
.popui__contextmenu .nuxt__wrap-btns .btn:after{display:none;}


/* __ 弹窗动画 */
.anim-fadeIn{animation: anim-fadeIn .5s;}
.anim-scaleIn{animation: anim-scaleIn .3s;}
.anim-fadeInUp{animation: anim-fadeInUp .3s;}
.anim-fadeInDown{animation: anim-fadeInDown .3s;}
.anim-fadeOutUp{animation: anim-fadeOut .3s;}
.anim-fadeOut{animation: anim-fadeOut .3s;}
.anim-ScaleOut{animation: anim-ScaleOut .3s;}
.anim-footer{animation: anim-footer .3s;}
/* 全屏显示动画(上、右、下、左) */
.anim-fadeInDownBig{animation: anim-fadeInDownBig .3s;}
.anim-fadeInRightBig{animation: anim-fadeInRightBig .3s;}
.anim-fadeInUpBig{animation: anim-fadeInUpBig .3s;}
.anim-fadeInLeftBig{animation: anim-fadeInLeftBig .3s;}
/* position优先级高于自定义动画（如果定义了position则会覆盖掉其他动画） */
.nuxt__wrap-child.top,
.nuxt__wrap-child.right,
.nuxt__wrap-child.bottom,
.nuxt__wrap-child.left{
	border-radius: 0; margin:0 auto; max-width: 100%; position: fixed; left: 0; right: 0; bottom: 0; width: 100%;
}
.nuxt__wrap-child.top{top:0;bottom:auto; animation: anim-fadeInDownBig .3s;}
.nuxt__wrap-child.top.round{border-radius: 0 0 10px 10px;}
.nuxt__wrap-child.right{top:0;left:auto; width:80%; animation: anim-fadeInRightBig .3s;}
.nuxt__wrap-child.right.round{border-radius: 10px 0 0 10px;}
.nuxt__wrap-child.bottom{animation: anim-fadeInUpBig .3s;}
.nuxt__wrap-child.bottom.round{border-radius: 10px 10px 0 0;}
.nuxt__wrap-child.left{top:0;right:auto; width:80%; animation: anim-fadeInLeftBig .3s;}
.nuxt__wrap-child.left.round{border-radius: 0 10px 10px 0;}

/* 渐变 */
@keyframes anim-fadeIn {
	0% {opacity: 0;}
	100% {opacity: 1;}
}
/* 缩放 */
@keyframes anim-scaleIn {
	0% {opacity: 0; transform: scale(.9);}
	100% {opacity: 1; transform: scale(1);}
}
/* 由上向下打开 */
@keyframes anim-fadeInUp {
	0% {opacity: 0; transform: translateY(-100%);}
	100% {opacity: 1; transform: translateY(0);}
}
/* 由下向上打开 */
@keyframes anim-fadeInDown {
	0% {opacity: 0; transform: translateY(100%);}
	100% {opacity: 1; transform: translateY(0);}
}
/* 由上向下渐变关闭 */
@keyframes anim-fadeOutUp {
	100% {opacity: 0; transform: translateY(100%);}
}
/* 渐变缩小关闭 */
@keyframes anim-fadeOut {
	100% {opacity: 0;}
}
/* 渐变缩小关闭 */
@keyframes anim-ScaleOut {
	100% {opacity: 0;-webkit-transform: scale(.9);transform: scale(.9);}
}
/* 底部向上弹出 */
@keyframes anim-footer {
	0% {opacity: 0; transform: translateY(800px)}
	100% {opacity: 1; transform: translateY(0);}
}
@keyframes anim__rotate {
  from {transform: rotate(0); -webkit-transform: rotate(0);}
  to {transform: rotate(360deg); -webkit-transform: rotate(360deg);}
}
@keyframes anim__circular {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120;
  }
}

/* 显示动画(上、右、下、左) */
/* 上->下(显示) */
@keyframes anim-fadeInDownBig {
	0% {opacity: 0; -webkit-transform: translate3d(0, -100%, 0); transform: translate3d(0, -100%, 0);}
	100% {opacity: 1; -webkit-transform: none; transform: none;}
}
/* 下->上(隐藏) */
@keyframes anim-fadeOutUpBig {
	0% {opacity: 1;}
	100% {opacity: 0; -webkit-transform: translate3d(0, -100%, 0); transform: translate3d(0, -100%, 0);}
}

/* 右->左(显示) */
@keyframes anim-fadeInRightBig {
	0% {opacity: 0; -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0);}
	100% {opacity: 1; -webkit-transform: none; transform: none;}
}
/* 左->右(隐藏) */
@keyframes anim-fadeOutLeftBig {
	0% {opacity: 1;}
	100% {opacity: 0; -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0);}
}

/* 下->上(显示) */
@keyframes anim-fadeInUpBig {
	0% {opacity: 0; -webkit-transform: translate3d(0, 100%, 0); transform: translate3d(0, 100%, 0);}
	100% {opacity: 1; -webkit-transform: none; transform: none;}
}
/* 上->下(隐藏) */
@keyframes anim-fadeOutDownBig {
	0% {opacity: 1;}
	100% {opacity: 0; -webkit-transform: translate3d(0, 100%, 0); transform: translate3d(0, 100%, 0);}
}

/* 左->右(显示) */
@keyframes anim-fadeInLeftBig {
	0% {opacity: 0; -webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0);}
	100% {opacity: 1; -webkit-transform: none; transform: none;}
}
/* 右->左(隐藏) */
@keyframes anim-fadeOutRightBig {
	0% {opacity: 1;}
	100% {opacity: 0; -webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0);}
}
</style>