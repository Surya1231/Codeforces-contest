var user_name = localStorage.surya_user_name ? localStorage.surya_user_name : null;
var contest_list = localStorage.surya_contest_list ? localStorage.surya_contest_list: {};
var user_contest = localStorage.surya_user_contest ? localStorage.surya_user_contest: {};
var last_rendered = localStorage.surya_last_rendered ? localStorage.surya_last_rendered:"Div3";
var last_element = ".sectionhead";
var recent_id = localStorage.surya_recent_id ? localStorage.surya_recent_id : 1300;


var err = '<div class="alert alert-danger"><h4> Codeforces Servers may be down or you may not have working Internet connection <br> Please refresh !!</h4> </div>'
var wait = '<div class="alert alert-success"><h4> We are fetching contest for you please wait ..... <br> Do not refresh the page</h4> </div>'

function fetch_contest(){
  var xhr = new XMLHttpRequest();
  var url = "https://codeforces.com/api/contest.list"
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          console.log("Successfuly fetched");
          fill_contest_list(json);
      }
  };
  xhr.send();
}

function fill_contest_list(json){
  contest_list = {'Div1':[], 'Div2':[] , 'Div3':[], 'Educational':[], 'Hello':[],'Other':[] , 'Global':[]};

  json.result.forEach(function(item){
    if(recent_id<item.id && item.phase == "FINISHED" && (item.name.indexOf("Educational") != -1 || item.name.indexOf("(Div. 3)") != -1 || item.name.indexOf("Div. 2") != -1 || item.name.indexOf("Global") != -1) ) recent_id = item.id;

    if(item.name.indexOf("(Div. 3)") != -1) contest_list['Div3'].push([item.name,item.id]);
    else if(item.name.indexOf("Div. 1") != -1) contest_list['Div1'].push([item.name,item.id]);
    else if(item.name.indexOf("Educational") != -1) contest_list['Educational'].push([item.name,item.id]);
    else if(item.name.indexOf("Div. 2") != -1) contest_list['Div2'].push([item.name,item.id]);
    else if(item.name.indexOf("Global") != -1) contest_list['Global'].push([item.name,item.id]);
    else if(item.name.indexOf('Hello') !=-1 || item.name.indexOf('Good') !=-1 ) contest_list['Hello'].push([item.name,item.id]);
    else contest_list['Other'].push([item.name,item.id]);
  });
  localStorage.surya_contest_list = JSON.stringify(contest_list);
  localStorage.surya_recent_id = recent_id;
  if(last_rendered!=-1) render(last_rendered,last_element);
}

function fetch_user(user){
  user_name = user;
  localStorage.surya_user_name = user_name;
  $('.notf1').html('<h5> Fetching results for : '+user_name+'</h5>');
  $('.notf1').addClass('alert-danger');

  console.log("Started Fetching info for user");
  var xhr = new XMLHttpRequest();
  var url = "https://codeforces.com/api/user.status?handle="+user_name;
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          localStorage.surya_user_contest = xhr.responseText;
          fill_user_contest(json);
      }
      else if(xhr.readyState === 4) {
        $('.notf1').html('<h5> Unable to Update or fetch Results for ' + user_name+'. Try Refreshing</h5>');
      }
  };
  xhr.send();
}

function fill_user_contest(json){
  user_contest = {};
  if(json.status && json.status == "OK"){
    json.result.forEach(function(item){
      if(item.verdict == "OK"){
        if(!user_contest[item.problem.contestId]) user_contest[item.problem.contestId] = new Set();
        user_contest[item.problem.contestId].add(item.problem.index);
      }
    });

    $('.notf1').removeClass('alert-danger');
    $('.notf1').html('<h5> Successfuly fetched results for : '+user_name+'</h5>');
    if(Object.keys(contest_list).length === 0) fetch_contest();
    if(last_rendered!=-1) render(last_rendered,last_element);
  }
}

function render(cont,element){
  $('.notf1').removeClass("d-none")
  $('#right-panel').html(wait);
  $('.menu').removeClass("list-group-item-primary");
  $(element).addClass("list-group-item-primary");
  last_rendered = cont;
  last_element = element;
  localStorage.surya_last_rendered = last_rendered;

  if(!contest_list[cont]){ $('#right-panel').html(err); return; }
  var l = contest_list[cont].length;
  var table = '<table class="table table-bordered"><thead class="thead-dark"><tr><th scope="col">#</th><th scope="col">Contest & URL</th><th scope="col">Solved</th><th scope="col">Unsolved</th></tr></thead><tbody>'
  var ques = 0, c = 0 , total_ques = 0;

  contest_list[cont].forEach(function(item , index){
    var link = "https://codeforces.com/contest/"+item[1];
    var bg_class = "";
    var row_0 = '<th scope="row">'+(index+1)+'</th>';
    var row_1 = '<td>'+item[0]+' '+' :  <a target="_blank" href="'+link+'">'+link+'</a></td>';
    var row_2 = '<td>0</td>';
    var row_3 = '<td>0</td>';

    if(total_questions[item[1]]) { total_ques += total_questions[item[1]].length; row_3 = '<td>'+ total_questions[item[1]].join(' ')+'</td>';}
    else row_3 = '<td>Processing</td>';

    if(user_name && user_contest[item[1]] && user_contest[item[1]].size > 0){
      bg_class = "bg-light";
      var arr = [];
      for (let q of user_contest[item[1]]) arr.push(q);
      arr.sort();
      ques+=arr.length;
      c+=1;
      row_2 = '<td class="bg-info text-white">'+arr.join(' ')+'</td>'
      if(total_questions[item[1]]) {
        var difference = total_questions[item[1]].filter(item => !arr.includes(item));
        if(difference.length) row_3 = '<td class="bg-danger text-white">'+ difference.join(' ')+'</td>';
        else { bg_class = "bg-light-completed"; row_3 = '<td class="bg-success text-white">Completed</td>' }
      }
      else  row_3 = '<td class=" bg-danger text-white">Processing</td>';
    }
    table += '<tr class='+bg_class+'>'+row_0+row_1+row_2+row_3+'</tr>'
  });

  table+="</tbody></table>";
  var notf2 = '<h6 class="w-100"> No of Questions Solved : '+ques+'/'+total_ques+'<span class="float-right"> No of Contest :' + c+'/'+l+'</span></h6>';
  $('#right-panel').html(table);
  $('.notf2').html(notf2);
  $('.sp').removeClass('supersp');
}

function theme(val){
  console.log("Theme Changed");
  $('.right').toggleClass('ddark');
}

function hideshow(c){
  $('.menu').addClass('d-none');
  $(c).toggleClass('d-none');
}

function mob(){
  console.log("Navbar switched");
  $('.sp').toggleClass('supersp');
}

function new_user(){
  var newuser = $('#username').val();
  $('.notf1').removeClass("d-none")
  fetch_user(newuser);
}

function reset_user(){
  user_contest = {};
  user_name = null;
  localStorage.surya_user_name = null;
  localStorage.removeItem("surya_user_contest");
  $('.notf1').html('<h5>Welcome to Codeforces Contest-Portal </h5><p> To know number of questions solved by you click on fetch your status. </p>');
  render(last_rendered,last_element);
}

function initial(){
  try{ contest_list = JSON.parse(contest_list);}
  catch(err){ console.log(err); contest_list = {}; }

  if(user_name && user_name!="null"){
    try{ fill_user_contest(JSON.parse(user_contest));}
    catch(err){ console.log(err); user_contest ={}; }
  }

  console.log(user_name);
  if(Object.keys(contest_list).length != 0) { console.log("Retrived Last"); render(last_rendered,last_element);}
  fetch_contest();
  if(user_name && user_name!="null") fetch_user(user_name);
}

initial();
