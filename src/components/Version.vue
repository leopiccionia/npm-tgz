<script setup>
  import { format as timeago } from 'timeago.js'

  const { data, latest, tag, time } = defineProps({
    data: { type: Object, required: true },
    latest: { type: Boolean, default: false },
    tag: { type: String, required: true },
    time: { type: String, required: true },
  })

  const _dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' })
  function formatDate (date) {
    return _dateFormatter.format(new Date(date))
  }
</script>

<template>
  <a class="version" :class="{ latest }" :href="data.dist.tarball">
    <h4 class="version__tag">{{ tag }}</h4>
    <div class="version__version" v-if="data.version !== tag">{{ data.version }}</div>
    <time class="version__time" :datetime="time" :title="formatDate(time)">{{ timeago(time) }}</time>
  </a>
</template>

<style>
  .version {
    background-color: #777;
    border-radius: 10px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    text-decoration: none;
  }

  .version:hover {
    color: white;
  }

  .version.latest {
    background-color: mediumseagreen;
  }

  .version__tag {
    margin: 0;
  }

  .version__version {
    margin: 0;
  }
</style>
