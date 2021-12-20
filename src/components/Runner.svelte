<script>
  import { DB_PREFIX } from "../../../common/config.js";
  import { doFetch } from "../../../common/dbutils.js";
  import { onMount } from "svelte";
  import { jscode, uicode, output, paths } from "./stores.js";

  export let uiComp;
  export let codeComp;

  let files = [];
  let file_name = "test1";

  onMount(async () => {
    files = await doFetch(
      DB_PREFIX + "keyvalues",
      "select name from kv where user='richard' and project='blox' order by name"
    );
  });

  // const unsubscribe = count.subscribe(value => {
  // 	count_value = value;
  // });

  function loadBlocksFromDB() {
    // console.log(file_name)
    uiComp.loadBlocksFromDB(file_name); //or name + '1'
    codeComp.loadBlocksFromDB(file_name); //or name + '2'
  }
  function saveBlocksToDB() {
    let name = window.prompt("Save to name", file_name);
    if (name !== "") {
      uiComp.saveBlocksToDB(name); //or name + '1'
      codeComp.saveBlocksToDB(name); //or name + '2'
      //window.alert('saved ' + name)
    }
  }
  function newWorkspace() {
    uiComp.newWorkspace(); //or name + '1'
    codeComp.newWorkspace(); //or name + '2'
  }
  function deleteBlocksFromDB() {
    let name = window.prompt("Delete name", file_name);
    if (name !== "") {
      uiComp.deleteBlocksFromDB(name); //or name + '1'
      codeComp.deleteBlocksFromDB(name); //or name + '2'
      //window.alert('deleted ' + name)
    }
  }

  function write(x) {
    // write(..) and writeln(..)
    $output = $output + x;
  }

  function writeLn(x) {
    // write(..) and writeln(..)
    $output = $output + x + "\n";
  }

  function svgPath(x) {
    $paths = $paths + x + " ";
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
    let myWindow = window.open("", "", "top=50, left=50, width=800,height=800");
    myWindow.document.write("<script>" + $jscode + "<" + "/script>" + $uicode);
  }

  function writeDownload(filename, data) {
    var blob = new Blob([data], { type: "text/html" });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var elem = window.document.createElement("a");
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }

  function genScript() {
    const coreFuncs = ""; //  'function write(id, x) {console.log(x);} '
    return (
      "" +
      "<html><head>" +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '<meta charset="UTF-8">' +
      "<script>" +
      coreFuncs +
      $jscode +
      "<" +
      "/script></head><body>" +
      $uicode +
      "</body></html>"
    );
  }

  function download() {
    writeDownload("index.html", genScript());
  }
</script>

<div>
  <!-- <button on:click={copyBlocks}>Copy</button>
  <button on:click={pasteBlocks}>Paste</button> -->
  <select id="id_file_name" bind:value={file_name}>
    {#each files as file}
      <option value={file.name} selected={file.name === file_name}
        >{file.name}</option
      >
    {/each}
  </select>
  <button on:click={loadBlocksFromDB}>Load</button>
  <button on:click={saveBlocksToDB}>Save</button>
  <button on:click={newWorkspace}>New</button>
  <button on:click={deleteBlocksFromDB}>Delete</button>
  <button on:click={runInWindow}>Run in Window</button>
  <button on:click={download}>Download</button>
</div>
