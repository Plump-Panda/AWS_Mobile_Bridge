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
    // console.log(req.body.latitude);
    sendDataToEventbridge(req.body.latitude, req.body.longitude,res);
});


async function sendDataToEventbridge(latitude, longitude,res){
    // a client can be shared by different commands.
    const client = new EventBridgeClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: 'ASIAZRD3VUBCLP5KC7NC',
            secretAccessKey: '724bAxztCG8tK2Z/OVPKAdGuT3V/DjLJqFQy14eO',
            sessionToken:'FwoGZXIvYXdzEI7//////////wEaDGAiwSdYM4txfzskDSLAATcE2q59FpkfnHBhNlJ1otJHQRczV8lnW8SAOKlb4xRwfGzsh8x8mAi0fW+h4ReU8RPaL7gET+2uTFtwBOgofEaoiMUbLLjb3h14HRbX/jQem1RlziL3SQ+0ddXLdFdXXxYBuz4Zf9I10sIjrx3ljoFWSX7r8Fd1msE6P4Q/ylGrldsOSUAM1uflkidHXzJaeEw2PhgOLnceLmjxI8PpmLn7uCGaDPm6N9X4c2dxaUY6safL11FdwB34nAd0IGCWZSjz/qWRBjItYsVzkw4jUgAtc2AiKf/5gCn1pn9ownT+XAwGB+EhJf6u1i+oyGQhwvMtv9aj'
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