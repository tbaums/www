<template>
    <div>
        <div v-for="event in events">
            <div style="position: absolute">
                <div style="width: 3rem; height: 3rem; background-color: #252832; margin-top: 0.2rem"/>
            </div>
            <div class="event" style="padding-left: 4.5rem; width: 90%;">
                <div class="date" >
                    <div>
                        <span v-if="event.date">{{ new Date(event.date).toLocaleDateString() }}</span>
                        <span class="right" v-if="event.location">{{ event.location }}</span>
                    </div>
                </div>
                <div class="title" v-if="event.topic">{{ event.topic }}</div>
                <div class="inner">
                    <div v-if="event.speaker">Speaker: {{ event.speaker }}</div>
                    <div v-if="event.event">
                        <span>Event: {{ event.event }}</span>
                        <span v-if="event.url">
                            <a v-bind:href="event.url"
                               target="_blank"
                               rel="noopener noreferrer">(event details)</a><OutboundLink/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import json from '../../community/events/events.json';
  export default {
    data(){
      return{
        eventSource: json.events
      }
    },
    props: {
      // whether to show upcoming or past events.
      subset: {
        type: String,
        default: 'upcoming'
      }
    },
    computed: {
      events() {
        if (this.subset === 'upcoming') {
          return this.eventSource
            .filter(x => new Date(x.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
          return this.eventSource
            .filter(x => new Date(x.date) < new Date())
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        }
      },
    }
  }
</script>
