// Connect to MongoDB
const MongoClient = require('mongodb').MongoClient;

async function mongo() {
  //   if (err) throw err;
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const dbo = client.db('database');

  // Define the updates
  const updates = [
    { _id: 1, name: 'John', age: 13 },
    { _id: 2, name: 'Jane', age: 211 },
    { _id: 3, name: 'Bob', age: 33 },
  ];
  console.log('start');
  // Update the documents
  const updateOperations = updates.map((update) => ({
    updateOne: {
      filter: { _id: update._id },
      update: { $set: { age: update.age } },
    },
  }));

  dbo.collection('users').bulkWrite(updateOperations, function (err, res) {
    if (err) throw err;
    console.log(`${res.modifiedCount} document(s) updated`);
    db.close();
  });
}
mongo();

// async function mongoinsert() {
//   //   if (err) throw err;
//   const client = new MongoClient('mongodb://localhost:27017');
//   await client.connect();
//   const dbo = client.db('database');

//   // Define the updates
//   const updates = [
//     { _id: 1, name: 'John', age: 25 },
//     { _id: 2, name: 'Jane', age: 30 },
//     { _id: 3, name: 'Bob', age: 35 },
//   ];
//   console.log('start');
//   // Update the documents
//   dbo.collection('users').insertMany(updates);
//   console.log('end');
// }
// mongoinsert();
console.log('finist');
