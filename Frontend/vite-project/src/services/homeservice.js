export const getHomes = async ()=>{
const res= await fetch (" http://localhost:4003/api/homes");
const data=await res.json();
return data;
}