// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';


const announcementBarContent = `正在施工中🚧`


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '烟雨夜灯。',
  tagline: '桃李春风一杯酒，江湖夜雨十年灯。',
  favicon: 'img/leyan_Logo.ico',
  
  
  // Set the production url of your site here
  url: 'https://rotleyan.site',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
     defaultLocale: 'zh-Hans',
     locales: ['en', 'zh-Hans'],
     localeConfigs: {
     'zh-Hans': {
     htmlLang: 'zh-Hans',
     },
     },
   },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Hustle28214/ROT-Blog/tree/main/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          
        },
        
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Hustle28214/ROT-Blog/tree/master/',
          feedOptions: {
              type: 'all',
              copyright: `Copyright © ${new Date().getFullYear()} Yanyuyedeng.`,
              createFeedItems: async (params) => {
                const {blogPosts, defaultCreateFeedItems, ...rest} = params;
                return defaultCreateFeedItems({
                  // keep only the 10 most recent blog posts in the feed
                  blogPosts: blogPosts.filter((item, index) => index < 10),
                  ...rest,
                });
              },
            },
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      imageZoom: {
        // CSS selector to apply the plugin to, defaults to '.markdown img'
        selector: '.markdown :not(em) > img',
        // Optional medium-zoom options
        // see: https://www.npmjs.com/package/medium-zoom#options
        options: {
          margin: 24,
          background: {
            light:'#FFFFFF',
            dark: '#222222'
          },
          scrollOffset: 0,
          //container: '#zoom-container',
          //template: '#zoom-template',
        },
      },// Set z-index:999 in custom.css to avoid conflict with TOC

    metadata: [
      {name: 'keywords', content: 'robot, computer, github, blog'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    giscus: {
      repo: 'Hustle28214/ROT-Blog',
      repoId: 'R_kgDOMh1MFg',
      category: 'General',
      categoryId: 'DIC_kwDOMh1MFs4Ch2s-',
      theme: 'light',
      darkTheme: 'dark',
    },// if you want to enable giscus, pls change "repo","repoId","categoryId" to yours
  
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        id: 'announcementBar-1',
        backgroundColor: '#B3E5FC',
        content: announcementBarContent,
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        
        logo: {
          alt: 'My Site Logo',
          src: 'img/leyan_Logo.svg',
        },
        items: [

           
          {to :'/', label: '🏠主页', position: 'right'},
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'right',
            label: '📘技术栈',
            
          },
          {to: '/blog', label: '📝随笔', position: 'right'},
          
          {
            to: '/intro', label: '✨关于', position: 'right'
          },
          {to: '/todolist', label: '📂待办', position: 'right'},
          {to: '/link', label: '🏄冲浪', position: 'right'},
          {
            href: 'https://github.com/Hustle28214',
            label: 'GitHub',
            position: 'right',
            src: 'img/githubBlur.svg',
            srcDark: 'img/githubDark.svg',
          },  

          {
            href: 'https://www.rotleyan.site/blog/rss.xml',
            label: 'RSS',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: '技术栈',
                to: '/docs/category/control',
              },
              {
                label: '随笔',
                to: '/blog',
              },
            ],
          },
          {
            title: 'License',
            items: [
              {
                html: `
              <a href="https://opensource.org/license/mit" target="_blank" rel="noreferrer noopener" aria-label="MIT License">
                <img src="https://github.com/user-attachments/assets/fd67ceaf-6b37-4108-ad65-d5027bef7cae" alt="MIT License" width="60" height="auto" />
              </a>
            `,
              },
              
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'CSDN',
                href: 'https://blog.csdn.net/hustle28214',
              },
              {
                label: 'CNBLOGS',
                href: 'https://www.cnblogs.com/xiaoyeah',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Hustle28214',
              },
            ],
          },
          {
            title: 'Contact',
            items: [
              {
                label: 'Email',
                href: 'mailto:hackitlilwave@outlook.com',
              },
             
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Yanyuyedeng | Built with <a href="https://docusaurus.io" target="_blank" rel="noopener noreferrer">Docusaurus</a> | Powered by <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer">Vercel</a>`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
