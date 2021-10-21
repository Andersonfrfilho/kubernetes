const express = require('express')
const app = express()
const port = 3000
const name = process.env.NAME;
const age = process.env.AGE;
const last_name = process.env.LAST_NAME;
const address = process.env.ADDRESS;
const password = process.env.PASSWORD;
const duration = process.env.DURATION;
let awaitTime = process.env.STOP || true;

// setTimeout(()=> { 
//   awaitTime = false 
//  }, duration || 10000);

//  setTimeout(()=> { 
//   error = process.env.ERROR || false
//  }, duration || 15000);

app.get('/healthz', (req, res) => {

  // if(error || awaitTime){
  //   res.status(500).send('Something broke!');
  // }
  return res.json({api:true })
})

app.get('/', (req, res) => {
  console.log(name,age)
  res.json({api:true,name,age,last_name,address,password,duration,error:process.env.ERROR,stop:process.env.STOP })
})

app.listen(port, () => {
  console.log(name,age)
  console.log(`Example app listening at http://localhost:${port}`)
})
