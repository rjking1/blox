<script>
  import { uicode, jscode } from './stores.js'
</script>

<!-- <svelte:head>
  {@html '<script>' + $jscode + '<\/script> ' }
</svelte:head> -->

<style>
  #output {
    height: 800px;
    width: 800px;
    text-align: left;
  }
</style>

<!-- <div id="output" > -->
  {@html '<script>' + $jscode + '<\/script> ' + $uicode }
<!-- </div> -->

