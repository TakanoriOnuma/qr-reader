(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{147:function(t,e,n){var content=n(151);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(53).default)("253e6eda",content,!0,{sourceMap:!1})},148:function(t,e,n){var content=n(153);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(53).default)("034a184c",content,!0,{sourceMap:!1})},150:function(t,e,n){"use strict";var r=n(147);n.n(r).a},151:function(t,e,n){(t.exports=n(52)(!1)).push([t.i,".scanner[data-v-70a8de72]{position:relative;overflow:hidden}.video[data-v-70a8de72]{display:block;-o-object-fit:cover;object-fit:cover}.canvas[data-v-70a8de72],.frame[data-v-70a8de72]{position:absolute;top:0;left:0;width:100%;height:100%}.frame[data-v-70a8de72]{box-sizing:border-box;border:40px solid rgba(0,0,0,.5)}.frame__inner[data-v-70a8de72]{color:#fff;font-size:14px;text-align:center;margin:-40px;line-height:40px}",""])},152:function(t,e,n){"use strict";var r=n(148);n.n(r).a},153:function(t,e,n){(t.exports=n(52)(!1)).push([t.i,".container[data-v-18fb2e70]{width:100%;max-width:375px;margin:0 auto}.container__scanner[data-v-18fb2e70]{display:flex;justify-content:center}.qrdata[data-v-18fb2e70]{word-wrap:break-word}",""])},156:function(t,e,n){"use strict";n.r(e);var r=n(36),o=(n(25),n(5)),c=(n(15),n(149)),d=n.n(c),h=n(0),v=n(154),f=function(t){return new Promise(function(e){return setTimeout(e,t)})},l=function(a,b){return{x:a.x-b.x,y:a.y-b.y}},m=function(a,b){return{x:a.x+b.x,y:a.y+b.y}},w=function(t){return function(a){return{x:a.x*t,y:a.y*t}}};function x(canvas,t,e){var n=canvas.getContext("2d");n.beginPath(),n.moveTo(t.x,t.y),n.lineTo(e.x,e.y),n.lineWidth=5,n.strokeStyle="#2dae68",n.stroke()}var C,$,_=h.a.extend({events:{scan:function(code){return[code]},error:function(t){return[t]}},props:{canScan:v.a.bool.def(!0),canSameCodeScan:v.a.bool.def(!1),width:v.a.number.def(375),height:v.a.number.def(375)},data:function(){return this.internalCanvas=document.createElement("canvas"),this.prevCode={data:"",scanTime:0},{canvasSize:{width:null,height:null}}},mounted:($=Object(o.a)(regeneratorRuntime.mark(function t(){var e,n=this;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,e=this.$refs.videoElement,t.next=4,navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:"environment"}});case 4:e.srcObject=t.sent,e.setAttribute("playsinline","true"),e.play(),t.next=12;break;case 9:t.prev=9,t.t0=t.catch(0),this.$emits.error(t.t0);case 12:this.$watch(function(){return[n.$props.width,n.$props.height]},function(t){var e=Object(r.a)(t,2),o=e[0],c=e[1];n.setCanvasSize(o,c)}),window.requestAnimationFrame(this.waitForCode);case 14:case"end":return t.stop()}},t,this,[[0,9]])})),function(){return $.apply(this,arguments)}),beforeDestroy:function(){var t=this.$refs.videoElement;t.srcObject&&t.srcObject.getVideoTracks()[0].stop()},methods:{setCanvasSize:function(t,e){var n=this.$refs.videoElement;if(n.readyState===n.HAVE_ENOUGH_DATA){var r=n.videoWidth,o=n.videoHeight,c=e/t;o/r>=c?(this.$data.canvasSize.width=this.internalCanvas.width=r,this.$data.canvasSize.height=this.internalCanvas.height=r*c):(this.$data.canvasSize.height=this.internalCanvas.height=o,this.$data.canvasSize.width=this.internalCanvas.width=o/c)}},waitForCode:(C=Object(o.a)(regeneratorRuntime.mark(function t(){var e,n,r,o,c,h,v,code,C,$;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(e=this.$refs.videoElement,n=this.$props.canScan,r=this.$data.canvasSize,n&&e&&e.readyState===e.HAVE_ENOUGH_DATA){t.next=8;break}return t.next=6,f(500);case 6:return window.requestAnimationFrame(this.waitForCode),t.abrupt("return");case 8:if(o=e.videoWidth,c=e.videoHeight,r.width&&r.height||this.setCanvasSize(this.$props.width,this.$props.height),(h=this.internalCanvas.getContext("2d")).drawImage(e,(o-r.width)/2,(c-r.height)/2,r.width,r.height,0,0,r.width,r.height),v=h.getImageData(0,0,r.width,r.height),code=d()(v.data,v.width,v.height,{inversionAttempts:"dontInvert"}),C=performance.now(),!(!code||!this.$props.canSameCodeScan&&C-this.prevCode.scanTime<1e4&&code.data===this.prevCode.data)){t.next=20;break}return t.next=18,f(500);case 18:return window.requestAnimationFrame(this.waitForCode),t.abrupt("return");case 20:return this.prevCode={scanTime:C,data:code.data},$=this.$refs.canvasElement,canvas=$,_={topLeft:code.location.topLeftCorner,topRight:code.location.topRightCorner,bottomRight:code.location.bottomRightCorner,bottomLeft:code.location.bottomLeftCorner},S=void 0,y=void 0,R=void 0,E=void 0,k=void 0,z=void 0,A=void 0,j=void 0,D=void 0,S=_.topLeft,y=_.topRight,R=_.bottomRight,E=_.bottomLeft,k=l(y,S),z=l(R,y),A=l(E,R),j=l(S,E),D=w(.2),x(canvas,S,m(S,D(k))),x(canvas,y,m(y,D(z))),x(canvas,R,m(R,D(A))),x(canvas,E,m(E,D(j))),x(canvas,S,l(S,D(j))),x(canvas,y,l(y,D(k))),x(canvas,R,l(R,D(z))),x(canvas,E,l(E,D(A))),this.$emits.scan(code.data),t.next=26,f(200);case 26:$.getContext("2d").clearRect(0,0,r.width,r.height),window.requestAnimationFrame(this.waitForCode);case 28:case"end":return t.stop()}var canvas,_,S,y,R,E,k,z,A,j,D},t,this)})),function(){return C.apply(this,arguments)})}}),S=(n(150),n(23)),y={components:{Scanner:Object(S.a)(_,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"scanner",style:{width:t.$props.width+"px",height:t.$props.height+"px"}},[n("video",{ref:"videoElement",staticClass:"video",attrs:{width:t.$props.width,height:t.$props.height}}),n("canvas",{ref:"canvasElement",staticClass:"canvas",attrs:{width:t.$data.canvasSize.width,height:t.$data.canvasSize.height}}),n("div",{staticClass:"frame"},[n("div",{staticClass:"frame__inner"},[t._v(t._s(t.$props.canScan?"QRコードを読み込んでください":""))])])])])},[],!1,null,"70a8de72",null).exports},data:function(){return{qrData:""}},computed:{_isURL:function(){return/^https?:\/\//.test(this.$data.qrData)}},methods:{onScan:function(code){this.$data.qrData=code}}},R=(n(152),Object(S.a)(y,function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("div",{staticClass:"container"},[n("div",{staticClass:"container__scanner"},[n("Scanner",{on:{scan:t.onScan,error:function(t){}}})],1),n("div",{staticClass:"coninter__result"},[n("p",[t._v("QRデータ")]),n("div",{staticClass:"qrdata"},[t._isURL?[n("a",{attrs:{href:t.$data.qrData,target:"_blank"}},[t._v(t._s(t.$data.qrData))])]:[n("span",[t._v(t._s(t.$data.qrData))])]],2)])])])},[],!1,null,"18fb2e70",null));e.default=R.exports}}]);