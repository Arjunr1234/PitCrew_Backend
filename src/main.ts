import server from "./framework/app";
import connectDB from "./framework/config/db";


connectDB()

server.listen(3000, () => {
    console.log('server started on port 3000');
    
});
