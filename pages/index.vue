<template lang="pug">
div
  .container
    .container__scanner
      Scanner(
        @scan="onScan"
        @error=""
      )
    .coninter__result
      p QRデータ
      .qrdata
        template(v-if="_isURL")
          a(:href="$data.qrData", target="_blank") {{ $data.qrData }}
        template(v-else)
          span {{ $data.qrData }}
</template>

<script>
import Scanner from '~/components/Scanner.vue';

export default {
  components: {
    Scanner
  },
  data() {
    return {
      qrData: '',
    };
  },
  computed: {
    // qrDataがURLなのか算出
    _isURL() {
      return /^https?:\/\//.test(this.$data.qrData);
    }
  },
  methods: {
    /**
     * スキャン時
     * @param {string} code - QRデータ
     */
    onScan(code) {
      this.$data.qrData = code;
    },
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  max-width: 375px;
  margin: 0 auto;

  &__scanner {
    display: flex;
    justify-content: center;
  }
}

.qrdata {
  word-wrap: break-word;
}
</style>
