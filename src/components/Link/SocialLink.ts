export type SocialMedia = {
  github ?: string;
  csdn ?: string;
  wechat ?: string;
  email ?: string;
  rss ?: string;
};


type SocialValue = {
    href?: string
    title: string
    icon: string
    color?: string
}

const socialValue: SocialMedia = {
    github: 'https://github.com/Hustle28214',
    wechat: 'https://github.com/user-attachments/assets/7847af17-3501-443e-b897-9b14cf123624',
    email: 'mailto:hackitlilwave@outlook.com',
    csdn: 'https://blog.csdn.net/hustle28214',
    rss: 'https://www.rotleyan.site/blog/rss.xml',
}


const socialLinkSet: Record<keyof SocialMedia | 'rss', SocialValue> = {
    github: {
        href: socialValue.github,
        title: 'Github',
        icon: 'simple-icons:github',
        color: '#3A89C9',
    },
    wechat: {
        href: socialValue.wechat,
        title: 'Wechat',
        icon: 'simple-icons:wechat',
        color: '#59B748',
    },
    email: {
        href: socialValue.email,
        title: 'Email',
        icon: 'simple-icons:mailboxdotorg',
        color: '#FFC000',
    },
    csdn:{
        href: socialValue.csdn,
        title: 'CSDN',
        icon: 'simple-icons:csdn',
        color: '#FF5F1F',
    },
    rss: {
        href: socialValue.rss,
        title: 'RSS',
        icon: 'simple-icons:rss',
        color: '#ff3300',
    },
    
}

export default socialLinkSet