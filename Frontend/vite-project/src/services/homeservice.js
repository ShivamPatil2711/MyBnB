export const getHomes = async ()=>{
const res= await fetch ("https://api-mybnb-noss.onrender.com//api/homes");
const data=await res.json();
return data;
}