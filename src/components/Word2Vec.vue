<template>
  <div class="body">
    <h1 style="text-align: center; font-weight: bold">Word2Vec</h1>
    <div class="search-input">
      <input class="text" type="text" v-model="search" placeholder="Type a word, phrase, or sentence..." />
      <button @click="getAllWords" style="margin-right: -20px; background: #00B4CC; border: none"><img style="height: 30px; " src="../assets/search-logo.png" id="brand-logo" alt="notFound" /></button>
    </div>
    <div class="search-result">
      <p class="box" v-for="item in Words" :key="item.id"> {{ item.title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Words: [],
      search: ''

    };
  },

  methods: {
    getAllWords() {
      fetch(`https://jsonplaceholder.typicode.com/todos/`)
        .then(response => response.json())
        .then(res => {
          console.log(res)
          if (this.search) {
            this.Words = res.filter(item =>
              item.title.toLowerCase().includes(this.search.toLowerCase())
            );
          } else {
            this.Words = res;
          }
        }).catch(error => {
          window.alert("Somthing is wrong")
      });
    }
  },
  created() {
    this.getAllWords();
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
  padding: 0.1rem 1rem  ;
  display: flex  ;
  align-items: center  ;
  justify-content: center  ;
  font-weight: bold;
}
</style>


<input type="text" placeholder="Query" id="VueTables__search_DXx19" class="form-control" value="">
