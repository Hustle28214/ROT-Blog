import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '关于我',
    Svg: require('@site/static/img/women.svg').default,
    description: (
      <>
        一名程序媛。
      </>
    ),
  },
  {
    title: '专业',
    Svg: require('@site/static/img/gundam.svg').default,
    description: (
      <>
       机器人工程
      </>
    ),
  },
  {
    title: '相比其他程序员...',
    Svg: require('@site/static/img/machine.svg').default,
    description: (
      <>
        更多的机械、电子、控制内容。
      </>
    ),
  },
  
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} width="100%" height="100%" viewBox="0 0 1024 1024" role="img" />
      </div>
      <div className={clsx('text--center padding-horiz--md', styles.featureHeading)}>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}