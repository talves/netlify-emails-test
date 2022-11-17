import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

const handler: Handler = async function (event) {
  console.log("event.body:", event.body);

  if (event.body === null || event.body==="") {
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
  const response: Response = await fetch(`${process.env.URL}/.netlify/functions/emails/subscribed`, {
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
  });
  const responseText = await response.text();
console.log("response:", response.ok, response.status, response.statusText, responseText)
  return response.ok ? {
    statusCode: 200,
    body: JSON.stringify("Subscribe email sent!"),
  } : {
    statusCode: 400,
    body: JSON.stringify(`Error: ${response.statusText}`),
  };
};

export { handler };
