type UnitTypeDefinition = {
  name: string;
};

type GroupTypeLabels = {
  n: string;
  p: string;
};

type GroupUnitTypeDefinition = UnitTypeDefinition & {
  gty: GroupTypeLabels;
};

const UNIT_TYPE_LABELS = {
  mg: { en: "manager job group", ja: "マネージャージョブグループ" },
  n: { en: "jobnet", ja: "ジョブネット" },
  rn: { en: "jobnet for recovery", ja: "リカバリージョブネット" },
  rm: { en: "remote jobnet", ja: "リモートジョブネット" },
  rr: {
    en: "remote jobnet for recovery",
    ja: "リカバリーリモートジョブネット",
  },
  rc: { en: "start conditions", ja: "起動条件" },
  mn: { en: "manager jobnet", ja: "マネージャージョブネット" },
  j: { en: "Unix job", ja: "UNIXジョブ" },
  rj: { en: "Unix job for recovery", ja: "リカバリーUNIXジョブ" },
  pj: { en: "PC job", ja: "PCジョブ" },
  rp: { en: "PC job for recovery", ja: "リカバリーPCジョブ" },
  qj: { en: "QUEUE job", ja: "QUEUEジョブ" },
  rq: { en: "QUEUE job for recovery", ja: "リカバリーQUEUEジョブ" },
  jdj: { en: "judgment job", ja: "判定ジョブ" },
  rjdj: {
    en: "judgment job for recovery",
    ja: "リカバリー判定ジョブ",
  },
  orj: { en: "OR job", ja: "ORジョブ" },
  rorj: { en: "OR job for recovery", ja: "リカバリーORジョブ" },
  evwj: {
    en: "JP1 event reception monitoring job",
    ja: "JP1イベント受信監視ジョブ",
  },
  revwj: {
    en: "JP1 event reception monitoring job for recovery",
    ja: "リカバリーJP1イベント受信監視ジョブ",
  },
  flwj: { en: "file monitoring job", ja: "ファイル監視ジョブ" },
  rflwj: {
    en: "file monitoring job for recovery",
    ja: "リカバリーファイル監視ジョブ",
  },
  mlwj: {
    en: "email reception monitoring job",
    ja: "メール受信監視ジョブ",
  },
  rmlwj: {
    en: "email reception monitoring job for recovery",
    ja: "リカバリーメール受信監視ジョブ",
  },
  mqwj: {
    en: "message queue reception monitoring job",
    ja: " メッセージキュー受信監視ジョブ",
  },
  rmqwj: {
    en: "message queue reception monitoring job for recovery",
    ja: "リカバリーメッセージキュー受信監視ジョブ",
  },
  mswj: {
    en: "MSMQ reception monitoring job",
    ja: "MSMQ受信監視ジョブ",
  },
  rmswj: {
    en: "MSMQ reception monitoring job for recovery",
    ja: "リカバリーMSMQ受信監視ジョブ",
  },
  lfwj: {
    en: "log file monitoring job",
    ja: "ログファイル監視ジョブ",
  },
  rlfwj: {
    en: "log file monitoring job for recovery",
    ja: "リカバリーログファイル監視ジョブ",
  },
  ntwj: {
    en: "Windows event-log monitoring job",
    ja: "Windowsイベントログ監視ジョブ",
  },
  rntwj: {
    en: "Windows event-log monitoring job for recovery",
    ja: "リカバリーWindowsイベントログ監視ジョブ",
  },
  tmwj: {
    en: "execution-interval control job",
    ja: "実行間隔制御ジョブ",
  },
  rtmwj: {
    en: "execution-interval control job for recovery",
    ja: "リカバリー実行間隔制御ジョブ",
  },
  evsj: {
    en: "JP1 event sending job",
    ja: "JP1イベント送信ジョブ",
  },
  revsj: {
    en: "JP1 event sending job for recovery",
    ja: "リカバリーJP1イベント送信ジョブ",
  },
  mlsj: { en: "email sending job", ja: "メール送信ジョブ" },
  rmlsj: {
    en: "email sending job for recovery",
    ja: "リカバリーメール送信ジョブ",
  },
  mqsj: {
    en: "message queue sending job",
    ja: "メッセージキュー送信ジョブ",
  },
  rmqsj: {
    en: "message queue sending job for recovery",
    ja: "リカバリーメッセージキュー送信ジョブ",
  },
  mssj: { en: "MSMQ sending job", ja: "MSMQ送信ジョブ" },
  rmssj: {
    en: "MSMQ sending job for recovery",
    ja: "リカバリーMSMQ送信ジョブ",
  },
  cmsj: {
    en: "OpenView Status Report job",
    ja: "JP1/Cm2状態通知ジョブ",
  },
  rcmsj: {
    en: "OpenView Status Report job for recovery",
    ja: "リカバリーJP1/Cm2状態通知ジョブ",
  },
  pwlj: {
    en: "local power control job",
    ja: "ローカル電源制御ジョブ",
  },
  rpwlj: {
    en: "local power control job for recovery",
    ja: "リカバリーローカル電源制御ジョブ",
  },
  pwrj: {
    en: "remote power control job",
    ja: "リモート電源制御ジョブ",
  },
  rpwrj: {
    en: "remote power control job for recovery",
    ja: "リカバリーリモート電源制御ジョブ",
  },
  cj: { en: "custom Unix job", ja: "カスタムUNIXジョブ" },
  rcj: {
    en: "custom Unix job for recovery",
    ja: "リカバリーカスタムUNIXジョブ",
  },
  cpj: { en: "custom PC job", ja: "カスタムPCジョブ" },
  rcpj: {
    en: "custom PC job for recovery",
    ja: "リカバリーカスタムPCジョブ",
  },
  fxj: { en: "flexible job", ja: "フレキシブルジョブ" },
  rfxj: {
    en: "flexible job for recovery",
    ja: "リカバリーフレキシブルジョブ",
  },
  htpj: { en: "HTTP Connection job", ja: "HTTP接続ジョブ" },
  rhtpj: {
    en: "HTTP Connection job for recovery",
    ja: "リカバリーHTTP接続ジョブ",
  },
  nc: { en: "jobnet connector", ja: "ジョブネットコネクタ" },
} as const;

type UnitTypeLabelKey = keyof typeof UNIT_TYPE_LABELS;
type UnitTypeLanguage = "en" | "ja";
export type UnitTypeDefinitions = Record<
  UnitTypeLabelKey,
  UnitTypeDefinition
> & {
  g: GroupUnitTypeDefinition;
};

const localizedUnitTypeDefinition = (
  labels: (typeof UNIT_TYPE_LABELS)[UnitTypeLabelKey],
  language: UnitTypeLanguage,
): UnitTypeDefinition => ({
  name: labels[language],
});

const buildUnitTypeDefinitions = (
  language: UnitTypeLanguage,
  groupName: string,
  groupTypeLabels: GroupTypeLabels,
): UnitTypeDefinitions => ({
  g: {
    name: groupName,
    gty: groupTypeLabels,
  },
  ...(Object.fromEntries(
    Object.entries(UNIT_TYPE_LABELS).map(([unitType, labels]) => [
      unitType,
      localizedUnitTypeDefinition(labels, language),
    ]),
  ) as Record<UnitTypeLabelKey, UnitTypeDefinition>),
});

export const en = buildUnitTypeDefinitions("en", "job {planning} group", {
  n: "job group",
  p: "planning group",
});

export const ja = buildUnitTypeDefinitions(
  "ja",
  "{ジョブ|プランニング}グループ",
  {
    n: "ジョブグループ",
    p: "プランニンググループ",
  },
);
