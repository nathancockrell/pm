import Board from "./modules/boardClass.js"

function saveData(loginKey, projects) {
    loginKey="";
    localStorage.setItem('projects', JSON.stringify(projects));
}
let loginKey="";

let key = localStorage.getItem("saveKey") || "";
if(key){
const params = new URLSearchParams();
params.append('key', key);
const queryString = params.toString();
window.location.href=`./board.html?${btoa(queryString)}`
}

const unprocessed = localStorage.getItem("projects") || "";
if(!unprocessed){
console.log("passed")
}
let projects;
if(unprocessed){
projects = JSON.parse(unprocessed)
}else{
projects = {}
}
console.log("real", projects)
document.addEventListener("DOMContentLoaded", ()=>{
    const board = new Board(projects,loginKey, saveData)
    console.log(board);
})


