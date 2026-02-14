# deno-batis

DDL駆動型 TDD 支援ツール for Deno + PostgreSQL (Neon)

------------------------------------------------------------------------

## 1. Purpose

DDLを唯一の真実(source of truth)とし、

-   CREATE TABLE から
-   最小限の CRUD テストを自動生成し
-   DB変更を即座に検知可能にする

ことを目的とする。

ORMではない。 クエリDSLでもない。 SQL中心思想を維持する。

------------------------------------------------------------------------

## 2. Core Principle

-   DDLが入力
-   ASTが内部表現
-   中間スキーマが生成源
-   生成物は常に再生成可能

------------------------------------------------------------------------

## 3. Architecture (v0)

### 3.1 DDL Parser

使用:

@supabase/pg-parser (WASM)

理由:

-   PostgreSQL公式parser由来
-   Deno対応
-   バージョン指定可能

使用バージョン:

PostgreSQL 16 (default)

処理:

1.  db/ddl/\*.sql を結合
2.  parse()
3.  ASTから CreateStmt のみ抽出
4.  中間スキーマJSONへ変換

------------------------------------------------------------------------

### 3.2 Internal Schema Model

中間表現:

    {
      tableName: string,
      columns: [
        {
          name: string,
          type: string,
          notNull: boolean,
          hasDefault: boolean
        }
      ],
      primaryKey: string | null
    }

制限:

-   単一主キーのみ対応
-   複合PK → 警告
-   FK → 無視（警告）
-   CHECK / INDEX → 無視

------------------------------------------------------------------------

### 3.3 File Structure

    .
    ├─ .env
    ├─ db/
    │  ├─ ddl/
    │  └─ schema.lock.json
    ├─ generated/
    │  ├─ crud/
    │  │  ├─ users.generated_test.ts
    │  │  └─ ...
    │  └─ _meta.json

------------------------------------------------------------------------

## 4. CLI

### build

    deno-batis build

処理:

1.  DDL読み込み
2.  AST解析
3.  スキーマ生成
4.  ハッシュ比較
5.  変更テーブルのみ再生成
6.  lock更新

出力例:

    users: regenerated
    orders: unchanged

生成ファイルは完全上書き。

------------------------------------------------------------------------

### test

    deno-batis test

内部的に:

    deno test generated/

------------------------------------------------------------------------

## 5. Generated CRUD Test (v0)

テーブルごとに:

-   insert
-   select by primary key
-   update
-   delete

前提:

-   PK必須（なければスキップ）
-   外部依存なし

テストは単一テーブル内で完結。

------------------------------------------------------------------------

## 6. Regeneration Rules

-   generated/ 以下は常に再生成可能
-   手編集禁止
-   DDL + config のハッシュを保存
-   差分がなければ何もしない

------------------------------------------------------------------------

## 7. Environment

.env 必須:

DATABASE_URL=

将来:

DATABASE_URL_TEST= NEON_BRANCH=

v0では未使用。

------------------------------------------------------------------------

## 8. Non-Goals (v0)

-   Migration管理
-   型生成
-   Query DSL
-   FK整合テスト
-   高度な制約検証
-   データfixture生成

------------------------------------------------------------------------

## 9. First Milestone

-   [ ] pg-parser統合
-   [ ] CreateStmt抽出
-   [ ] 中間スキーマ変換
-   [ ] CRUDテンプレート生成
-   [ ] build CLI
-   [ ] test CLI
