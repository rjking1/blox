<script>
  import { doFetchPost } from './common.js'
  import { onMount } from 'svelte'
  import Blockly from 'blockly'
  import { uicode, output } from './stores.js'

  const KEY = 'vikingBloxUIStorage'

  let workspace
  let files = []
  let file_name = 'test1'

  onMount( async() => {
    files = await doFetchPost('keyvalues', "select name from kv where user='richard' and project='bloxUI' order by name")   // maybe split from single json entry later

    Blockly.defineBlocksWithJsonArray([
      {
        "type": "html_div",
        "message0": "div",
        "args0": [],
        "message1": "%1",
        "args1": [
          {"type": "input_statement", "name": "BLOCK"}
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 230
      },
      {
        type: 'html_input',
        message0: 'Input ID=%1 TYPE=%2 VALUE=%3',  
        args0: [
          {
            type: 'field_input',
            name: 'ID',
            text: '1',
          },
          {
            type: 'field_input',
            name: 'TYPE',
            text: 'text',
          },
          {
            type: 'field_input',
            name: 'VALUE',
            text: '',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'Input element',
        helpUrl: '',
      },
      {
        type: 'html_button',
        message0: 'Button ID=%1 CAPTION=%2 FUNCTION=%3',
        args0: [
          {
            type: 'field_input',
            name: 'ID',
            text: '1',
          },
          {
            type: 'field_input',
            name: 'CAPTION',
            text: 'Button1',
          },
          {
            type: 'field_input',
            name: 'FUNCTION',
            text: 'click1()',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'Button element',
        helpUrl: '',
      },
      {
        type: 'html_textarea',
        message0: 'Textarea ID=%1 TEXT=%2',
        args0: [
          {
            type: 'field_input',
            name: 'ID',
            text: '1',
          },
          {
            type: 'field_input',
            name: 'TEXT',
            text: ' ',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'Textarea element',
        helpUrl: '',
      },      
      {
        type: 'html_element',
        "message0": 'html element %1',
        "args0": [
          {
            type: 'field_input',
            name: 'TEXT',
            text: ' ',
          },
        ],
        "message1": "%1",
        "args1": [
          {"type": "input_statement", "name": "BLOCK"}
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'html element',
        helpUrl: '',
      },
      {
        type: 'html_text',
        "message0": 'html text %1',
        "args0": [
          {
            type: 'field_input',
            name: 'TEXT',
            text: ' ',
          },
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 230,
        tooltip: 'html text',
        helpUrl: '',
      },
    ])

    Blockly.JavaScript['html_div'] = function (block) {
      return '<div>\n' + 
        Blockly.JavaScript.statementToCode(block, 'BLOCK') + 
        '</div>\n'
    }    
    Blockly.JavaScript['html_input'] = function (block) {
      let id = block.getFieldValue('ID')
      let typ = block.getFieldValue('TYPE')
      let v = block.getFieldValue('VALUE')
      return '<input id=input' + id + ' type=' + typ + ' value=' + v + ' />\n'
    }
    Blockly.JavaScript['html_button'] = function (block) {
      let id = block.getFieldValue('ID')
      let caption = block.getFieldValue('CAPTION')
      let fn = block.getFieldValue('FUNCTION')
      return '<button id=button' + id + ' onClick="' + fn + '">' + caption + '</button>\n'
    }
    Blockly.JavaScript['html_textarea'] = function (block) {
      let id = block.getFieldValue('ID')
      let txt = block.getFieldValue('TEXT')
      return '<textarea id=textarea' + id + ' rows="4" cols="50" >' + txt + '</textarea>\n'
    }
    Blockly.JavaScript['html_element'] = function (block) {
      let txt = block.getFieldValue('TEXT')
      return '<' + txt + '>\n' + 
        Blockly.JavaScript.statementToCode(block, 'BLOCK') + 
        '</' + txt + '>\n'
    }    
    Blockly.JavaScript['html_text'] = function (block) {
      let txt = block.getFieldValue('TEXT')
      return txt + '\n'
    }

    workspace = Blockly.inject(document.getElementById('blocklyUIDiv'), {
      toolbox: document.getElementById('UItoolbox'),
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

  function myUpdateFunction(event) {
    $uicode = Blockly.JavaScript.workspaceToCode(workspace)
    backupBlocks()
    console.log('ui blocks changed')
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
    let row = await doFetchPost('keyvalues', "select name,value from kv where user='richard' and project='bloxUI' and name='" + file_name + "'") 
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
      let sql = "replace into kv (user,project,name,value) values ('richard','bloxUI','" + file_name + "','" + text + "')"
      // console.log(sql)
      let res = await doFetchPost('keyvalues', sql) 
      // console.log(res)
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
  #blocklyUIDiv {
    height: 900px;
    width: 650px;
    bottom: 0;
    text-align: left;
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<div>
  <div id="blocklyUIDiv" />
  <xml id="UItoolbox" style="display:none">
    <category name="HTML" colour="120">
      <block type="html_div">
      </block>
      <block type="html_input">
        <value name="ID">
          <shadow type="text">
            <field name="TEXT">1</field>
          </shadow>
        </value>
        <value name="TYPE">
          <shadow type="text">
            <field name="TEXT">text</field>
          </shadow>
        </value>
        <value name="VALUE">
          <shadow type="text">
            <field name="TEXT"> </field>
          </shadow>
        </value>
      </block>
      <block type="html_button">
        <value name="ID">
          <shadow type="text">
            <field name="TEXT">1</field>
          </shadow>
        </value>
        <value name="FUNCTION">
          <shadow type="text">
            <field name="TEXT">click1()</field>
          </shadow>
        </value>
        <value name="CAPTION">
          <shadow type="text">
            <field name="TEXT">Button1</field>
          </shadow>
        </value>
      </block>
      <block type="html_textarea">
        <value name="ID">
          <shadow type="text">
            <field name="TEXT">1</field>
          </shadow>
        </value>
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT"> </field>
          </shadow>
        </value>
      </block>
      <block type="html_element">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT"> </field>
          </shadow>
        </value>
      </block>
      <block type="html_text">
        <value name="TEXT">
          <shadow type="text">
            <field name="TEXT"> </field>
          </shadow>
        </value>
      </block>
    </category>
    <sep />
  </xml>
</div>
