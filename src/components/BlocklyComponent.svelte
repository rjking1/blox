<script>
  import { doFetchPost } from './common.js'
  import { onMount } from 'svelte'
  import Blockly from 'blockly'
  import { jscode, output } from './stores.js'

  const KEY = 'vikingBloxStorage'

  let workspace
  let file_name = 'test1'
  let prevCode = ''

  onMount( async() => {
    Blockly.defineBlocksWithJsonArray([
      {
        type: 'io_input',
        message0: 'input id=%1',
        args0: [
          {
            type: 'field_input',
            name: 'ID',
            text: '1',
          },
        ],
        output: null,
        colour: 230,
        tooltip: '',
        helpUrl: '',
      },
      {
        type: 'write_text',
        message0: 'Write ID=%1 TEXT=%2',  // Newline type= eg Numeric|Date|Text(default)
        args0: [
          {
            type: 'field_input',
            name: 'ID',
            text: '1',
          },
          {
            type: 'input_value',
            name: 'TEXT',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'Write text to textarea id',
        helpUrl: '',
      },
      {
        type: 'writeLn_text',
        message0: 'WriteLn %1',
        args0: [
          {
            type: 'input_value',
            name: 'TEXT',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'Write output to the text area with CRLF',
        helpUrl: '',
      },
      {
        type: 'output_path',
        message0: 'Path %1',
        args0: [
          {
            type: 'input_value',
            name: 'PATH',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'Draw path',
        helpUrl: '',
      },
      {
        type: 'js',
        message0: 'js %1',
        args0: [
          {
            type: 'field_input',
            name: 'TEXT',
            text: '',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'js statement',
        helpUrl: '',
      },
      {
        type: 'jsf',
        message0: 'jsf %1',
        args0: [
          {
            type: 'field_input',
            name: 'TEXT',
            text: '',
          },
        ],
        output: null,
        colour: 230,
        tooltip: 'js function',
        helpUrl: '',
      },
    ])

    Blockly.JavaScript['io_input'] = function (block) {
      let id = block.getFieldValue('ID')
      let code = 'document.getElementById("input' + id + '").value'
      return [code, Blockly.JavaScript.ORDER_NONE]
    }
    Blockly.JavaScript['write_text'] = function (block) {
      let id = block.getFieldValue('ID')
      let txt =
        Blockly.JavaScript.valueToCode(
          block,
          'TEXT',
          Blockly.JavaScript.ORDER_ATOMIC,
        ) || "''"
      //  return 'write(' + id + ', '+ txt + ');\n'
      return 'document.getElementById("' + id + '").value += '+ txt + ';\n'
    }
    Blockly.JavaScript['writeLn_text'] = function (block) {
      let argument0 =
        Blockly.JavaScript.valueToCode(
          block,
          'TEXT',
          Blockly.JavaScript.ORDER_ATOMIC,
        ) || "''"
      return 'writeLn(' + argument0 + ');\n'
    }
    Blockly.JavaScript['output_path'] = function (block) {
      let argument0 =
        Blockly.JavaScript.valueToCode(
          block,
          'PATH',
          Blockly.JavaScript.ORDER_ATOMIC,
        ) || "''"
      return 'svgPath(' + argument0 + ');\n'
    }
    Blockly.JavaScript['js'] = function (block) {
      let argument0 = block.getFieldValue('TEXT')
      return argument0 + '\n'
    }
    Blockly.JavaScript['jsf'] = function (block) {
      let code = '(' + block.getFieldValue('TEXT') + ')' // Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ADDITION) || '0'
      console.log(code)
      return [code, Blockly.JavaScript.ORDER_ADDITION]
    }

    workspace = Blockly.inject(document.getElementById('blocklyDiv'), {
      toolbox: document.getElementById('toolbox'),
      trashcan: false,
      zoom: {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2,
          pinch: true},
    })
    //workspace.addChangeListener(Blockly.Events.disableOrphans);

    workspace.addChangeListener(myUpdateFunction)

    if ('localStorage' in window && window.localStorage[KEY]) {
      restoreBlocks()
    }
  })

  function appendScript() {
    // append script on change
    const newScript = document.createElement("script");
    const inlineScript = document.createTextNode($jscode);
    newScript.appendChild(inlineScript); 
    document.head.appendChild(newScript);
  }

  function myUpdateFunction(event) {
    $jscode = Blockly.JavaScript.workspaceToCode(workspace)
    if($jscode !== prevCode) {
      appendScript()
      backupBlocks()
      prevCode = $jscode
      console.log('script changed')
    }
  }

  function pasteBlocks() {
    let xml_text = document.getElementById('output').value
    if (
      xml_text.substr(0, 4) === '<xml' &&
      confirm(xml_text.substr(0, 30) + '...\n\nReplace blocks with text?')
    ) {
      let xml = Blockly.Xml.textToDom(xml_text)
      Blockly.Xml.domToWorkspace(xml, workspace)
    }
  }

  function copyBlocks() {
    let xml = Blockly.Xml.workspaceToDom(workspace)
    let xml_text = Blockly.Xml.domToPrettyText(xml)
    $output = xml_text
  }

  function backupBlocks() {
    if (!'localStorage' in window) return
    let xml = Blockly.Xml.workspaceToDom(workspace)
    let text = Blockly.Xml.domToText(xml)
    //console.log(text);
    window.localStorage.setItem(KEY, text)
  }

  function restoreBlocks() {
    let xml = Blockly.Xml.textToDom(window.localStorage[KEY])
    Blockly.Xml.domToWorkspace(xml, workspace)
  }

  export async function loadBlocksFromDB(file_name) {
    let row = await doFetchPost('keyvalues', "select name,value from kv where user='richard' and project='blox' and name='" + file_name + "'") 
    //console.log(row[0]['value'])
    workspace.clear()
    let xml = Blockly.Xml.textToDom(row[0]["value"])
    Blockly.Xml.domToWorkspace(xml, workspace)
  }

  export async function saveBlocksToDB(file_name) {
    if (file_name !== '') {
      let xml = Blockly.Xml.workspaceToDom(workspace)
      let text = Blockly.Xml.domToText(xml)
      text = text.replace(/'/g, "''");
      let sql = "replace into kv (user,project,name,value) values ('richard','blox','" + file_name + "','" + text + "')"
      let res = await doFetchPost('keyvalues', sql) 
    }
  }
  export function newWorkspace() {
    workspace.clear()
  }
  export async function deleteBlocksFromDB(file_name) {
    if (file_name !== '') {
      let sql = "delete from kv where user='richard' and project='blox' and name='" + file_name + "'"
      let res = await doFetchPost('keyvalues', sql) 
    }
  }
</script>

<style>
  #blocklyDiv {
    height: 900px;
    width: 625px;
    bottom: 0;
    text-align: left;
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<div>
  <div id="blocklyDiv" />
  <xml id="toolbox" style="display:none">
    <category name="Logic" colour="210">
      <block type="controls_if" />
      <block type="logic_compare" />
      <block type="logic_operation" />
      <block type="logic_negate" />
      <block type="logic_boolean" />
      <block type="logic_null" />
      <block type="logic_ternary" />
    </category>
    <category name="Loops" colour="120">
      <block type="controls_repeat_ext">
        <value name="TIMES">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="controls_whileUntil" />
      <block type="controls_for">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
        <value name="BY">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="controls_forEach" />
      <block type="controls_flow_statements" />
    </category>
    <category name="Math" colour="230">
      <block type="math_number">
        <field name="NUM">123</field>
      </block>
      <block type="math_arithmetic">
        <value name="A">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="B">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
      </block>
      <block type="math_single">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">9</field>
          </shadow>
        </value>
      </block>
      <block type="math_trig">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">45</field>
          </shadow>
        </value>
      </block>
      <block type="math_constant" />
      <block type="math_number_property">
        <value name="NUMBER_TO_CHECK">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <block type="math_round">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">3.1</field>
          </shadow>
        </value>
      </block>
      <block type="math_on_list" />
      <block type="math_modulo">
        <value name="DIVIDEND">
          <shadow type="math_number">
            <field name="NUM">64</field>
          </shadow>
        </value>
        <value name="DIVISOR">
          <shadow type="math_number">
            <field name="NUM">10</field>
          </shadow>
        </value>
      </block>
      <block type="math_constrain">
        <value name="VALUE">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <value name="LOW">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="HIGH">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_int">
        <value name="FROM">
          <shadow type="math_number">
            <field name="NUM">1</field>
          </shadow>
        </value>
        <value name="TO">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
      </block>
      <block type="math_random_float" />
    </category>
    <category name="Text" colour="160">
      <block type="text" />
      <block type="text_join" />
      <block type="text_append">
        <value name="TEXT">
          <shadow type="text" />
        </value>
      </block>
      <block type="text_length">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_isEmpty">
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT" />
          </shadow>
        </value>
      </block>
      <block type="text_indexOf">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">textVariable</field>
          </block>
        </value>
        <value name="FIND">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_charAt">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">textVariable</field>
          </block>
        </value>
      </block>
      <block type="text_getSubstring">
        <value name="STRING">
          <block type="variables_get">
            <field name="VAR">textVariable</field>
          </block>
        </value>
      </block>
      <block type="text_changeCase">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_trim">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_print">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="text_prompt_ext">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
    </category>
    <category name="Lists" colour="260">
      <block type="lists_create_with">
        <mutation items="0" />
      </block>
      <block type="lists_create_with" />
      <block type="lists_repeat">
        <value name="NUM">
          <shadow type="math_number">
            <field name="NUM">5</field>
          </shadow>
        </value>
      </block>
      <block type="lists_length" />
      <block type="lists_isEmpty" />
      <block type="lists_indexOf">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">listVariable</field>
          </block>
        </value>
      </block>
      <block type="lists_getIndex">
        <value name="VALUE">
          <block type="variables_get">
            <field name="VAR">listVariable</field>
          </block>
        </value>
      </block>
      <block type="lists_setIndex">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">listVariable</field>
          </block>
        </value>
      </block>
      <block type="lists_getSublist">
        <value name="LIST">
          <block type="variables_get">
            <field name="VAR">listVariable</field>
          </block>
        </value>
      </block>
      <block type="lists_split">
        <value name="DELIM">
          <shadow type="text">
            <field name="TEXT">,</field>
          </shadow>
        </value>
      </block>
      <block type="lists_sort" />
    </category>
    <category name="Colour" colour="20">
      <block type="colour_picker" />
      <block type="colour_random" />
      <block type="colour_rgb">
        <value name="RED">
          <shadow type="math_number">
            <field name="NUM">100</field>
          </shadow>
        </value>
        <value name="GREEN">
          <shadow type="math_number">
            <field name="NUM">50</field>
          </shadow>
        </value>
        <value name="BLUE">
          <shadow type="math_number">
            <field name="NUM">0</field>
          </shadow>
        </value>
      </block>
      <block type="colour_blend">
        <value name="COLOUR1">
          <shadow type="colour_picker">
            <field name="COLOUR">#ff0000</field>
          </shadow>
        </value>
        <value name="COLOUR2">
          <shadow type="colour_picker">
            <field name="COLOUR">#3333ff</field>
          </shadow>
        </value>
        <value name="RATIO">
          <shadow type="math_number">
            <field name="NUM">0.5</field>
          </shadow>
        </value>
      </block>
    </category>
    <category name="Output" colour="160">
      <block type="io_input">
        <value name="TEXT">
          <shadow type="text">
            <field name="ID">1</field>
          </shadow>
        </value>
      </block>
      <block type="write_text">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="writeLn_text">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">abc</field>
          </shadow>
        </value>
      </block>
      <block type="output_path">
        <value name="PATH">
          <shadow type="text">
            <field name="TEXT">M 10 10 L 20 20</field>
          </shadow>
        </value>
      </block>
      <block type="js">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT"></field>
          </shadow>
        </value>
      </block>
      <block type="jsf">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT">0</field>
          </shadow>
        </value>
      </block>
    </category>
    <sep />
    <category name="Variables" colour="330" custom="VARIABLE" />
    <category name="Functions" colour="290" custom="PROCEDURE" />
  </xml>
</div>
