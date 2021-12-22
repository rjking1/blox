<script>
  import { ART7_DB_PREFIX, ART7_DSQL_URL } from "../../common/config";
  import BlocklyComponent from "./components/BlocklyComponent.svelte";
  import BlocklyUIComponent from "./components/BlocklyUIComponent.svelte";
  import CodeComponent from "./components/CodeComponent.svelte";
  import Runner from "./components/runner.svelte";
  import UICodeComponent from "./components/UICodeComponent.svelte";
  import UIResult from "./components/UIResult.svelte";
  import {dbN} from "./components/stores.js"

  let uiComp;
  let codeComp;

  $dbN = {db: ART7_DB_PREFIX + "keyvalues", server: ART7_DSQL_URL};

</script>

<Runner {uiComp} {codeComp} />
<div class="flex-container">
  <BlocklyUIComponent bind:this={uiComp} />
  <BlocklyComponent bind:this={codeComp} />
  <UIResult />
  <UICodeComponent />
  <CodeComponent />
</div>

<style>
  .flex-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space;
  }
</style>
