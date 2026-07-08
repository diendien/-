# 動工單導航系統 - PWA 外殼

這是「動工單導航系統」的 PWA 包裝殼，讓手機可以把系統加到桌面當作一個獨立 App 使用。

## 檔案說明
- `index.html`：主要的 iframe 包裝頁面，內嵌 Google Apps Script 部署的系統網址
- `manifest.json`：PWA 設定檔（App 名稱、圖示、啟動模式）
- `sw.js`：Service Worker，負責離線快取
- `app-icon.png`：App 桌面圖示

## 注意事項
- 若 Google Apps Script 重新部署產生新網址，需同步更新 `index.html` 裡 iframe 的 `src`
- 修改任何檔案後，記得將 `sw.js` 裡的 `CACHE_NAME` 版本號 +1，否則使用者手機會吃到舊快取
