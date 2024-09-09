import {db} from "./loadapp.js"
async function saveData(loginKey, data) {
    try {
      // Ensure that `loginKey` is a valid document ID
      if (!loginKey) {
        
        throw new Error("Invalid loginKey");
      }
      await setDoc(doc(db, "users", loginKey), {
        toolsData: data
      });
      console.log("Autosaved to current loginkey");
    } catch (e) {
      console.log("Error writing document: ", e);
    }
  }
  
  // Load data function
  async function loadData(loginKey) {
    if (!loginKey) {
      console.log("Invalid loginKey");
      return;
    }
    const docRef = doc(db, "users", loginKey);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data().toolsData;
    } else {
      console.log("No such document!");
    }
  }

let projects ={};
console.log(projects)

let queryURL=window.location.search;
queryURL=queryURL.slice(1);
queryURL=atob(queryURL)
const URLParams = new URLSearchParams(queryURL)

let loginKey = URLParams.get("key") || "";
if(loginKey==""){
    window.location.href="./"
}

  document.getElementById("view-key").addEventListener("click", function(){
    if(loginKey){
        alert("Current login key: "+loginKey);
    } else{
        alert("No current login key. Data is stored to device browser.")
    }  
})
document.getElementById("load-key").addEventListener("click", function(){
    const key = prompt("Enter login key");
if(key){
    const params = new URLSearchParams();
    params.append('key', key);
    const queryString = params.toString();
    // btoa(queryString)
    window.location.href=`./board.html?${btoa(queryString)}`
}else{
    // alert("no key entered")
}
});
document.getElementById("use-guest").addEventListener("click", ()=>{
    localStorage.setItem("saveKey", "")
    window.location.href="./"
})
document.addEventListener("DOMContentLoaded", async function(){
    projects = await loadData(loginKey) || {};
    console.log(projects)
})




