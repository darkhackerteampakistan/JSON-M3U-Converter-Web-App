const input=document.getElementById("input");
const output=document.getElementById("output");
const fileInput=document.getElementById("fileInput");

fileInput.addEventListener("change",function(e){

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(evt){
input.value=evt.target.result;
};

reader.readAsText(file);

});

async function pasteText(){

try{
const text=await navigator.clipboard.readText();
input.value=text;
}catch(err){
alert("Paste failed");
}

}

function clearAll(){
input.value="";
output.value="";
}

function jsonToM3u(){

try{

const data=JSON.parse(input.value);

let m3u="#EXTM3U\n";

data.forEach(ch=>{

m3u+=`#EXTINF:-1 tvg-logo="${ch.logo||''}" group-title="${ch.group||''}",${ch.name||''}\n`;

m3u+=`${ch.url}\n`;

});

output.value=m3u;

}catch(err){

alert("Invalid JSON");

}

}

function m3uToJson(){

try{

const lines=input.value.split("\n");

let channels=[];

for(let i=0;i<lines.length;i++){

if(lines[i].startsWith("#EXTINF")){

const extinf=lines[i];

const url=lines[i+1]?.trim();

const logoMatch=extinf.match(/tvg-logo="([^"]*)"/);

const groupMatch=extinf.match(/group-title="([^"]*)"/);

const name=extinf.split(",").pop();

channels.push({

name:name||"",
logo:logoMatch?logoMatch[1]:"",
group:groupMatch?groupMatch[1]:"",
url:url||""

});

}

}

output.value=JSON.stringify(channels,null,2);

}catch(err){

alert("Invalid M3U");

}

}

function copyOutput(){

navigator.clipboard.writeText(output.value);

alert("Copied");

}

function downloadM3U(){

const blob=new Blob([output.value],{
type:"audio/x-mpegurl"
});

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);
a.download="playlist.m3u";

a.click();

}

function downloadJSON(){

const blob=new Blob([output.value],{
type:"application/json"
});

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);
a.download="playlist.json";

a.click();

}
