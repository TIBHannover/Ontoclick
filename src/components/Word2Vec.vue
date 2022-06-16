<template>
  <div class="body">
    <h1 style="text-align: center; font-weight: bold">Word2Vec</h1>
    <div class="search-input">
      <input class="text" type="text" v-model="word" placeholder="Type a word, phrase, or sentence..." />
    </div>
    <div class="search-input-count">
      <input class="text" type="text" v-model="number" placeholder="Type a count number .... " />
    </div>
    <button class="submit-input" v-on:click="getAllData()" style="background: #00B4CC; border: none">Search</button>
    <div class="search-result">
      <p class="box" v-for="item in count" :key="item.key"> {{ Object.keys(item).toString() }} </p>
    </div>
  </div>
</template>

<script>
export default {
  data() { 
    return {
      word: '',
      number:'',
      count: []

    };
  },

  methods: {
    getAllData(){
       fetch(`http://localhost:8081/word2vec?word=${this.word}&count=${this.number}`)
       .then(response => response.json()) 
        .then(res => {
        if(this.number){
          this.count=res;
        } else {
          this.count=null;
        }
        }).catch(error => {
          window.alert("Somthing is .....")
      }); 
    }
  },
  created() {
    this.getAllData();
  }
};
</script>

<style>

.body{
  width: 100vw;
  height: 100vh;
  background: white;
}

.search-input{
  width: 60vw;
  display: flex;
  border: 3px solid #00B4CC;
  margin : 2% 0 0 20%;
  padding-right: 20px;
  height: 65px;
  font-size: 18px;
}

.search-input-count{
  width: 60vw;
  display: flex;
  border: 3px solid #00B4CC;
  margin : 2% 0 0 20%;
  padding-right: 20px;
  height: 65px;
  font-size: 18px;
}

.submit-input{
  display: flex;
  border: 3px solid #00B4CC;
  margin : 2% 0 0 20%;
  padding: 10px;
  font-size: 18px;
}

.text {
  width: 100%;
  margin-left: 10px;
  border : none;
  outline: none;
}

.search-result{
  margin : 5% 20% 0 20%;
  display: flex  ;
  flex-direction: row  ;
  flex-wrap: wrap ;
  cursor: pointer;


}
.box {
  font-family: sans-serif  ;
  width: auto  ;
  flex-grow: 1  ;
  height: 6rem  ;
  font-size: 1.8rem  ;
  background: #00B4CC  ;
  text-align: center  ;
  margin: 0.2rem  ;
  padding: 0.1rem 0.5rem  ;
  display: flex  ;
  align-items: center  ;
  justify-content: center  ;
  font-weight: bold;
}
</style>

