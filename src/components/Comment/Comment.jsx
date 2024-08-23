import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode, useThemeConfig } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Giscus from '@giscus/react';

const defaultConfig = {
  id: 'comments',
  mapping: 'title',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  lang: 'zh-CN',
  theme: 'light',
  darkTheme: 'dark_dimmed',
};

const Comment = () => {
  const themeConfig = useThemeConfig();
  const { i18n } = useDocusaurusContext();

  const giscus = { ...defaultConfig, ...themeConfig.giscus };

  if (!giscus.repo || !giscus.repoId || !giscus.categoryId) {
    throw new Error('You must provide `repo`, `repoId`, and `categoryId` to `themeConfig.giscus`.');
  }

  const { colorMode } = useColorMode();
  giscus.theme = colorMode === 'dark' ? giscus.darkTheme : giscus.theme;
  giscus.lang = i18n.currentLocale;

  return (
    <BrowserOnly fallback={<div>Loading Comments...</div>}>
      {() => <Giscus {...giscus} />}
    </BrowserOnly>
  );
};

export default Comment;