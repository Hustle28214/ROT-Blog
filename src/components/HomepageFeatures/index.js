import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '项目',
    Svg: require('@site/static/img/women.svg').default,
    description: (
      <>
        2024国际基因工程机器大赛网页、软件组
        <br />
        2023亚太杯数学建模竞赛三等奖
        <br />
        2024MathorCup数学建模竞赛华北赛区二等奖
        <br />
        2023年国际大学生工程力学竞赛二等奖
        <br />
        2024年西门子杯信息化网络化华北赛区二等奖
        <br />
        2024睿抗机器人开发者大赛初赛一等奖
        <br />
        2023北京市工程设计表达竞赛校级二等奖
        <br />
        北京化工大学“萌芽杯”校级二等奖
        <br />
        第五届魔方机器人大赛院级一等奖
        <br />
        DataWhale优秀学习者
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