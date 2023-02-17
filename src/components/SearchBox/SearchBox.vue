<template>
<div >
  <div class="row">
    <div class="col-sm-7 text-left">
      <img class="logo" src="/static/img/tib-full-en.png">
      <h3 class="pull-left">TERMCLICK</h3>
      <i class="pull-right hover-action fas fa-eraser clear-icon hoverer" title="Clear All" id="clearButton"></i>
      <button class="pull-right hover-action export-button" title="Export" id="exportButton">
        <i class="pull-right fas fa-file-download export-icon hoverer"></i>
        <p class="pull-right" id="exportCounter"></p>
      </button>
      <!-- <button class="pull-right spaced" @click='keyResetter()'>RESET KEY</button> -->
    </div>
  <div id="apkey" style="display:none"></div>
  </div>
  <v-server-table :url="url" :columns="columns" :options="options">
    <div slot='conceptRec' class='form-group' style="display: none;">
      <treeselect :multiple="false" :clearable="false" :select='selectAPI()' :close-on-select="true" :options="conceptrecogniserOptions" v-model="conceptrecogniserValue" placeholder="Select Concept Recognizer" name="conceptRecogniser" />
    </div>
     <div slot='ontologiesFilter' class='form-group'>
        <treeselect :multiple="true" :clearable="false" ::select='queryFieldSave()' close-on-select="true" :flat="true" :options="queryFieldOptions" style="z-index:6;" placeholder="Filter by Query Field" v-model="queryFieldValue" />
     </div> 

<div slot='ontologiesFilter' class='form-group'>
        <div class="cascading-dropdown">
    <div class="dropdown">
      <span>Schema&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
      <select id="schema" v-model="selectedSchema" @change="onChangeSchema" style="width: 300px; text-overflow: ellipsis;">
        <option value="">Select a Schema</option>
        <option
          v-for="(schema, index) in listSchemas"
          :value="schema.id"
          :key="index"
        >
          {{ schema.id }}
        </option>
      </select>
    </div>

    <div id="classificationdiv" class="dropdown" style="display: none;">
      <span>Classification:</span>
      <select id="classification" v-model="selectedClassification" @change="onChangeClassification" style="width: 300px; text-overflow: ellipsis;">
        <option value="">Select a Classification</option>
        <option
          v-for="(classification, index) in listClassifications"
          :value="classification.id"
          :key="index"
        >
          {{ classification.id }}
        </option>
      </select>
    </div>

    <div id="ontologydiv" class="dropdown" style="display: none;">
      <span>Ontology&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
      <select id="ontology" v-model="selectedOntology" style="width: 300px; text-overflow: ellipsis;">
        <option value="">Select an Ontology</option>
        <option
          v-for="(ontology, index) in listOntologies"
          :value="ontology.id"
          :key="index"
        >
          {{ ontology.label }}
        </option>
      </select>
    </div>

    <!-- <p v-if="selectedSchema">Selected Schema : {{ this.selectedSchema }}</p>
    <p v-if="selectedClassification">Selected Classification : {{ this.selectedClassification }}</p>
    <p v-if="selectedOntology">Selected Ontology : {{ this.selectedOntology }}</p> -->
  </div>
      </div>

    <template slot="child_row" scope="props">
        <div class='text-wrap' v-if="props.row.definition"><b>Definition: </b>{{props.row.definition[0]}}</div>
        <div class='text-wrap' v-if="props.row.synonym"><b>Synonyms: </b>{{ typeof props.row.synonym === 'string' ? props.row.synonym : props.row.synonym.join(', ') }}</div>
        <div class='text-wrap' v-if="props.row.short_form && props.row.short_form != props.row.prefLabel && !props.row.iri.includes(props.row.short_form)"><b>Short Form: </b>{{props.row.short_form}}</div>
        <div class='text-wrap' v-if="props.row.type"><b>Type: </b>{{props.row.type}}</div>
        <button v-bind:id="props.row.iri+'button'" @click="getTermAnnotations(props.row.ontology_name,props.row.type,props.row.iri)" style="background-color: #4682B4; color: white; border: none;">More Information ...</button>
        <p v-bind:id="props.row.iri"></p>
      </template>
    <template slot="notation" scope="props">
        <span :id='"notation"+props.index' v-if="props.row.notation">{{props.row.notation}}</span>
        <span :id='"notation"+props.index' v-else-if="props.row.short_form">{{props.row.ontology_name.toUpperCase()+':'+props.row.short_form}}</span>
        <a class="hover-action far fa-copy" @click='copyContent("notation"+props.index)'></a>
      </template>
    <template slot="prefLabel" scope="props" v-if="props.row.prefLabel">
        <a :id='"prefLabel"+props.index' v-if="props.row.prefLabel" v-bind:href="props.row.iri" target="_blank">{{props.row.prefLabel}}</a>
        <a class="hover-action far fa-copy" @click='copyContent("prefLabel"+props.index)'></a>
      </template>
    <template slot="ontology" scope="props" v-if="props.row.ontology_name">
        <a :id='"ontology"+props.index' v-if="props.row.ontology_name" v-bind:href="'https://service.tib.eu/ts4tib/ontologies/' + props.row.ontology_name" target="_blank">{{props.row.ontology_name}}</a>
        <a class="hover-action far fa-copy" @click='copyContent("ontology"+props.index)'></a>
      </template>
    <template slot="spantext" scope="props">
        <span :id='"spantext"+props.index' v-if="props.row.prefLabel && props.row.notation"></span>
        <a class="hover-action far fa-copy" title="Identifier + Label" @click='copyContentS(props.row.notation + " " + props.row.prefLabel)' v-if="props.row.notation && props.row.prefLabel"></a>
        <a class="hover-action fas fa-highlighter" title="Text span + Identifier + Label" @click="doCopy(props.row.notation, props.row.prefLabel)" v-if="props.row.notation && props.row.prefLabel"></a>
        <a class="hover-action far fa-save save-button" title="Save to history" @click="storeData(props.row.notation, props.row.prefLabel)" v-if="props.row.notation && props.row.prefLabel && link"></a>
      </template>
  </v-server-table>
<p style="padding: 30px 0px 0px 0px;"><center>This tool is forked from the original <a href="https://github.com/azankl/Ontoclick" target="_blank">OntoClick</a> tool, funded by <a href="https://nfdi4ing.de" target="_blank">NFDI4ING</a> and maintained by <a href="https://www.tib.eu/" target="_blank">TIB</a>.  </center></p>
</div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
// import {
  // options,
  // ontologyByAcronym
// } from './OntologyData/tree'
import queryFields from './OntologyData/queryFields'
import axios from "axios";

function copyElementContent(srcElementId) {
  let srcElement = document.getElementById(srcElementId)
  var range = document.createRange();
  range.selectNodeContents(srcElement);
  let selection = document.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('Copy');
  selection.removeAllRanges();
}

function copyElementContentS(cps) {
 const el = document.createElement('textarea');
  el.value = cps;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

function getStorageLen(data) {
  let counter = 0;
  for (var i = 0; i < data.length; i++) {
    if (Array.isArray(data[i])) {
      counter++;
    }
  }
  return counter;
}

function getPrevID(data) {
  for (var i = data.length; i >= 0; i--) {
    if (data[i] && !Array.isArray(data[i]) && (data[i].match(/^PMID: /) || data[i].match(/^http/))) {
      return data[i];
    }
  }
}

function enterPress() {
  let search = document.getElementsByClassName('VueTables__search')[0].children[0];
  const enter = new KeyboardEvent('keyup', {
    key: 'Enter',
  });
  search.dispatchEvent(enter);
}

function getPubMedID() {
  try {
    return [unescape(document.location.search.match(/id=(.*)\&/)[1]),
            unescape(document.location.search.match(/href=(.*)/)[1])];
  } catch(e) {
    return null;
  }
}

function changeExportName() {
  // PERSISTANT STORAGE
  // chrome.storage.local.get(['storage'], function(storage) {
  //   if (storage.storage === undefined) {
  //     document.getElementById('exportButton').innerText = 'export (0)';
  //   } else {
  //     document.getElementById('exportButton').innerText = 'export (' + storage.storage.length + ')';
  //   }
  // });

  // SESSION STORAGE (Each tab is seperate from another)
  if (sessionStorage.getItem('storage') === null) {
    document.getElementById('exportCounter').innerText = '0';
  } else {
    let len = getStorageLen(JSON.parse(sessionStorage.getItem('storage')));
    document.getElementById('exportCounter').innerText = len;
  }
}

function getStorage() {
  // PERSISTANT STORAGE
  // chrome.storage.local.get(['storage'], function(res) {
    // console.log(res);
  // });

  // SESSION STORAGE (Each tab is seperate from another)
  if (sessionStorage.getItem('storage') === null) {
    console.log(sessionStorage.getItem('storage'));
  } else {
    console.log(JSON.parse(sessionStorage.getItem('storage')));
  }
  console.log(getPubMedID());
}

function clearStorage() {
  // PERSISTANT STORAGE
  // chrome.storage.local.clear();

  // SESSION STORAGE
  sessionStorage.clear();
  changeExportName();
}

function downloadCSV() {
  // PERSISTANT STORAGE
  // chrome.storage.local.get(['storage'], function(res) {
    // if (res.storage !== undefined) {
    //   var csv = 'text,notation,label\n';

    //   res.storage.forEach(function(row) {
    //     csv += row.join(',');
    //     csv += '\n';
    //   });
    //   // console.log(csv);
    //   var hiddenElement = document.createElement('a');
    //   hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    //   hiddenElement.target = '_blank';
    //   hiddenElement.download = 'download.csv';
    //   hiddenElement.click();
  //   }
  // })

  if (sessionStorage.getItem('storage') !== null) {
    let storage = JSON.parse(sessionStorage.getItem('storage'));
    var csv = '';

    storage.forEach(function(row) {
      if (Array.isArray(row)) {
        csv += row.join(',');
      } else {
        csv += row;
      }
      csv += '\n';
    })

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'download.csv';
    hiddenElement.click();
  }
  clearStorage();
}

function isArrayInArray(arr, item){
  var item_as_string = JSON.stringify(item);

  var contains = arr.some(function(ele){
    return JSON.stringify(ele) === item_as_string;
  });
  return contains;
}

let conceptrecogniserValue = 'TIB Terminology Service Search'
if(localStorage.conceptrecogniserValue){
  conceptrecogniserValue = localStorage.conceptrecogniserValue
}
let queryFieldValue = ['label']
if(localStorage.queryFieldValue){
  queryFieldValue = localStorage.queryFieldValue.split(",")
}
export default {
  name: 'search-box',
  components: {
    Treeselect
  },
  data() {
    let query = document.location.search.match(/query=([^&]*)/)
    // let ontology = document.location.search.match(/ontology=(.*)/)
    query = query ? unescape(query[1]) : undefined
    // ontology = ontology ? unescape(ontology[1]) : undefined
    let pid = getPubMedID();
    let link = true;
    if (pid === null) {
      link = false;
    }
    return {
      commenttext: "Retry",
      listSchemas: [],
      listClassifications: [],
      listOntologies: [{ id: '*', label: '*' }],
      selectedSchema: "",
      selectedClassification: "",
      selectedOntology: "",
      loading: true,
      url: 'https://google.com', // Not required
      columns: ['notation', 'prefLabel' , 'ontology', 'spantext'],
      options: {
        initFilters: {
          'GENERIC': query
        },
        sortable: [],
        perPage: 5,
        pagination: {
          chunk: 3
        },
        texts: {
          filterPlaceholder: 'Query'
        },
        skin: 'table table-hover',
        uniqueKey: 'notation'
      },
      query: query,
      queryFieldValue: queryFieldValue,
      queryFieldOptions: queryFields,
      results: [],
      request: null,
      link: link,
      conceptrecogniserValue: conceptrecogniserValue ,
      conceptrecogniserOptions: [/*{
        id: 'ncbos',
        label: 'NCBO Bioportal Search',
      }, {
        id: 'ncboa',
        label: 'NCBO Bioportal Annotator',
      },{
        id: 'pryzm',
        label: 'Pryzm Health CR'
      },*/ {
        id: 'ebi',
        label: 'TIB Terminology Service Search'
      }/* , {
        id: 'jax',
        label: 'HPO Jax',
      },{
        id: 'neural',
        label: 'Neural Concept Recogniser',
      }*/]
    }
  },
   created() {
    this.loadSchemas();
  },
  methods: {

getTermAnnotations(ontology,type,iri){

  if (document.getElementById(iri+'button').innerHTML == "Less Information | x"){
    document.getElementById(iri+'button').innerHTML = "More Information ...";
    document.getElementById(iri+'button').style.backgroundColor = "#4682B4";
    document.getElementById(iri+'button').style.color = "white";
    document.getElementById(iri).innerHTML = "";
    return;
  }
  
  let termTypeURLComponent = "/terms/";
  if (type == "property")
    termTypeURLComponent = "/properties/";
  else if (type == "individual")
    termTypeURLComponent = "/individuals/";  

    axios
      .get(
        "https://service.tib.eu/ts4tib/api/ontologies/" +
          ontology +
          termTypeURLComponent +
          encodeURIComponent(encodeURIComponent(iri))
      )
      .then((res) => {
        let annotationText = "";
        document.getElementById(iri).innerHTML = ""; 
        try {
          const annotations = Object.keys(res.data.annotation).map((comm) => {
            return {
              [comm]: res.data.annotation[comm]
            };
          });
 
          for (let i = 0; i < annotations.length; i++) {
            
            annotationText +='<b>'
            annotationText += Object.keys(annotations[i]).join("-");
            annotationText+=': </b>'

            annotationText += Object.values(annotations[i]).join("-");
            annotationText +='<br>';
            document.getElementById(iri).innerHTML = annotationText;   
            document.getElementById(iri+'button').innerHTML = "Less Information | x"; 
            document.getElementById(iri+'button').style.backgroundColor = "#E4F6F8";
            document.getElementById(iri+'button').style.color = "#008CBA";
           }

        } catch (error) {
          this.commenttext = error;
        }
      });

this.commenttext = "Retry";

},
       loadSchemas() {
      axios
        .get(
          "https://service.tib.eu/ts4tib/api/ontologies/schemakeys?page=0&size=1000000"
        )
        .then((res) => {
          try {
            const schemaList = res.data._embedded.strings.map((schema) => {
              return {
                id: schema.content,
              };
            });
            this.listSchemas = schemaList;
          } catch (error) {
            this.listSchemas = [];
            this.listClassifications = [];
            this.listOntologies = [];
          }
        });
    },
    onChangeSchema() {
      axios
        .get(
          "https://service.tib.eu/ts4tib/api/ontologies/schemavalues?schema=" +
            this.selectedSchema
        )
        .then((res) => {
          try {
            const classificationList = res.data._embedded.strings.map(
              (classification) => {
                return {
                  id: classification.content,
                };
              }
            );
            this.listClassifications = classificationList;
            this.listOntologies = [];
            this.selectedClassification = "";
            this.selectedOntology = "";           
            document.getElementById("classificationdiv").style.display = "block";
            document.getElementById("ontologydiv").style.display = "none";
              
          } catch (error) {
            this.listClassifications = [];
            this.listOntologies = [];
            this.selectedClassification = "";
            this.selectedOntology = "";
            document.getElementById("classificationdiv").style.display = "none";
            document.getElementById("ontologydiv").style.display = "none";
          }
        });
    },
    onChangeClassification() {
      axios
        .get(
          "https://service.tib.eu/ts4tib/api/ontologies/filterby?schema=" +
            this.selectedSchema +
            "&classification=" +
            this.selectedClassification +
            "&page=0&size=1000000"
        )
        .then((res) => {
          try {
            const ontologyList = res.data._embedded.ontologies.map((ont) => {
              return {
                id: ont.ontologyId,
                label: ont.config.title || "",
              };
            });
            this.listOntologies = ontologyList;
            this.selectedOntology = "";
            document.getElementById("ontologydiv").style.display = "block";
          } catch (error) {
            this.listOntologies = [];
            this.selectedOntology = "";
            document.getElementById("ontologydiv").style.display = "none";
          }
        });
    },
    copyContent(srcElementId) {
      copyElementContent(srcElementId);
      window.parent.postMessage({
        type: 'copied'
      }, "*")
    },
    replaceWithContent(srcElementId) {
      copyElementContent(srcElementId);
      window.parent.postMessage({
        type: 'copied-paste'
      }, "*")
    },
    copyModel(model) {},
    copyContentS(srcstr) {
      copyElementContentS(srcstr);
      window.parent.postMessage({
        type: 'copied'
      }, "*")
    },
    doCopy(rownotation, label) {
      let keyword = document.getElementsByClassName('VueTables__search')[0].children[0].value;
      let val = '"' + keyword + '","' + rownotation + '","' + label + '"';
      copyElementContentS(val);
      window.parent.postMessage({
        type: 'copied'
      }, "*")
    },
    storeData(notation, label) {
      let keyword = document.getElementsByClassName('VueTables__search')[0].children[0].value;
      keyword = '"' + keyword + '"';
      let data = [keyword, notation, label];

      let options = getPubMedID();
      let link;
      // SESSION STORAGE
      if (sessionStorage.getItem('storage') === null) {
        if (options[0] !== 'null') {
          link = [options[0].replace(/^\s+|\s+$/g, '')];
        } else {
          link = [options[1]];
        }
        link.push(data);
        sessionStorage.setItem('storage', JSON.stringify(link));
      } else {
        let currentStorage = JSON.parse(sessionStorage.getItem('storage'));
        if (!isArrayInArray(currentStorage, data)) {
          let id;
          if (options[0] !== 'null') {
            id = options[0].replace(/^\s+|\s+$/g, '');
          } else {
            id = options[1];
          }
          if (id === getPrevID(currentStorage)) {
            currentStorage.push(data);
          } else {
            currentStorage.push(id);
            currentStorage.push(data);
          }
          sessionStorage.setItem('storage', JSON.stringify(currentStorage));
        }
      }

      // PERSISTANT STORAGE
      // chrome.storage.local.get(['storage'], function(storage) {
      //   if (JSON.stringify(storage) === '{}') {
      //     chrome.storage.local.set({'storage': [data]});
      //   } else {
      //     if (!isArrayInArray(storage.storage, data)) {
      //       storage.storage.push(data);
      //       chrome.storage.local.set({'storage': storage.storage});
      //     }
      //   }
      // })
      changeExportName();
    },
    selectAPI() {
      localStorage.conceptrecogniserValue = this.conceptrecogniserValue
      try {
        document.getElementById('exportButton').addEventListener('click', downloadCSV);
        changeExportName();
        document.getElementById('clearButton').addEventListener('click', clearStorage);
        if (getPubMedID() === null) {
          document.getElementById('exportButton').style.display = 'none';
          document.getElementById('clearButton').style.display = 'none';
          var all = document.getElementsByClassName('save-button');
          for (var i = 0; i < all.length; i++) {
            all[i].style.display = 'none';
          }
          let app = document.getElementById('app');
          app.style.width = '770px';
          app.style.height = '600px';
        }

        let search = document.getElementsByClassName('VueTables__search')[0].children[0].value;
        enterPress();
      } catch(err) {
        // do nothing
      }
    },
    queryFieldSave() {
      localStorage.queryFieldValue = this.queryFieldValue
    },
    alerter() {
/*       if(!localStorage.apiKeyOntoclick){
        let apkey = prompt('API key not found. This might cause problems when using plugin. Your key can be set by creating account at: https://bioportal.bioontology.org/account. You can choose to cancel this popup and press the reset key button to come back and update later.')
        apkey ? localStorage.apiKeyOntoclick = apkey : localStorage.apiKeyOntoclick = 'fae307aa-db9d-43be-8f9d-1c04444ad4d4'
      }
      document.getElementById('apkey').innerHTML =  localStorage.apiKeyOntoclick */
    },
    keyResetter() {
      let conf = prompt("Please enter 'reset' without quotes to reset API key")
      if (conf == 'reset'){
        localStorage.apiKeyOntoclick = ''
        alert('Reset of API key done, please reload plugin to input new API key')
      }
    }
  },
   mounted(){
    this.alerter()
 },
}
</script>

<style src="@riophae/vue-treeselect/dist/vue-treeselect.min.css">
</style><style>tr {
  cursor: pointer;
}

tr a.hover-action {
  opacity: 0;
}

tr:hover a.hover-action {
  opacity: 1;
}

li.VuePagination__pagination-item-next-chunk,
li.VuePagination__pagination-item-prev-chunk {
  display: none;
}

div.VuePagination p {
  margin: 0;
}

ul.pagination {
  margin: 0;
}

ul.pagination>li>a,
.pagination>li>span {
  color: #039be5;
}

.vue-treeselect {
  z-index: 4;
}

.search-box {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search-box .controls {
  flex-grow: 0;
  flex-shrink: 0;
}

.search-box .content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.VueTables__child-row-toggler {
    width: 16px;
    height: 16px;
    line-height: 16px;
    display: block;
    margin: auto;
    text-align: center;
}

.VueTables__child-row-toggler--closed::before {
    content: "+";
}

.VueTables__child-row-toggler--open::before {
    content: "-";
}

.text-wrap {
  word-wrap: normal;
  white-space: pre-line;
}

.logo {
  height: 30px;
  width: 184px;
}

.clear-icon {
  display: block;
}

.export-icon {
  display: block;
  padding-left: 5px;
}

.save-button {
  display: inline-block;
}

.export-button {
  padding: 0;
  padding-right: 5px;
  border: none;
  background: none;
}

i.hoverer:hover {
  cursor:pointer;
}

.spaced {
  margin-right:8px;
  font-size:8px;
  padding:1px;
}


</style>
