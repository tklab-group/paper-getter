# PAPER GETTER

dblpから論文データを取ってきてタイトル, 著者, urlをtsvとして出力

## usage

1. クローンしてパッケージをインストール

```
$ git clone git@github.com:gihachi/paper-getter.git
$ cd paper-getter
$ npm install 
```

2. config/venue.jsに会議名とdblpでのvenue名のmapを作る

書き方はファイルを参照. dblpのvenue名は特殊な場合があるので注意.(fseなど)

3. プログラムを動かす

```
$ node app.js <会議名> <年>
```

論文情報が見つかった場合は`output/<会議名>-<年>.tsv`にタイトル, 著者, urlの情報が出力される
