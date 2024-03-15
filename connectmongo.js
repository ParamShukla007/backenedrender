const {MongoClient}=require('mongodb');
const dbConnect = require('./mongodb');
const url='mongodb://127.0.0.1:27017';
const dataBase='electronic';
const client=new MongoClient(url);

async function dbConnect()
{
    let result=await client.connect();
    let db=result.db(dataBase);
    return db.collection('mobiles');
  
}
//getData();
//connect with mongo db and display the data present in database on console
module.exports=dbConnect;