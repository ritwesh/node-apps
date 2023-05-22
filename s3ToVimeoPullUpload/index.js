const https = require('https');

const Vimeo = require('vimeo').Vimeo;

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        size: event.Records[0].s3.object.size,
        Bucket: bucket,
        Key: key,
    };
    
    const videoLink = `https://${event.Records[0].s3.bucket.name}.${event.Records[0].awsRegion}.amazonaws.com/${event.Records[0].s3.object.key}`;
    const bodyToUpload = {
        upload: {
        approach: 'pull',
        size: event.Records[0].s3.object.size,
        link: videoLink
        },
        file_name: event.Records[0].s3.object.key
    };
    // 
    console.log("<<<<<===== UPLOADING BODY HERE =====>>>>>");
    console.log(bodyToUpload);
    
    let client = new Vimeo("{process.env.VIMEO_CLIENT_ID}", "{process.env.VIMEO_CLIENT_SECRET}", "{process.env.VIMEO_ACCESS_TOKEN}");
    client.request({
      method: 'POST',
      path: '/tutorial'
    }, function (error, body, status_code, headers) {
      if (error) {
        console.log(error);
      }
      console.log(body);
    });

    params = {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: bodyToUpload
    }
    vimeo_response = await fetch(
       `https://api.vimeo.com/me/videos`,
       params,
       (uploadError, response, vimeoBody) => {
         if (uploadError) {
           console.log(uploadError);
         } else {
           vimeoBody = JSON.parse(vimeoBody);
           // console.log(vimeoBody);

           // extracting videoId from response link
           const vimeoVideoId = vimeoBody.link.split('/').filter((number) => {
               if (!isNaN(number)) {
                 return number;
               }
             })[0];

           console.log(vimeoVideoId);
         }
       }
     ).auth(null, null, true, process.env.VIMEO_ACCESS_TOKEN);
    return vimeo_response;
};
