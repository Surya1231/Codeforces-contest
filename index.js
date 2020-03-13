var err = '<div class="alert alert-danger"><h4> Codeforces Servers are down or you may not have working Internet connection <br> Please refresh !!</h4> </div>'

var xhr = new XMLHttpRequest();
var url = "https://codeforces.com/api/contest.list"
xhr.open("GET", url, true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        ready(json);
    }
    else if(xhr.readyState === 4){
      $('#right-panel').html(err);
    }
};
xhr.send();

var wait = '<div class="alert alert-success"><h4> We are fetching contest for you please wait ..... <br> Do not refresh the page</h4> </div>'
var obj = {} , obj3 = {};
var div2 = [] , div3 = [] , div1 = [] , edu = [] , other = [];
var userhandle = "";
var is_user = false;
var user = {};

function ready(json){
  json.result.forEach(function(item){
    if(item.name.indexOf("(Div. 3)") != -1) div3.push([item.name,item.id]);
    else if(item.name.indexOf("(Div. 2)") != -1 && item.name.indexOf("#393") == -1) div2.push([item.name,item.id]);
    else if(item.name.indexOf("(Div. 1)") != -1) div1.push([item.name,item.id]);
    else if(item.name.indexOf("Educational") != -1) edu.push([item.name,item.id]);
    else other.push([item.name,item.id]);
  });

  obj['Div1'] = div1;
  obj['Div2'] = div2;
  obj['Div3'] = div3;
  obj['Educational'] = edu;
  obj['Other'] = other;
  fetch('Div3' , '.first');
}

function userfetch(){
  var xhr1 = new XMLHttpRequest();
  userhandle = $('#username').val();
  $('.alert').html('<h5> Fetching results for : '+userhandle+'</h5>');
  $('.alert').addClass('alert-danger');
  obj3 = {};
  var url = "https://codeforces.com/api/user.status?handle="+userhandle
  xhr1.open("GET", url, true);
  xhr1.onreadystatechange = function () {
      if (xhr1.readyState === 4 && xhr1.status === 200) {
          var json = JSON.parse(xhr1.responseText);
          if(json.status == "OK"){
            json.result.forEach(function(item){
              if(item.verdict == "OK"){
                if(!obj3[item.problem.contestId]) obj3[item.problem.contestId] = new Set();
                obj3[item.problem.contestId].add(item.problem.index);
              }
            });
            is_user = true;
            $('.alert').removeClass('alert-danger');
            $('.alert').html('<h5> Successfuly fetched results for : '+userhandle+'</h5>');
            fetch('Div3' , '.first');
          }
      }
      else if(xhr1.readyState === 4) {
        $('.alert').html('<h5> Unable to reach Codeforces. Try Refreshing</h5>');
      }
  };
  console.log("Started fetching");
  xhr1.send();
}

function fetch(str , ele){
  $('#right-panel').html(wait);
  $('.menu').removeClass("active");
  $(ele).addClass("active");
  if(!obj[str]){ $('#right-panel').html(err); return; }
  var l = obj[str].length;
  var table = '<table class="table table-bordered"><thead class="thead-dark"><tr><th scope="col">#</th><th scope="col">Contest & URL</th><th scope="col">Solved</th></tr></thead><tbody>'
  obj[str].forEach(function(item , index){
    var link = "https://codeforces.com/contest/"+item[1];
    var cur=item[0]+' '+' :  <a target="_blank" href="'+link+'">'+link+'</a>'
    table += '<tr><th scope="row">'+(index+1)+'</th><td>'+cur+'</td>';

    if(is_user && obj3[item[1]] && obj3[item[1]].size > 0){
      var arr = [];
      for (let q of obj3[item[1]]) arr.push(q);
      arr.sort();
      table += '<td class="bg-info">'+arr.join(' ')+'</td></tr>';
    }
    else{
      table += '<td> 0</td></tr>';
    }
  });

  table+="</tbody></table>";
  $('#right-panel').html(table);

  $([document.documentElement, document.body]).animate({
       scrollTop: $("#right-panel").offset().top
   }, 2000);
}

function theme(val){
  $('.right').toggleClass('ddark');
}
