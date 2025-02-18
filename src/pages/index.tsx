import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'

import HeadIntro from '../components/Landing/HeadIntro/HeadIntro'
import React from 'react'
import Particles from '../components/Landing/StarrySky/StarrySky'

export default function Home() {
    const {
        siteConfig: { customFields, tagline },
    } = useDocusaurusContext()
    const { description } = customFields as { description: string }

    return (
        <Layout title={tagline} description={description}>
            <main>
                
                <HeadIntro></HeadIntro>  
                <Particles  className="absolute inset-0 -z-10" quantity={100} ease={80} color="#ffffff" refresh/>
                
            </main>
        </Layout>
    )
}