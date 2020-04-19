const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://costanzaMongo:2sFcLtMzv7CDJ7kd@xiaozu-dq18h.azure.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url);
 
 // The database to use
 const dbName = "EPFL";
                      
 async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);

         // Use the collection "people"
         const teachers = db.collection("teacher");
         const students = db.collection("student");
         const courses = db.collection("course");
         const enrollment = db.collection("enrollment");

         // Find one document
         const myDoc = await teachers.findOne();
         // Print to the console
         console.log(myDoc);

         var costi = await students.findOne({'student_name': "Volpini Costanza"});
         console.log(costi)
        //  TODO: same user are name + surname and some are surname + name => do a function to check both!

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);