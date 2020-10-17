<script>
  import { paths } from './stores.js'

  function triangle() {
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
      
    //context.pen.color = #ffa;
    context.beginPath();
    context.moveTo(100, 25);
    context.lineTo(25, 175);
    context.lineTo(200, 175);
    context.lineTo(100, 25);
    context.moveTo(350, 350);
    context.lineTo(600, 600);
    context.stroke();
  }

</script>

<style>
  #canvas {
    border: 1px black solid;
  }
</style>

<div id="canvas"> 
  <svg height="800" width="800">
    {#if $paths !== ''}
      <path d="{$paths}" stroke="red" stroke-width="3" fill="none" />
    {/if}
  </svg>
</div>
