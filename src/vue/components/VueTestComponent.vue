<template>
  <div class="section">
    <p class="par">{{propMessage}} Vue!</p>
    <p class="par">{{longMessage}}</p>
    <OtherVueComponent extraClass="par"/>
  </div>
</template>

<script>
import OtherVueComponent from '@vue/components/OtherVueComponent.vue';

export default {
  props: ['propMessage'],
  data() {
    return {
      longMessage:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris iaculis ex eu urna ullamcorper aliquet. Sed euismod placerat blandit. In faucibus erat eget nibh venenatis, sit amet venenatis arcu tincidunt. Mauris et mattis elit, ac convallis odio. Nulla fermentum tellus quis finibus volutpat. Nunc urna sem, elementum et ultrices mollis, volutpat eget justo. Ut eu tempor ligula.',
    };
  },
  components: {
    OtherVueComponent,
  },
};
</script>


<style lang="sass" scoped>
$color1: #34495e;
$color2: #41b883;
.section {
  padding: 1rem;
  background-color: $color1;
}

.par {
  padding: 0.5rem;
  background-color: $color2;
}
</style>
