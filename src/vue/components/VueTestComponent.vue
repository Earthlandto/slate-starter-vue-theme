<template>
  <div class="section">
    <p class="par">{{propMessage}} Vue!</p>
    <p class="par">{{longMessage}}</p>
  </div>
</template>

<script>
export default {
  props: ["propMessage"],
  data() {
    return {
      longMessage:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris iaculis ex eu urna ullamcorper aliquet. Sed euismod placerat blandit. In faucibus erat eget nibh venenatis, sit amet venenatis arcu tincidunt. Mauris et mattis elit, ac convallis odio. Nulla fermentum tellus quis finibus volutpat. Nunc urna sem, elementum et ultrices mollis, volutpat eget justo. Ut eu tempor ligula."
    };
  }
};
</script>

<style lang="sass" scoped>
$color1: #34495E;
$color2: #41B883;
.section {
  padding: 1rem;
  background-color : $color1;
}

.par {
  padding: .5rem;
  background-color: $color2;
}
</style>
