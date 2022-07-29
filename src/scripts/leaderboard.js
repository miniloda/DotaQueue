async ()=>{
while(APIData === undefined){
    console.log("Waiting for API data");
    await sleep(1000);
}
console.log("API data received");
return true;
}