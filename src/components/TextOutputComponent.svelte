<script>
  import { output } from './stores.js'
</script>

<style>
  #output {
    height: 800px;
    width: 800px;
    text-align: left;
  }
</style>

<div>
  <!-- <input id="input1" type="text" /> -->
  <pre>
    <textarea id="output">{$output}</textarea>
  </pre>
</div>
