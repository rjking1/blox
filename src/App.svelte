<script>
  import BlocklyComponent from "./components/BlocklyComponent.svelte";
  import BlocklyUIComponent from "./components/BlocklyUIComponent.svelte";
  import CodeComponent from "./components/CodeComponent.svelte";
  import Runner from "./components/runner.svelte";
  import UICodeComponent from "./components/UICodeComponent.svelte";
  import UIResult from "./components/UIResult.svelte";

  let uiComp;
  let codeComp;
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
