import mongoose from "mongoose";

export const connectionDb=async()=>
    {
        try {
            await mongoose.connect(process.env.MONGO_URL,
                {
                    dbName:"whirl",
                })
            console.log("Connected to the database");
        } catch (error) {
            console.log(error)
        }
    }
