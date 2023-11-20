let express = require('express');
let path = require('path');

const app = express();
const port = 8081;

// sendFile will go here
app.use(express.static(path.join(__dirname,'frontend', 'dist')));

app.listen(port,()=>{
    console.log('Server started at http://localhost:' + port);
});