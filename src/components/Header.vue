<script>
import SearchBox from './SearchBox/SearchBox';
import Word2Vec from './Word2Vec';


export default {
  components: { Word2Vec, SearchBox },
};
</script>

<template>

  <div class="tabs">
      <input type="radio" name="tabs" id="tabone" checked="checked">
      <label for="tabone">Term Click</label>
      <div class="tab">
        <SearchBox class="search"></SearchBox>
      </div>

    <input type="radio" name="tabs" id="tabtwo">
    <label for="tabtwo">Word2Vec</label>
    <div class="tab">
      <Word2Vec></Word2Vec>
    </div>
  </div>
</template>

<style>

.search{
  height: auto;
  width: 60vw;
  background: #EEEEEE;
  margin: 15%  0 0 50%;
}

.search table {
  background-color: #FFFFFF;
  border-radius: 7px;
  margin-top: 20px;
}
.search h3 {

  color: #2887d4;
  margin-top: 20px;
  margin-left: 70%;

}

.search p{
  text-align: left;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.tabs label {
  order: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 2rem;
  margin-right: 0.2rem;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background ease 0.3s;
}


.tab{
  order: 9;
  width: 100%;
  height: 100%;
  display: none;
  padding: 1rem;
  background: #fff;
}

.tabs input[type="radio"] {
  display: none;
}

.tabs input[type="radio"]:checked + label {
  background: #00B4CC;
}

.tabs input[type="radio"]:checked + label + .tab {
  display: block;
}

@media (max-width: 465px) {
  .tabs .tab,
  .tabs label {
    order: initial;
  }

  .tabs label {
    width: 100%;
    margin-left: 50px;
  }
}

body {
  min-height: 100vh;
  font-weight: 300;
  line-height: 1.5;
  max-width: 60rem;
  display: flex;
}
</style>
