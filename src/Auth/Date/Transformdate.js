export default function Transformdate(date){
    const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const year = today.getFullYear();
const formattedDate = `${year}-${month}-${day}`;
return formattedDate

}