document.addEventListener("DOMContentLoaded", function(){

    let key = localStorage.getItem("saveKey") || "";
if(key){
    document.getElementById("code-input").value = "";
    const params = new URLSearchParams();
    params.append('key', key);
    const queryString = params.toString();
    window.location.href=`./board.html?${btoa(queryString)}`
}

document.getElementById("login").addEventListener("submit",(e)=>{
    // const key = prompt("Enter your login key, or a new one.");
    e.preventDefault();
    key = document.getElementById("code-input").value;
    const keep = document.getElementById("checkbox").checked;
    if(key){
        document.getElementById("code-input").value = "";
        if(keep){
            localStorage.setItem("saveKey", key)
        }
        document.getElementById("checkbox").checked = false;
        const params = new URLSearchParams();
        params.append('key', key);
        const queryString = params.toString();
        window.location.href=`./board.html?${btoa(queryString)}`
    }else{
        alert("no key entered")
    }
})

})

