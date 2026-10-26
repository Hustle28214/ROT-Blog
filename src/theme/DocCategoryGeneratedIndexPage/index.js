import React from 'react';
import { PageMetadata } from '@docusaurus/theme-common';
import { useCurrentSidebarCategory } from '@docusaurus/plugin-content-docs/client';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

/**
 * 分类索引页：替换默认的 DocCardList 卡片墙，
 * 改为精细行式列表（标题为主、篇数为辅、细分割线、hover 左侧短线）。
 */

function countDocs(item) {
  if (item.type === 'category') {
    return item.items.reduce((sum, child) => sum + countDocs(child), 0);
  }
  return 1;
}

function CategoryRow({ item }) {
  const count = countDocs(item);
  return (
    <li className="catRow">
      <Link to={item.href} className="catRowLink">
        <span className="catRowBody">
          <span className="catRowTitle">{item.label}</span>
          {item.description && (
            <span className="catRowDesc">{item.description}</span>
          )}
        </span>
        <span className="catRowMeta mono">
          {count} 篇
          <svg
            className="catRowArrow"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </li>
  );
}

function DocCategoryGeneratedIndexPageMetadata({ categoryGeneratedIndex }) {
  return (
    <PageMetadata
      title={categoryGeneratedIndex.title}
      description={categoryGeneratedIndex.description}
      keywords={categoryGeneratedIndex.keywords}
      image={useBaseUrl(categoryGeneratedIndex.image)}
    />
  );
}

function DocCategoryGeneratedIndexPageContent({ categoryGeneratedIndex }) {
  const category = useCurrentSidebarCategory();
  return (
    <div className={styles.generatedIndexPage}>
      <DocVersionBanner />
      <DocBreadcrumbs />
      <DocVersionBadge />
      <header>
        <Heading as="h1" className={styles.title}>
          {categoryGeneratedIndex.title}
        </Heading>
        {categoryGeneratedIndex.description && (
          <p className="catIndexDesc">{categoryGeneratedIndex.description}</p>
        )}
      </header>
      <article className="catIndexArticle">
        <ul className="catIndexList">
          {category.items.map((item) => (
            <CategoryRow key={item.href ?? item.label} item={item} />
          ))}
        </ul>
      </article>
      <footer className="catIndexFooter">
        <DocPaginator
          previous={categoryGeneratedIndex.navigation.previous}
          next={categoryGeneratedIndex.navigation.next}
        />
      </footer>
    </div>
  );
}

export default function DocCategoryGeneratedIndexPage(props) {
  return (
    <>
      <DocCategoryGeneratedIndexPageMetadata {...props} />
      <DocCategoryGeneratedIndexPageContent {...props} />
    </>
  );
}
