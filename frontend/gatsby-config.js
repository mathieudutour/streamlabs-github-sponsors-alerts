module.exports = {
  siteMetadata: {
    title: 'Streamlabs GitHub Sponsors',
    description: `Trigger subscription alerts when someone sponsors you on GitHub`,
    author: `@mathiedutour`,
    siteUrl: `https://streamlabs-github-sponsors.netlify.com`,
    keywords: `streamlabs, twitch, streaming, alerts, github sponsors, subscriptions`,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Streamlabs GitHub Sponsors',
        short_name: 'Streamlabs GitHub Sponsors',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/icon.png', // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-typescript`,
    `gatsby-plugin-emotion`,
    `gatsby-plugin-netlify`,
  ],
}
