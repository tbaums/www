module.exports = {
    title: 'KUDO',
    base: '/',
    themeConfig: {
        logo: '/images/kudo_horizontal_color@2x.png',
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
              '',
              'announcing-kudo-0.5.0',
              'announcing-kudo-0.4.0',
              'announcing-kudo-0.3.0',
              'announcing-kudo-0.2.0'
            ],
            '/community/': [
              '',
              'events'
            ],
            '/internal-docs/': [
              '',
              'blog-index',
              'custom-badge',
              'custom-blocks',
              'events-index'
            ],
        },
        repo: "kudobuilder/kudo",
        repoLabel: "Contribute!",
        docsRepo: "kudobuilder/www",
        docsDir: "content",
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
            type: 'flag',
            before: name => `<div class="flag"><code class="title" v-pre>${name}</code>`,
            after: '</div>',
        }],
    ]
};
