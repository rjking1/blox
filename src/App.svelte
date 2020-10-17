<script>
  import BlocklyComponent from './components/BlocklyComponent.svelte'
  import BlocklyUIComponent from './components/BlocklyUIComponent.svelte'
  import CodeComponent from './components/CodeComponent.svelte'
  import Runner from './components/runner.svelte'
  import UICodeComponent from './components/UICodeComponent.svelte'
  import UIResult from './components/UIResult.svelte'

  let uiComp
  let codeComp
</script>

<style>
  .flex-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space;
  }

  .flex-itemx {
    margin: 5px;
  }
</style>

<Runner {uiComp} {codeComp} />
<div class="flex-container">
  <BlocklyUIComponent bind:this="{uiComp}" />
  <BlocklyComponent bind:this="{codeComp}" />
  <UICodeComponent />
  <CodeComponent />
  <UIResult />
</div>
