<h2 align="center">
烟雨夜灯的个人博客
Yan's Blog
</h2>
<p align="center">
www.rotleyan.site
</p>
<a href="https://vercel.com/new/clone?repository-url=https://github.com/Hustle28214/ROT-Blog/tree/main&project-name=ROTblog&repo-name=ROTblog" rel="nofollow"><img src="https://vercel.com/button"></a>
<a href="https://docusaurus.io/zh-CN/" target="_blank"><img  style="height:32px" src="https://github.com/user-attachments/assets/cfb3c49a-ed7a-408f-8947-9021dc776dbc" /><a/>

## 🤔Specials

👷‍♀ Built with Docusaurus+JavaScript+React.

🎬 (2024.08.11) Video: Depending on the self-made Videoplayer component, tutorials can embed videos inline (autoplay disabled).

📊 (2024.08.17) TOC Stats: The right-side TOC shows the word count and estimated reading time of the current article, plus the total word count of the whole site (served by the docs-stats plugin).

📝 (2024.08.20) Word Count: Depending on React, now we can count words of every single .mdx or.jsx.

🗨 (2024.08.23) Comment: Depending on Giscus, you can comment on my blog.

🗺 (2024.08.23) SEO: Upgrade SEO for searching in web.

🌏 (2024.08.23) i18n: Upgrade English and Zh-Hans language support. (🚧English support isn't completed. It is still updating) .

📂 (2024.08.27) TodoList: Upgrade todoList support. You can choose 3 types of todoList card.

🔗 (2024.08.27) Link: Upgrade Link support. Now we can add link as card in blog. Specially, you can add your favicon by iconSrc.(I tried writing a function to automatically retrieve the href of the favicon, but it didn't work as well as I expected. Therefore, you shall add the href by yourself.)

🔍 (2024.08.28) Search: Depending on [easyops-cn/docusaurus-search-local](https://github.com/easyops-cn/docusaurus-search-local), now full-text search is supported.

🍅 (2024.08.29) Tomato: Depending on react-circular-progressbar, we can create a tomato clock. Besides, we can dive into CHAN mode(Fullscreen supported). 

🌌 (2025.02.18) Landing: A Canvas starry-sky that follows your cursor, plus a framer-motion hero with tilt card, glowing button and a random "shh, she is..." message card.

👾 (2025.10.05) Projects: A desktop-file-manager-like project page with a Matrix code-rain background, 3-level folder navigation, video cards, and an editable README persisted in localStorage.

🧠 (2025.10.12) Skill Graph: A d3-force skill graph auto-generated from the `docs/` directory tree. Pan/zoom, filter by category, double-click a node to jump to its article. (🔎技能 in the navbar)

📈 (2026.07.16) Interactive Visualization: React + Canvas widgets inside articles, e.g. the covariance-matrix visualizer with live sliders used by the EKF notes.

🔬 (2026.10.09) Hardware Library & Pin2Pin: A third docs instance for electronic components. Write `pin2pin:` in the frontmatter and the plugin builds a **bidirectional** replacement index; `/hardware-and-silicon/pin2pin` gives you a searchable cross-reference table. (🔬元器件 / 🔁替代料 in the navbar)

🔍 (2026.10.17) Search Update: The local full-text search now indexes all three docs instances (`docs`, `leetcode-answer`, `hardware-and-silicon`) and the blog, with mixed `en`+`zh` tokenizers (jieba) so terms like STM32 stay searchable.


## 😉Install (npm)
```bash
git clone https://github.com/Hustle28214/ROT-Blog.git
cd ROT-Blog
## Plz use npm or yarn
npm install
npm run build
npm run start
```

> ⚠️ This site ships 1000+ articles across 3 docs instances, and the local full-text search index is built at compile time, so `npm run build` needs a bigger heap than Node's default 2 GB.
> The scripts already cover this (`--max-old-space-size=8192` + `DOCUSAURUS_SSG_CONCURRENCY=2`). If it still runs out of memory, use `npm run build:lowmem` (single-threaded, no minify).


## 📸Shot

<img width="1471" alt="Live Demo" src="https://github.com/user-attachments/assets/f59aef6b-88b9-4df0-907d-3f9efad2c1ff">

## 🧾License

[MIT](./LICENSE)
