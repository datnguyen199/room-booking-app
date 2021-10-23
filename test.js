const moment = require('moment');

let currentTime = moment(new Date('2021-07-21 09:00'));
let otherTime = moment(new Date('2021-07-22 09:00'));
console.log(currentTime.isAfter(otherTime));
