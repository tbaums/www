module.exports = {
    title: 'KUDO',
    base: '/www/',
    themeConfig: {
        logo: '/images/kudo_stacked_color@2x.png',
        sidebar: {
            '/docs/': [
              '',
              'cli',
              'comparison',
              'concepts',
              'controlled-parameter-changes',
              'developing-operators',
              'faq',
              'repository',
              'testing',
              'update-upgrade-plans'
            ],
            '/blog/': [
              ''
            ],
            '/community/': [
              '',
              'events'
            ]
        },
        repo: "kudobuilder/kudo",
        repoLabel: "Contribute!",
        docsRepo: "kudobuilder/kudo",
        docsDir: "docs",
        docsBranch: "master",
        editLinks: true,
        editLinkText: "Help us improve this page",
        nav: [
            { text: 'Docs', link: '/docs/' },
            { text: 'Blog', link: '/blog/' },
            { text: 'Community', link: '/community/' }
        ]
    },
    markdown: {
        toc: {
          includeLevel: [2, 3, 4]
        },
        lineNumbers: false,
        extendMarkdown: md => {
            md.use(require('markdown-it-footnote'))
        }
    },
    plugins: [
        ['container', {
            type: 'right',
            defaultTitle: '',
        }],
        ['container', {
            type: 'flag',
            before: name => `<div class="flag"><code class="title" v-pre>${name}</code>`,
            after: '</div>',
        }],
    ]
};