export const ja = {
  sd: {
    syntax:
      "[N,]{[[yyyy/]mm/]{[+|*|@]dd|[+|*|@]b[-DD]|[+]{su|mo|tu|we|th|fr|sa} [:{n|b}]}|en|ud}",
    en: "登録日",
    "": "絶対日",
    "+": "相対日",
    "*": "運用日",
    "@": "休業日",
    ud: "不定期",
  },
  sh: {
    syntax: "[N,]{be|af|ca|no}",
    be: "前振り替え",
    af: "後振り替え",
    ca: "実行しない",
    no: "実行する",
  },
  st: {
    syntax: "[N,][+]hh:mm",
    "+": "相対時間",
    "": "絶対時間",
  },
};
