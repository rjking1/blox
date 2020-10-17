<script>
  import Blockly from 'blockly'
  import { uicode } from './stores.js'

  // const unsubscribe = count.subscribe(value => {
	// 	count_value = value;
	// });
</script>

<style>
  #uicode {
    height: 100px;
    width: 800px;
    text-align: left;
  }
</style>

<div>
  <div>
    <pre> 
      <textarea id="uicode" readonly>{$uicode}</textarea>
    </pre>
  </div>
</div>
