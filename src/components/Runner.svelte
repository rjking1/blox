<script>
  import { doFetchPost } from './common.js'
  import Blockly from 'blockly'
  import { onMount } from 'svelte'
  import { jscode, uicode, output, paths } from './stores.js'
  import BlocklyComponent from './BlocklyComponent.svelte'

  export let uiComp
  export let codeComp

  let files = []
  let file_name = "test1"

  onMount( async() => {
    files = await doFetchPost('keyvalues', "select name from kv where user='richard' and project='blox' order by name")
  } )

  // const unsubscribe = count.subscribe(value => {
	// 	count_value = value;
  // });
  
  function loadBlocksFromDB() {
    // console.log(file_name)
    uiComp.loadBlocksFromDB(file_name)   //or name + '1'
    codeComp.loadBlocksFromDB(file_name) //or name + '2'
  }
  function saveBlocksToDB() {
    let name = window.prompt("Save to name", file_name)
    if(name !== '') {
      uiComp.saveBlocksToDB(name)   //or name + '1'
      codeComp.saveBlocksToDB(name) //or name + '2'
      //window.alert('saved ' + name)
    }
  }
  function deleteBlocksFromDB() {
    let name = window.prompt("Delete name", file_name)
    if(name !== '') {
      uiComp.deleteBlocksFromDB(name)   //or name + '1'
      codeComp.deleteBlocksFromDB(name) //or name + '2'
      //window.alert('deleted ' + name)
    }
  }


  function write(x) {                   // write(..) and writeln(..)
    $output = $output + x
  }

  function writeLn(x) {                   // write(..) and writeln(..)
    $output = $output + x + '\n'
  }

  function svgPath(x) {
    $paths = $paths + x + ' '
  }

  /*
  function runCode() {
    $output = ''
    $paths = '' // 'M 100 350 l 150 -300'
    window.LoopTrap = 10000
    // Blockly.JavaScript.INFINITE_LOOP_TRAP =
    //  'if(--window.LoopTrap == 0) throw "Infinite loop.";\n'
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null
    try {
      eval($jscode)
    } catch (e) {
      alert('Bad code: ' + e)
    }

    // make sure functions are called at least once
    write('')
    writeLn('')
    svgPath('')
  }
  */

  function runInWindow() {
    let coreFuncs = 'function write(id, x) {console.log(x);} '
    let script = "<script>" + coreFuncs + $jscode + "<\/script>"

    var myWindow = window.open("", "","top=50, left=50, width=800,height=800");
    myWindow.document.write(script + $uicode);
  }
</script>

<style>
  #code {
    height: 740px;
    width: 800px;
    text-align: left;
  }
</style>

<div>
  <!-- <button on:click={copyBlocks}>Copy</button>
  <button on:click={pasteBlocks}>Paste</button> -->
  <select id="id_file_name" bind:value={file_name}>
    {#each files as file}
      <option value={file.name} selected={file.name === file_name} >{file.name}</option>
    {/each}
  </select>
  <button on:click={loadBlocksFromDB}>Load</button>
  <button on:click={saveBlocksToDB}>Save</button>
  <button on:click={deleteBlocksFromDB}>Delete</button>
  <button on:click={runInWindow}>Run in Window</button>
</div>
