var second_year_string = "thatssatya;sanjana_287;Dharmender7;dqoder;pranaykanjolia;akash989 ;Kapil_Varma;kshitij42;contact2prateek21;vedant3620;Satyam_Mishra;foxy_kid;hemant_mnit;abhi_csnitj;captainrogers;esh_08;Himanshu_77;achala8817;laxmansharma14999;Niteshsharma5;siddharthsngh;a_hsay;Codebuddy1903;Diwanshu885;mohit_24;Ksoni99;navjot1234;deadpool_99;Rituverma12;appmnit;nandinitheroy;rohit2000123sa;Tanujagar621;Kamal;FEVERISH_64;abpk;Priyanka;heet_2312;sgyaswal;thirwanivishal3;hipsi;nowucmee;dhwani_a08;hcv_roy1512;soni.sanskar;Harshagoyal;aj1234;sachin_raghav;heytheru;bansalpriyal;yashwant.lohar;Great1209;alexashu;pranavsinduraalt;Shivdeep_Singh;mayank_0367;sonalagrawal1;gupta.mukulmg7;satvik_gupta144;Somya;Saransh2000;heinz_doofenshmirtz;Kaustav1 ;anuragjain23;2018ucp1470;Dhairya_Patel;prateek_1106;rachit1797;Keshav_sharma_ji_;devanshim2207;Vaish__;pranshu_02;gunjan__;vaibhzz;iamnitinb149";
var second_year_users = second_year_string.split(';');
var second_year_cf_leaderboard = null;
var recent_contest_leaderboard = localStorage.surya_recent_contest_leaderboard ? localStorage.surya_recent_contest_leaderboard : null;


if(localStorage.second_year_cf_leaderboard){
  try{
    second_year_cf_leaderboard = JSON.parse(localStorage.second_year_cf_leaderboard);
  }
  catch{
    second_year_cf_leaderboard = null;
  }
}

function fetch_alltime_codeforces(handles_string, render){
  console.log("fetch_alltime_codeforces");
  var xhr = new XMLHttpRequest();
  var url = "https://codeforces.com/api/user.info?handles="+handles_string;
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          if(json.status=="OK") {
            json = json.result;
            json.sort((obj1,obj2) => {
              var t1 = obj1.maxRating ? obj1.maxRating : 0;
              var t2 = obj2.maxRating ? obj2.maxRating : 0;
              return t2-t1;
            });
            localStorage.second_year_cf_leaderboard = JSON.stringify(json);
            second_year_cf_leaderboard = json;
            if(render) render_alltime_leaderboard(second_year_cf_leaderboard);
          }
          else conole.log("error",json);
      }
  };
  xhr.send();
}

function render_alltime_leaderboard(json){
  last_rendered = -1;
  var table = '<table class="table table-bordered table-striped"><thead class="thead-dark"><tr><th scope="col">#</th><th scope="col">Name</th><th scope="col">Username</th><th scope="col"> Cur-Rating </th> <th scope="col">Max-Rating</th></tr></thead><tbody>'
  json.forEach((item,index) => {
    var link = 'https://codeforces.com/profile/'+item.handle;
    var cur_rating = item.rating ? item.rating : "Not Rated";
    var max_rating = item.maxRating ? item.maxRating : "Not Rated";
    var full_name = item.firstName ? item.firstName+' '+item.lastName : item.handle;
    var row_0 = '<th scope="row">'+(index+1)+'</th>';
    var row_1 = '<td>'+full_name+'</td><td><a target="_blank" href="'+link+'">'+item.handle+'</a></td>';
    var row_2 = '<td>'+cur_rating+'</td>';
    var row_3 = '<td>'+max_rating+'</td>';
    table += '<tr>'+row_0+row_1+row_2+row_3+'</tr>';
  });
  table+="</tbody></table>";
  var notf2 = '<h6> Codeforces leaderboard 2nd year MNIT(Jaipur) </h6>';
  $('#right-panel').html(table);
  $('.notf2').html(notf2);
}


function fetch_contest_standing(id,handles_string){
  var xhr = new XMLHttpRequest();
  var url = "https://codeforces.com/api/contest.standings?contestId="+id+"&handles="+handles_string;
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          var name = json.result.contest;
          json = json.result.rows;
          json.sort((obj1,obj2) => {
           return obj1.rank - obj2.rank;
          });
          render_contest_leaderboard(name , json);
      }
  };
  xhr.send();
}



function render_contest_leaderboard(contest , json){
  last_rendered = -1;
  var table = '<table class="table table-bordered table-striped"><thead class="thead-dark"><tr><th scope="col">#</th><th scope="col">Username</th><th scope="col"> Score </th> <th scope="col"> Rank </th></tr></thead><tbody>'
  json.forEach((item,index) => {
    console.log(item);
    var rank = item.rank;
    var point = item.points;
    var user_name = item.party.members[0].handle;
    var link = 'https://codeforces.com/profile/'+user_name;
    var row_0 = '<th scope="row">'+(index+1)+'</th>';
    var row_1 = '<td><a target="_blank" href="'+link+'">'+user_name+'</a></td>';
    var row_3 = '<td>'+rank+'</td>';
    var row_2 = '<td>'+point+'</td>';
    table += '<tr>'+row_0+row_1+row_2+row_3+'</tr>';
  });
  var link = "https://codeforces.com/contest/"+contest.id;
  table+="</tbody></table>";
  var notf2 = '<h6>#'+contest.id+' '+contest.name+' </h6><a target="_blank" href="'+link+'">'+link+'</a>';
  console.log(contest);
  $('#right-panel').html(table);
  $('.notf2').html(notf2);
}


function all_time_leaderboard(element){
  $('.notf1').addClass("d-none")
  $('.menu').removeClass("list-group-item-primary");
  $(element).addClass("list-group-item-primary");
  $('.sp').removeClass('supersp');
  console.log(second_year_cf_leaderboard);
    if(second_year_cf_leaderboard){
      render_alltime_leaderboard(second_year_cf_leaderboard);
      fetch_alltime_codeforces(second_year_string,false);
    }
    else{
      fetch_alltime_codeforces(second_year_string,true);
    }
}

function contest_leaderboard(id , element){
  $('.notf1').addClass("d-none");
  $('.menu').removeClass("list-group-item-primary");
  $(element).addClass("list-group-item-primary");
  $('.sp').removeClass('supersp');
  $('#right-panel').html(' ');
  if(id==-1) id = recent_id;
  else id = $('#c_id').val();
  $('.notf2').html(wait);
  fetch_contest_standing(id,second_year_string);
}


function codechef(){
  $('.notf2').html('<h6 class="w-100"> Coming Soon !!!</h6>');
  $('#right-panel').html(' ');
  $('.sp').removeClass('supersp');
}
