const bcrypt = require('bcrypt');

const pass = "123";

async function encrypt(){
    console.log(await bcrypt.hash(pass, 10));
}
encrypt()