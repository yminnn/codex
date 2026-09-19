# Woordje

面向中文学习者的 A1–B1 荷兰语单词学习器，包含单词卡、浏览器发音、测试、收藏和学习进度。

## 在线发布

项目已配置 GitHub Pages 自动部署。将仓库推送到 GitHub 后：

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 下将 **Source** 设为 **GitHub Actions**。
3. 打开 **Actions**，运行 **Deploy Woordje to GitHub Pages**；推送到 `main` 或 `work` 分支也会自动运行。
4. 部署完成后，在工作流的 `deploy` 任务或仓库 **Settings → Pages** 中复制公开网址。

公开网址通常为：

```text
https://<你的-GitHub-用户名>.github.io/<仓库名>/
```

## 本地打开

可以直接双击 `index.html`，或在项目目录运行：

```bash
python3 -m http.server 4173
```

然后打开 <http://localhost:4173>。
