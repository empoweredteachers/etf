export async function onRequestPost(context){

const request=context.request;

const env=context.env;

try{

const {name,email}=await request.json();

const response=await fetch("https://api.brevo.com/v3/contacts",{

method:"POST",

headers:{

"Content-Type":"application/json",

"api-key":env.BREVO_API_KEY

},

body:JSON.stringify({

email:email,

attributes:{

FIRSTNAME:name

},

listIds:[12],

updateEnabled:true

})

});

if(response.ok){

return Response.json({

success:true,

message:"Contact Added"

});

}

const error=await response.text();

return new Response(error,{status:400});

}catch(error){

return new Response(

JSON.stringify({

message:error.message

}),

{

status:500,

headers:{

"Content-Type":"application/json"

}

}

);

}

}
