<template>
  <p :class="elemClass">{{message}}</p>
</template>

<script>
export default {
  props: ['extraClass'],

  computed: {
    elemClass: function() {
      return this.extraClass + ' ' + this.myClass;
    },
  },

  data() {
    return {
      message: 'other component!',
      myClass: 'myClass',
    };
  },
};
</script>

<style scoped>
.myClass {
  padding: 2rem 0.5rem;
}
</style>
