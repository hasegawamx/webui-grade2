// ============================================
// テーマ変更（ボタンを押すたびに色を切り替える）
// ============================================

// 用意してある4つのテーマ。色の組み合わせを配列にまとめている。
const themes = [
  { name: 'coffee', main: '#78350F', accent: '#F59E0B', bg: '#FFFBEB' },
  { name: 'forest', main: '#15803D', accent: '#F97316', bg: '#F0FDF4' },
  { name: 'sunset', main: '#DB2777', accent: '#7C3AED', bg: '#FDF2F8' },
  { name: 'ocean',  main: '#0369A1', accent: '#FBBF24', bg: '#F0F9FF' },
];

// 今、何番目のテーマを使っているかを覚えておく変数
let themeIndex = 0;

// ボタンが押されたときに呼ばれる関数
function toggleTheme() {
  // 次のテーマ番号にする（最後までいったら 0 に戻る）
  themeIndex = (themeIndex + 1) % themes.length;

  // 今のテーマを取り出す
  const theme = themes[themeIndex];

  // CSS変数（--main-color など）を上書きして、ページ全体の色を変える
  document.documentElement.style.setProperty('--main-color', theme.main);
  document.documentElement.style.setProperty('--accent-color', theme.accent);
  document.documentElement.style.setProperty('--bg-color', theme.bg);
}


// ============================================
// 席の予約（フォームの内容をチェックしてメッセージを出す）
// ============================================
function reserve() {
  // 入力欄の中身を取り出す
  const name = document.getElementById('guestName').value;
  const count = document.getElementById('guestCount').value;

  // 結果を表示する場所
  const result = document.getElementById('reserveResult');

  // 名前か人数が空だったら、注意メッセージを出して終了
  if (name === '' || count === '') {
    result.textContent = '⚠ お名前と人数を入力してください';
    return;
  }

  // 完成したメッセージを画面に表示
  result.textContent = `✓ ご予約ありがとうございます、${name}様。${count}名様で承りました。`;
}


// ============================================
// 今日のおすすめ（メニューからランダムで1つ選ぶ）
// ============================================
function pickRecommend() {
  // 候補のメニュー一覧
  const items = [
    '本日のコーヒー',
    'カフェラテ',
    'チーズケーキ',
    'カプチーノ',
    '抹茶ラテ',
    'プレーンスコーン',
  ];

  // 0 〜 (items.length - 1) の中からランダムに番号を選ぶ
  const i = Math.floor(Math.random() * items.length);

  // 選ばれたメニューを画面に表示
  document.getElementById('recommendResult').textContent = ` ${items[i]} `;
}
