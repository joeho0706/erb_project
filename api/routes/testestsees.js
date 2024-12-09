let bcrypt = require('bcrypt');
let a = await bcrypt.hash("abc", 10);
let b = await bcrypt.hash("abc", 10);
console.log(a, b);