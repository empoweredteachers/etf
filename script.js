document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("joinForm");

const message = document.getElementById("message");

form.addEventListener("submit", async (e)=>{

e.preventDefault();

const data = {

name:document.getElementById("name").value,

email:document.getElementById("email").value

};

try{

const response = await fetch("/api/signup",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

});

const result = await response.json();

if(response.ok){

message.innerHTML="✅ Thank you for joining the Empowered Teachers Forum.";

message.style.color="#D4AF37";

form.reset();

}else{

message.innerHTML=result.message;

message.style.color="red";

}

}catch(err){

message.innerHTML="Unable to connect.";

message.style.color="red";

}

});

});
