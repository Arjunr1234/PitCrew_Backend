import server from "./framework/app";
import connectDB from "./framework/config/db";

console.log("jjjj")
connectDB()

server.listen(3000, () => {
    console.log('arju started on port 3000');
    
});
