import React, { useEffect, useState } from 'react';
import { useColorMode, useThemeConfig } from '@docusaurus/theme-common';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import styles from './styles.module.css';

const SunIcon = () => (
  <svg viewBox="0 0 24 24" className={clsx(styles.icon, styles.sun)}>
    <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" fill="currentColor" />
    <path d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" className={clsx(styles.icon, styles.moon)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="none" />
  </svg>
);

export default function NavbarColorModeToggle({ className }) {
  const navbarStyle = useThemeConfig().navbar.style;
  const disabled = useThemeConfig().colorMode.disableSwitch;
  const { colorMode, setColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (disabled) {
    return null;
  }

  // 避免 SSR 水合不匹配
  if (!mounted) {
    return (
      <button className={clsx(styles.toggleButton, className)} type="button" disabled>
        <div className={styles.iconWrapper} />
      </button>
    );
  }

  const isDark = colorMode === 'dark';

  return (
    <button
      className={clsx(
        styles.toggleButton,
        className,
        navbarStyle === 'dark' ? styles.darkNavbarColorModeToggle : undefined
      )}
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      type="button"
    >
      <div className={styles.iconWrapper}>
        <AnimatePresence initial={false}>
          <motion.div
            key={colorMode}
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </motion.div>
        </AnimatePresence>
      </div>
    </button>
  );
}
