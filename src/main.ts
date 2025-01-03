import server from "./framework/app";
import connectDB from "./framework/config/db";


connectDB()

server.listen(3000, () => {
    console.log('arjun started on port 3000');
    
});
