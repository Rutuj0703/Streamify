import mongoose from "mongoose";

export const connectDb = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error connecting to MongoDB",error)
        process.exit(1); //failure
    }
}