/**
 * Object.keysが使えない環境があるので自前で用意する
 * @param {Object} obj - オブジェクト
 * @returns {Array<String>} - objのキーリスト
 */
function keys(obj) {
  const _keys = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      _keys.push(key);
    }
  }
  return _keys;
}

export default {
  install: (Vue) => {
    Vue.mixin({
      beforeCreate() {
        // eventsオプションを設定していないものは何もしない
        const events = this.$options.events;
        if (!events) {
          return;
        }

        // コンポーネント情報
        const componentTag = this.$options._componentTag;
        const parentFileName = this.$options.parent.$options.__file;

        // イベントの設定
        const $emits = {};
        for (const key in events) {
          if (events.hasOwnProperty(key)) {
            $emits[key] = (...args) => {
              const emit = (typeof events[key] === 'function') ? events[key] : events[key].emit;
              // 引数の数があっているかチェック
              if (args.length !== emit.length) {
                // eslint-disable-next-line no-console
                console.warn(`<${componentTag}>: '${key}' event args list is not match!`);
              }
              this.$emit(key, ...emit(...args));
            };
          }
        }
        this.$emits = $emits;

        // listenerをきちんとセットしているかのチェック
        const listenerKeys = keys(this.$listeners);
        keys(events).forEach((key) => {
          const index = listenerKeys.indexOf(key);
          if (index >= 0) {
            listenerKeys.splice(index, 1);
          } else {
            const isOptional = typeof events[key] === 'object' && events[key].optional;
            // optionalでないものは警告を出す
            if (!isOptional) {
              // eslint-disable-next-line no-console
              console.warn(`${parentFileName}: <${componentTag}>'s '${key}' listener is not set.`);
            }
          }
        });
        listenerKeys.forEach((key) => {
          // eslint-disable-next-line no-console
          console.warn(`${parentFileName}: '${key}' is not <${componentTag}>'s listener name.`);
        });
      }
    });
  }
};
