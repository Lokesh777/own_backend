require("dotenv").config();

const MongoDB_URL = process.env.MongoDB_URL ;
const mongoose = require('mongoose');

const connect = ()=>{
    mongoose.set("strictQuery",false);

return mongoose.connect(MongoDB_URL,{
            dbname: process.env.Database,
            user: process.env.db_user,
            pass: process.env.db_password,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true
        }      
     )
     .then(() => {
        console.log('Connection estabislished with MongoDB');
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('Mongoose connected to DB Cluster');
        });

        connection.on('error', (error) => {
            console.error(error.message);
        });

        connection.on('disconnected', () => {
            console.log('Mongoose Disconnected');
        });
        process.on('SIGINT', () => {
            connection.close(() => {
                console.log('Mongoose connection closed on Application Timeout');
                process.exit(0);
            });
        });
    })
    .catch(error => console.error(error.message));
    

}

module.exports = connect;