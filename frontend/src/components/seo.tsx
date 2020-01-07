/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

function SEO({
  description,
  lang,
  meta,
  title,
  keywords,
}: {
  description?: string
  lang?: string
  meta?: { property: string; content: any; name?: undefined }[]
  title?: string
  keywords?: string[]
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            keywords
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang: lang || 'en',
      }}
      title={title || site.siteMetadata.title}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title || site.siteMetadata.title,
        },
        {
          property: `og:image`,
          content: 'https://streamlabs-github-sponsors.netlify.com/banner.png',
        },
        {
          property: `og:url`,
          content: 'https://streamlabs-github-sponsors.netlify.com/',
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat({
          name: `keywords`,
          content:
            (keywords || []).length > 0
              ? keywords.join(`, `)
              : site.siteMetadata.keywords,
        })
        .concat(meta || [])}
    />
  )
}

export default SEO
