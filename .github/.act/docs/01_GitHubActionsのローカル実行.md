# GitHubActions のローカル実行

act を利用する
https://github.com/nektos/act

## セットアップ

### 1. act インストール

brew などもあったが、もっとも汎用性高そうなスクリプトでのインストールを実行

```bash
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### 2. GITHUB_TOKEN の設定

ワークフロー実行中に認証を行うための機構  
GitHub のサーバー上では自動で値がセットされるが、ローカルの場合は値がない  
代わりに Personal Access Token をセットする  
act 実行時に `--secret-file <ファイルパス>` の形式で設定する  
今回は `.github/.act/secrets` に設定  
PAT は機密情報なので、リポジトリに公開しないように注意

※ ワークフロー中で認証が必要な機能を利用しない場合、指定する必要はない

```secrets
# ローカル実行時にはGITHUB_TOKENのシークレット値が自動セットされないので、Personal Access Tokenを渡す必要がある
# 以下のURLからPATを作成して設定する
# https://github.com/settings/tokens
GITHUB_TOKEN=github_pat_********************************************************************
```

## 実行

`act <発火させるイベント名> --secret-file <ファイルパス>`

```bash
# workflow_dispatch をフックに実行されるワークフローをすべて行う
$ act workflow_dispatch --secret-file ./github/.act/secrets

# -j でジョブを指定して実行することもできる
$ act workflow_dispatch --secret-file ./github/.act/secrets -j security_rules_test
```
