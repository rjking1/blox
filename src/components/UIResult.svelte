<script>
  import { uicode, jscode } from './stores.js'
</script>

<style>
  #output {
    height: 800px;
    width: 800px;
    text-align: left;
  }
</style>

<svelte:head>
{@html '<script>' + $jscode + '<\/script> ' }
</svelte:head>

<div id="output" >
  {@html  $uicode }
</div>

