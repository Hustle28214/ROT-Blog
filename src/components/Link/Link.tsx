import React from 'react';
import styles from './styles.module.css';
import { Icon } from '@iconify/react';
import SocialValue from './SocialLink';

export type SocialMedia = {
  github ?: string;
  csdn ?: string;
  wechat ?: string;
  email ?: string;
};

interface LinkProps {
  href: string;
  title: string;
  color?: string;
  icon: string | JSX.Element;
  [key : string] : unknown;
}

function SocialMediaLink({href,title,color,icon,...prop}:LinkProps){
    return (  
      <a href={href} target='_blank' {...prop} title={title}>
          {typeof icon === 'string' ? <Icon icon = {icon} /> : icon}
      </a>
    );
  }

export default function Links({...prop}) { 
    return (
      <div className={styles.socialLinks} {...prop}>
        {Object.entries(SocialValue)
          .filter(([_key, {href}]) => href) 
          .map(([key, {href,icon,title,color}]) => {
            return <SocialMediaLink
              key={key}
              href={href!} 
              title={title}
              icon={icon}
              style={{'--color': color}}
            />
    })}
      </div>
    );
  }