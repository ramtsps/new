document.addEventListener('click', (e) => {
   if (e.target.classList.contains("edit")) {

     const value = prompt("Enter the new value");
if (value == null) {
  e.target.parentElement.parentElement.querySelector(".upvalue").innerHTML;
}
     let userId = e.target.getAttribute("data-id");
 
     axios.post('/edit', { userName: value, id: userId })
       .then(() => {
         e.target.parentElement.parentElement.querySelector(".upvalue").innerHTML = `User Name:${value}`
         
         console.log(`Data updated for ID ${userId}`);
       })
       .catch(() => {
         console.log("Error: Unable to update data");
       });
   }
 
   if (e.target.classList.contains("delete")) {
     let userId = e.target.getAttribute("data-id");
   confirm("Do you want to delete this data")
     axios.post('/delete', { id: userId })
       .then(() => {
         
         console.log(`Data deleted for ID ${userId}`);
        window.location.reload(); 
       })
       .catch(() => {
         console.log("Error: Unable to delete data");
       });
   }
 });