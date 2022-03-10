import express from 'express';
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

//This pice of code (Line 6) was taken from https://stackoverflow.com/a/48433898
//It wasn't modified, I needed it because I fetch isn't natively supported, need to npm install it
import fetch from 'node-fetch';

// Constants
const PORT = process.env.PORT;
const REGION = "us-east-1";
// const s3Client = new S3Client({
//   region: REGION,
//   credentials: {
//     accessKeyId: 'ASIAZRD3VUBCF5Z3XNWO',
//     secretAccessKey: '06SCHJSdt/eNiJwU6L0uTrEE5kz1c0YJ8wSIA2YG',
//     sessionToken:'FwoGZXIvYXdzECgaDFcmdGQDA+QdKLbeJCLAAXkR1fvjGk6CAhZoWmIuJAWTtwcaXnhRl3mJcrpyuTaxRPVe81m80sYo4bE5zzY2GG6dy4Z9/dT3ye0mZemM09n2Gi1WviwU1+WcUsbNjoSQb8zDKAaDj+g2Q2nlof8kYZBBr5DkCEdbAInRXesfuCQW3ms1Q3G1lAE7pkPUbWFZ4LHvPnrxsaLJd/caiIt2WcboofzzmQXKf5pRkws46/zky233CSh5qM/eRQr4yXRGQ80qlDQBEIzc3BVo6z/9aSjcv4+RBjItaBiqxc8vV0VOqNK1EDhYK2PXKGL/8Q78wjZJKTKzziGmgc6IkId6TvS3v3pV'
//   }
// });

// App
const app = express();

//This piece of code (Line 25) was taken from https://stackoverflow.com/a/10007542
//It wasn't modified, I needed it because I couldn't figure out why my server wasn't accepting JSON
app.use(express.json());

app.post('/storeLocationData', (req, res) => {
    console.log(req);
    sendDataToEventbridge(req.body.latitude, req.body.longitude,res);
});


async function sendDataToEventbridge(latitude, longitude,res){
    // a client can be shared by different commands.
    const client = new EventBridgeClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: 'ASIAZRD3VUBCJYXKM6OO',
            secretAccessKey: '7v+g8N/97rzh9FV/kFxyEoWTE2dkdzilvkA5LJ8C',
            sessionToken:'FwoGZXIvYXdzEJv//////////wEaDGLGtZ05lnItb75pPCLAAd2UasF4qDBQGRCeGy293sVAyhSS00xz0O9Heuy6ywdNeIkIub+EGAxK/2o0jRNDJV7dFAgMvbiaRbggDigRIFipvwwa9RRcAHwBr2tirUo/PFgp3l6p7di6yptvxwHQpNA0dllaVOd+lLe6XcpxOsWkpIWCkej/SG+aNcekNlUIaCXEujbRUleG6BdKSoifHAws9areFNLt8VRVNZ7GQjnD7c7Z06B8qB18b1OfSgxe51HkZ2bruWp96HBY4zUgFyi/36iRBjItFtnlBJCoxn77W/nmVq5VSyD7hXghWCZs4H8XsoaLVyGG2WNHZC4ilBVV0lFG'
        },
    });

    const params = {
        Entries: [
           { 
                Detail: JSON.stringify({
                    "latitude": latitude,
                    "longitude": longitude
                }),
                DetailType: 'storeMobileLocation',
                EventBusName: 'default',
                Source: 'cct-mobile-location',
            }
        ]
    };

    try {
        const data = await client.send(new PutEventsCommand(params));
        console.log("Success, event sent; requestID:", data);
        res.sendStatus(200);
    } catch (err) {
        console.log("Error", err);
        res.sendStatus(505);
    }
}

app.listen(PORT, err => {
    if(err) throw err;
    console.log("Server running");
});
console.log(`Running on port ${PORT}`);