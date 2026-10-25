import React, { useEffect, useRef, useState } from 'react';
import Links from '../../Link/Link';
import { email } from '../../../data/homeData';
import { useReveal } from '../hooks';

/** 联系 CTA：邮箱一键复制 + 社交链接 */
export default function ContactSection() {
  const ref = useReveal<HTMLElement>();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // 剪贴板不可用（http / 旧浏览器）时退化为选中文本
      const el = document.getElementById('contact-email');
      el?.setAttribute('contenteditable', 'true');
      el?.focus();
      document.execCommand?.('selectAll', false);
    }
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="sec contactSec" id="contact" ref={ref}>
      <span className="secEyebrow mono">03 / CONTACT</span>
      <h2>有想法？聊聊。</h2>
      <p className="contactLead">
        可以通过邮件联系我，也可以在社交平台上找到我。
      </p>

      <div className="contactRow">
        <button className="emailChip mono" onClick={copyEmail} title="点击复制邮箱">
          <span id="contact-email">{email}</span>
          <span className="emailHint" aria-hidden="true">复制</span>
        </button>
        <span className={`toast${copied ? ' is-show' : ''}`} role="status" aria-live="polite">
          已复制到剪贴板
        </span>
      </div>

      <div className="contactSocials">
        <Links />
      </div>
    </section>
  );
}
