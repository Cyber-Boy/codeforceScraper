//To remove tags of html using regex
function removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
}

/******************------------------------------------------------------------------------------------------------------------------------------------------**************/

//Checks on going contests (div not sorted)
function contests(){
    url = "https://codeforces.com/api/contest.list?gym=false";
    //console.log(fetch(url))
    fetch(url).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        console.log(data.result[0].name)
        let targetDiv = document.getElementsByClassName("contests")[0];
        targetDiv.textContent = data.result[0].name;
    })
}

/******************------------------------------------------------------------------------------------------------------------------------------------------**************/

//Simply returns full card of user-info... Includes current data and rating graph as well (calls user rating)
function userSearch(){
    username = document.getElementById("searchbox").value;
    url = "https://codeforces.com/api/user.info?handles=" + username;
    fetch(url).then((response)=>{
        console.log(response)
        return response.json();
    }).then((data)=>{
        console.log(data);
        //print all the data that is being shared
        user = data.result[0]
        result = `Name: ${user.firstName + user.lastName}
        Handle: ${user.handle}
        Location: ${user.city},${user.country}
        Organisation: ${user.organization}
        Friends: ${user.friendOfCount}
        Rank: ${user.rank}
        Rating: ${user.rating}
        Max Rating: ${user.maxRating}
        Max Rank: ${user.maxRank}`;
        //document.getElementById("avatar").innerHTML = "hello";//<img src='" +user.titlePhoto +"' />"
        document.getElementById("response").innerHTML = result; 
        userRating(username);   
    })
}

/******************------------------------------------------------------------------------------------------------------------------------------------------**************/

//For creating the rating graph
function userRating(username){
    url = "https://codeforces.com/api/user.rating?handle=" + username;
    console.log(url)
    fetch(url).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data)
        let i = 1;
        let xVals = [];
        let yVals = []
        data.result.forEach(contest =>{
            console.log("data: "+ i + " " + contest.oldRating);
            xVals.push(i);
            yVals.push(contest.newRating - contest.oldRating)
            i++;
        })
        plotGraph(xVals,yVals,"line")
    })
}

function plotGraph(xVals,yVals,type){
    new Chart("ratingGraph",{
        type: type,
        data:{
            labels: xVals,
            datasets: [{
                fill:false,
                lineTension: 0,
                //backgroundColor: "rgba()"
                data: yVals
            }]
        },
        options: {
            legend: {display: false},
            scales:{
                yAxes: [{ticks: {min: 6, max: 16}}]
            }
        }
    });
}

/******************------------------------------------------------------------------------------------------------------------------------------------------**************/

function showBlogs(){
    url = "https://codeforces.com/api/user.blogEntries?handle=" + document.getElementById("searchbox").value;
    fetch(url).then((response)=>{
        return response.json();
    }).then((data)=>{
        console.log(data);
        data.result.forEach(blog=>{
            console.log(blog.title);
            let comments = blogComments(blog.id);
            let result = `${blog.title}`
            let respElement = document.getElementById("response");
            respElement.innerHTML = result;
            let i = 1;
            comments.forEach(comment=>{
                let element = document.createElement(`Comment-${i}`)
                element.innerHTML = comment;
                respElement.appendChild(element);
            })
        })
    })
}

function blogComments(id){
    url = "https://codeforces.com/api/blogEntry.comments?blogEntryId=" + id
    fetch(url).then((response)=>{
        return response.json();
    }).then((data)=>{
        let comments = [];
        data.result.forEach(blog=>{
            comments.push(removeTags(blog.text));
        })
        return comments;
    })
}

/******************------------------------------------------------------------------------------------------------------------------------------------------**************/

const apiKey = "7b833cbcfd3ea80d1fbf57d3a6b14bfad443de9d";
const secret = "1bc21116afd712b03ec775c0515554d0f1e5f559";
let time = `${Math.round(Date.now() / 1000)}`;
function showFriends(){
    
}

//contests("https://codeforces.com/api/contest.list?gym=false");
//userSearch("https://codeforces.com/api/user.info?handles=cyberboy");
//userRating("https://codeforces.com/api/user.rating?handle=mayank_c")
//userInfo("")
//showBlogs()