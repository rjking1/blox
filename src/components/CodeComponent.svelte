<script>
  import Blockly from 'blockly'
  import { jscode, output, paths } from './stores.js'

  // const unsubscribe = count.subscribe(value => {
	// 	count_value = value;
	// });
</script>

<style>
  #code {
    height: 100px;
    width: 800px;
    text-align: left;
  }
</style>

<div>
  <div>
    <pre> 
      <textarea id="code" readonly>{$jscode}</textarea>
    </pre>
  </div>
</div>
