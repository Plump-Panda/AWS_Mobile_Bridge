import express from 'express';
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

//This pice of code (Line 6) was taken from https://stackoverflow.com/a/48433898
//It wasn't modified, I needed it because I fetch isn't natively supported, need to npm install it
import fetch from 'node-fetch';

// Constants
const PORT = process.env.PORT || 8080;
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
    sendDataToEventbridge(req.body.latitude, req.body.longitude,req.body.phone,res);
});

//https://www.w3schools.com/js/tryit.asp?filename=tryjs_random_function2 
//modified to return a float value between 50 and 53
function getRndInteger() {
    return (Math.random() * (50 - 53 + 1)  + 53).toString();
}

app.get('/', (req, res) => {
    res.send("App is running fine")
});

app.post('/mockLocationData', (req, res) => {
    for(let i = 0; i<10; i++){
        console.log("send mock location data")
        sendDataToEventbridge(getRndInteger(), getRndInteger(), "+916382426327",res);
        console.log(res);   
    }
});

async function sendDataToEventbridge(latitude, longitude,phoneNumber,res){
    // a client can be shared by different commands.
    const client = new EventBridgeClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: 'ASIATRCE5IHPBZDATY44',
            secretAccessKey: 'FKjw4BNGn0MaFH+eM0O5JHhhe6J6VCtbNMgWvK/Q',
            sessionToken:'FwoGZXIvYXdzEOf//////////wEaDKHtcDKg1KpQUHArrCLAAX/aIgztrG6XJ1xRn0IcPSjeBj6umtkCxjKTnR/t2dPVkX4L2CkdEBojxDsdHxGXmBQjDMKsg2DQM42Mm70YRF/hHjkbdWANsf597u8quXc0/dX7LL+aQbeAcA2ePKvHY4N6Rc2Q7dkXatkqE5CHygkyeeSCuMh7/s9rASiRa5brkqTKWd1UGBzluwQB5GktgQMYtbjJcNgBIgMs1tPnbOGsYfbFrleOB6T5z3W8/aqj6G8JGvvcV5j66XrqOzC92SjmiaqSBjIth3/NHsHwFEZlHOE290zzEFNHdr4caTQusE/wZwFcO2U6zA5O4XZKbjWwabzu'
        },
    });

    const params = {
        Entries: [
           { 
                Detail: JSON.stringify({
                    "latitude": latitude,
                    "longitude": longitude,
                    "phoneNumber": phoneNumber,
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