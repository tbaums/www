<template>
    <div>
        <div v-for="article in articles">
            <div class="flag">
                <code class="title">{{ article.title }}</code>
                <p>
                    {{ article.frontmatter.glossaryEntry }} <router-link :to="article.path">(Read more)</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            articles() {
                return this.$site.pages
                    .filter(x => x.path.startsWith('/reference/') && x.frontmatter.glossaryEntry);
            }
        }
    }
</script>