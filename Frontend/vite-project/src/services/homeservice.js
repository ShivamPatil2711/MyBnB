export const getHomes = async ()=>{
const res= await fetch ("https://mybnb-f13q.onrender.com/api/homes");
const data=await res.json();
return data;
}