document.getElementById("login").addEventListener("click",()=>{
    const key = prompt("Enter your login key, or a new one.");
    if(key){
        const params = new URLSearchParams();
        params.append('key', key);
        const queryString = params.toString();
        // btoa(queryString)
        window.location.href=`./board.html?${btoa(queryString)}`
    }else{
        alert("no key entered")
    }
})