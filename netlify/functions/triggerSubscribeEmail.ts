import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

const handler: Handler = async function (event) {
  console.log("event.body:", event.body);
  console.log("someValue:", process.env.NETLIFY_EMAILS_SECRET);

  if (event.body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify("Payload required"),
    };
  }

  const requestBody = JSON.parse(event.body) as {
    subscriberName: string;
    subscriberEmail: string;
    inviteeEmail: string;
  };

  //automatically generated snippet from the email preview
  //sends a request to an email handler for a subscribed email
  const response = await fetch(`${process.env.URL}/.netlify/functions/emails/subscribed`, {
    headers: {
      "netlify-emails-secret": process.env.NETLIFY_EMAILS_SECRET as string,
    },
    method: "POST",
    body: JSON.stringify({
      from: requestBody.inviteeEmail,
      to: requestBody.subscriberEmail,
      subject: "You've been subscribed",
      parameters: {
        name: requestBody.subscriberName,
        email: requestBody.subscriberEmail,
      },
    }),
  }).catch((reason) => {
    return {
      statusCode: 400,
      body: JSON.stringify(reason.message),
    };
  });
console.log("response:", response)
  return {
    statusCode: 200,
    body: JSON.stringify("Subscribe email sent!"),
  };
};

export { handler };
