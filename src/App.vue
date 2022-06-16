<template>
  <div id="app" class="container">
    <Header></Header>
  </div>
</template>

<script>
import Header from './components/Header';

export default {
  components: { Header },
};
</script>

<style lang="sass">

  // Bootstrap
  $icon-font-path: '../node_modules/bootstrap-sass/assets/fonts/bootstrap/'
  $link-color: #039be5
  $brand-success: #039be5
  $form-group-margin-bottom: 3px
  @import 'node_modules/bootstrap-sass/assets/stylesheets/bootstrap'

  // font awesome
  $fa-font-path: '../node_modules/font-awesome/fonts/'
  @import 'node_modules/font-awesome/scss/font-awesome'


</style>
