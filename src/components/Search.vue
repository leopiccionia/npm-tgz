<script setup>
  import { computed, ref, watch } from 'vue'
  import Multiselect from 'vue-multiselect'

  import Version from './Version.vue'
  import { getMetadata, getPackageNames } from '../api'

  let options = ref([])
  let pkgName = ref(null)
  let pkg = ref(null)

  async function onSearchChange (query) {
    if (!query) {
      options.value = []
    } else {
      const results = await getPackageNames(query)
      options.value = results.objects.map((result) => {
        const { description, name } = result.package
        return { description, name }
      })
    }
  }

  watch(pkgName, async () => {
    const data = await getMetadata(pkgName.value.name)
    pkg.value = data
  })

  const tags = computed(() => {
    if (!pkg.value) {
      return []
    }
    return Object.entries(pkg.value['dist-tags']).map(([tag, version]) => {
      return { tag, data: pkg.value['versions'][version], time: pkg.value['time'][version] }
    })
  })

  const versions = computed(() => {
    if (!pkg.value) {
      return []
    }
    return Object.entries(pkg.value['versions']).reverse().map(([version, data]) => {
      return { tag: version, data, time: pkg.value['time'][version] }
    })
  })
</script>

<template>
  <h1>npm-tgz</h1>
  <p>Search a npm package to download it</p>

  <Multiselect
    :internalSearch="false"
    label="name"
    :options="options"
    :searchable="true"
    :showNoResults="false"
    trackBy="name"
    v-model="pkgName"
    @searchChange="onSearchChange"
  >
    <template #option="{ option }">
      <div class="option__name">{{ option.name }}</div>
      <div class="option__description">{{ option.description }}</div>
    </template>
  </Multiselect>

  <template v-if="pkg">
    <h2>{{ pkg.name }}</h2>
    <p>{{ pkg.description }}</p>
    <p><a :href="pkg.homepage" target="_blank" rel="noopener noreferrer">Homepage</a></p>
    <p><a :href="`https://www.npmjs.com/package/${pkg.name}`" target="_blank" rel="noopener noreferrer">See on npm</a></p>

    <h3>Tags</h3>
    <div class="versions">
      <Version v-for="{ data, tag, time } of tags"
        :key="tag"
        :data="data"
        :latest="tag === 'latest'"
        :tag="tag"
        :time="time"
      />
    </div>

    <h3>Versions</h3>
    <div class="versions">
      <Version v-for="{ data, tag, time } of versions"
        :key="tag"
        :data="data"
        :tag="tag"
        :time="time"
      />
    </div>
  </template>
</template>

<style>
  @import 'vue-multiselect/dist/vue-multiselect.css';

  h1, h2, h3 {
    color: #333;
  }

  h1 {
    margin: 0 0 0.5em;
  }

  h2, h3 {
    margin: 1.5em 0 0.5em;
  }

  p {
    margin-block: 0.5em;
  }

  h1 + p {
    margin-bottom: 1.5em;
  }

  .multiselect, .versions {
    margin: auto;
    max-width: 1040px;
    width: 100%;
  }

  .versions {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .option__description {
    font-size: 0.875rem;
    opacity: 0.75;
  }
</style>
