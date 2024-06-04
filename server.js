const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { DynamoDBClient, ListTablesCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/',(req, res) => {res.sendFile(__dirname + '/index.html');});

app.post('/', async function(req, res) {
    let data = req.body;
    // console.log(data.name);
    putNewItemDB(data.name, data.id, data.key, data.movie, data.review);
    res.send(`<h1>Form submitted successfully!</h1>`);
});


const port = process.env.PORT || 3000;
app.listen(port,() => {console.log('Our express server is up on port 3000');});




async function putNewItemDB(name, accessKey, secretKey, title, review){
	const client = new DynamoDBClient(
		{ region: "us-east-2",
		credentials:{
			accessKeyId: accessKey,
			secretAccessKey: secretKey,
		}
	});
	const input = {
		TableName: "Movies",
		Item: {
			"User": {
				"S": name
				},
			"Title": {
				"S": title
				},
            "Review": {
                "S": review
                }
		}
	};
	const command = new PutItemCommand(input);
    try {
        await client.send(command);
    }
    catch (error) {
        console.log(error);  
    }
}
