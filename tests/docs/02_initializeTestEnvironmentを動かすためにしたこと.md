# initializeTestEnvironment を動かすためにしたこと

`rules-unit-testing` は、firestore のセキュリティルールの設定をテストするためのライブラリ  
テスト用の環境を利用するための `initializeTestEnvironment` の呼び出しで、エラーがたくさん出てかなり沼ったのでメモ  
結論としては、やるべきことは多くなかった

1. `projectId` の指定  
   `.env` から参照するようにしていたが、`undefined` になってしまってエラーするので方針を変える  
   自動テストに利用する設定は`tests/emulator/firebase.json` にまとめるようにして、  
   こちらに`projectId` のプロパティを追加する  
   設定の読み込みは、この json をインポートして行う

2. `firebase.rules` のパス指定  
   相対パスでそのまま記述してあると、CI で動かしたときや VSCode のエクステンション経由で動作させるときに参照できない  
   `path` モジュールを使って絶対パスの形式で指定する

```ts
/* tests/rules/firestore/utils.ts */

// テスト環境の設定ファイルにprojectId も記述しておく
import testEnvSettings from "../../emulator/firebase.json";

/* firestore.rules のパス */
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const firestoreRulesPath = `${__dirname}/../../emulator/firestore.rules`;

export const initializeTestEnvironment = async () => {
  testEnv = await _initializeTestEnvironment({
    // json に記述したprojectIdを利用する
    projectId: testEnvSettings.projectID,
    firestore: {
      // ↓ このパターンは実行の仕方によってはファイルが見つからない
      // rules: readFileSync('tests/emulator/firestore.rules', 'utf8'),
      rules: readFileSync(firestoreRulesPath, "utf8"),

      // port の指定も、json の設定から読み込み
      port: testEnvSettings.emulators.firestore.port,
      host: "127.0.0.1",
    },
  });
};
```
