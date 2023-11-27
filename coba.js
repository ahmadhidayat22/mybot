
// const year = waktu.getFullYear();
// const month = waktu.getMonth();
// const days = waktu.getDate();
// const hours = waktu.getHours();
// const minutes = waktu.getMinutes();
// const seconds = waktu.getSeconds();



// console.log(year,month,days," ",hours,minutes,seconds);
const waktu = new Date('2023-11-19T23:28:30');
const waktu2 = new Date('2023-11-20T01:29:00');

let diff =(waktu2.getTime() - waktu.getTime())/1000;

// console.log(Math.floor(diff/3600) );
// console.log(Math.floor(diff/60) );
let p

if (diff < 60) {
    p = "difference is of " + diff + " seconds.";
 } else if (diff < 3600) {
    p = "difference is of " + diff / 60 + " minutes.";
 } else if (diff < 86400) {
    p = "difference is of " + diff / 3600 + " hours.";
 } else if (diff < 2620800) {
    p = "difference is of " + diff / 86400 + " days.";
 } else if (diff < 31449600) {
    p = "difference is of " + diff / 2620800 + " months.";
 } else {
    p = "difference is of " + diff / 31449600 + " years.";
 }
 console.log(p);


// let hourdiff =Math.abs(waktu2.getHours() - waktu.getHours());
// let minutediff =Math.abs(waktu2.getMinutes() - waktu.getMinutes());
// let seconddiff =Math.abs(waktu2.getSeconds() - waktu.getSeconds());
// let datediff =Math.abs(waktu2.getDate() - waktu.getDate());
// let monthdiff =Math.abs(waktu2.getMonth() - waktu.getMonth());
// let yeardiff =Math.abs(waktu2.getFullYear() - waktu.getFullYear());
// // let hour = Math.ceil(time/ (1000*60*60));
// // let minute = Math.floor(time/ 60000)
// // console.log(hour);
// // console.log(minute);

// console.log(yeardiff);
// console.log(monthdiff);
// console.log(datediff);
// console.log(hourdiff);
// console.log(minutediff);
// console.log(seconddiff);
