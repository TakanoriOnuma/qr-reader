<template lang="pug">
div
  .scanner(:style="{ width: `${$props.width}px`, height: `${$props.height}px` }")
    video.video(
      ref="videoElement"
      :width="$props.width"
      :height="$props.height"
    )
    canvas.canvas(
      ref="canvasElement"
      :width="$data.canvasSize.width"
      :height="$data.canvasSize.height"
    )
    .frame
      .frame__inner {{ $props.canScan ? 'QRコードを読み込んでください' : '' }}
</template>

<script>
import jsQR from 'jsqr';
import Vue from 'vue';
import VueTypes from 'vue-types';
const sleep = (number) => new Promise((resolve) => setTimeout(resolve, number));
const diff = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const sum = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
const multiply = (k) => (a) => ({ x: a.x * k, y: a.y * k });
const INTERVAL = 500;  // スキャンする間隔
const COOL_TIME_FOR_SAME_CODE_SCAN = 10000;  // 同じデータを読み取るまで最低限待つ時間

/**
 * 線を引く
 * @param canvas
 * @param begin
 * @param end
 */
function drawLine(canvas, begin, end) {
  const context = canvas.getContext('2d');
  context.beginPath();
  context.moveTo(begin.x, begin.y);
  context.lineTo(end.x, end.y);
  context.lineWidth = 5;
  context.strokeStyle = '#2dae68';
  context.stroke();
}

/**
 * 四角の四隅に印をつける
 * @param canvas - キャンバス
 * @param position - ポジション
 */
function drawCornerMark(canvas, position) {
  const { topLeft, topRight, bottomRight, bottomLeft } = position;
  const topDiff = diff(topRight, topLeft);
  const rightDiff = diff(bottomRight, topRight);
  const bottomDiff = diff(bottomLeft, bottomRight);
  const leftDiff = diff(topLeft, bottomLeft);
  const k = multiply(0.2);
  drawLine(canvas, topLeft, sum(topLeft, k(topDiff)));
  drawLine(canvas, topRight, sum(topRight, k(rightDiff)));
  drawLine(canvas, bottomRight, sum(bottomRight, k(bottomDiff)));
  drawLine(canvas, bottomLeft, sum(bottomLeft, k(leftDiff)));
  drawLine(canvas, topLeft, diff(topLeft, k(leftDiff)));
  drawLine(canvas, topRight, diff(topRight, k(topDiff)));
  drawLine(canvas, bottomRight, diff(bottomRight, k(rightDiff)));
  drawLine(canvas, bottomLeft, diff(bottomLeft, k(bottomDiff)));
}

export default Vue.extend({
  events: {
    /**
     * QRコードのスキャン
     * @param {string} code - スキャンされたコードの内容
     */
    scan: (code) => [code],
    /**
     * カメラ起動時のエラー
     * @param {Object} error
     */
    error: (error) => [error]
  },
  props: {
    /** スキャナを有効にするか */
    canScan: VueTypes.bool.def(true),
    /** 同じQRデータをスキャンを許可するか */
    canSameCodeScan: VueTypes.bool.def(false),
    /** スキャナ要素の幅 */
    width: VueTypes.number.def(375),
    /** スキャナ要素の高さ */
    height: VueTypes.number.def(375),
  },
  data() {
    // リアクティブではなくしてある
    this.internalCanvas = document.createElement('canvas');
    this.prevCode = {  // 1つ前のコード
      data: '',  // コードデータ
      scanTime: 0,  // スキャンした時間
    };
    return {
      canvasSize: {
        width: null,
        height: null
      }
    };
  },
  async mounted() {
    try {
      const { videoElement } = this.$refs;

      videoElement.srcObject = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment'
        }
      });
      videoElement.setAttribute('playsinline', 'true');
      videoElement.play();
    } catch (err) {
      this.$emits.error(err);
    }
    this.$watch(
      () => [this.$props.width, this.$props.height],
      (value) => {
        const [width, height] = value;
        this.setCanvasSize(width, height);
      }
    );
    window.requestAnimationFrame(this.waitForCode);
  },
  beforeDestroy() {
    const { videoElement } = this.$refs;
    if (videoElement.srcObject) {
      videoElement.srcObject.getVideoTracks()[0].stop();
    }
  },
  methods: {
    /**
     * canvasに描画する解像度を設定する（Webに表示するサイズはCSSで設定するが、canvasに描画するサイズはここで設定する）
     * @param width - 表示する画面の幅
     * @param height - 表示する画面の高さ
     */
    setCanvasSize(width, height) {
      const { videoElement } = this.$refs;
      // videoのデータが準備できていなかったら
      if (videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
        return;
      }
      // ビデオの解像度を見て、適切にキャンバスのサイズを設定する
      const { videoWidth, videoHeight } = videoElement;
      const videoRatio = videoHeight / videoWidth;
      const ratio = height / width;
      if (videoRatio >= ratio) {
        this.$data.canvasSize.width = this.internalCanvas.width = videoWidth;
        this.$data.canvasSize.height = this.internalCanvas.height = videoWidth * ratio;
      } else {
        this.$data.canvasSize.height = this.internalCanvas.height = videoHeight;
        this.$data.canvasSize.width = this.internalCanvas.width = videoHeight / ratio;
      }
    },
    /**
     * QRコードの読み取りを行う
     */
    async waitForCode() {
      const { videoElement } = this.$refs;
      const { canScan } = this.$props;
      const { canvasSize } = this.$data;
      // スキャン状態でなかったりvideoの表示ができていない場合は何もせず次のループにいく
      if (!canScan || !videoElement || videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
        await sleep(INTERVAL);
        window.requestAnimationFrame(this.waitForCode);
        return;
      }
      const { videoWidth, videoHeight } = videoElement;
      // キャンバスのサイズが指定されていない場合はセットする
      if (!canvasSize.width || !canvasSize.height) {
        this.setCanvasSize(this.$props.width, this.$props.height);
      }
      // 動画のデータをcanvasに書き出して画像化し、QRのチェックをする
      const context = this.internalCanvas.getContext('2d');
      context.drawImage(
        videoElement,
        // source
        (videoWidth - canvasSize.width) / 2,
        (videoHeight - canvasSize.height) / 2,
        canvasSize.width,
        canvasSize.height,
        // destination
        0,
        0,
        canvasSize.width,
        canvasSize.height
      );
      const imageData = context.getImageData(0, 0, canvasSize.width, canvasSize.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      // 以下の条件の時は何もせず次のスキャンを行う
      // ・qrCodeのデータがなかった
      // ・同じコードの読み込みを禁止しているときに一定時間は一つ前のデータと同じ時
      const scanTime = performance.now();
      if (
        !code ||
        (!this.$props.canSameCodeScan && scanTime - this.prevCode.scanTime < COOL_TIME_FOR_SAME_CODE_SCAN && code.data === this.prevCode.data)
      ) {
        await sleep(INTERVAL);
        window.requestAnimationFrame(this.waitForCode);
        return;
      }
      this.prevCode = {
        scanTime,
        data: code.data,
      };
      // 角にマークをつける
      const { canvasElement } = this.$refs;
      drawCornerMark(canvasElement, {
        topLeft: code.location.topLeftCorner,
        topRight: code.location.topRightCorner,
        bottomRight: code.location.bottomRightCorner,
        bottomLeft: code.location.bottomLeftCorner,
      });
      this.$emits.scan(code.data);
      // 一定時間待ってからQR読み込みを再開する
      await sleep(200);
      canvasElement.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
      window.requestAnimationFrame(this.waitForCode);
    },
  }
});
</script>

<style lang="scss" scoped>
.scanner {
  position: relative;
  overflow: hidden;
}

.video {
  display: block;
  object-fit: cover;
}

.canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 40px rgba(0, 0, 0, 0.5) solid;

  &__inner {
    color: #fff;
    font-size: 14px;
    text-align: center;
    margin: -40px;
    line-height: 40px;
  }
}
</style>
