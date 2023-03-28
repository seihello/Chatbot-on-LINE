const LINE_ACCESS_TOKEN = "XXXXX";
const HEADERS = {
  "Content-Type": "application/json; charset=UTF-8",
  "Authorization": "Bearer " + LINE_ACCESS_TOKEN
};

function replyMessage(replyToken, message) {
  let url = "https://api.line.me/v2/bot/message/reply";
  let postData = {
    "replyToken": replyToken,
    "messages": [{
      "type": "text",
      "text": message
    }]
  };
  let options = {
    "method": "POST",
    "headers": HEADERS,
    "payload": JSON.stringify(postData)
  };

  return UrlFetchApp.fetch(url, options);
}

function doPost(e) {
  let webhookData = JSON.parse(e.postData.contents).events[0];
  let replyToken = webhookData.replyToken;
  let message = webhookData.message.text;

  const url = "https://api.openai.com/v1/chat/completions";
  const payload = {
      model: 'gpt-3.5-turbo',
      "messages": [
        {"role": "user", "content": message}
        ],
  };
  const CHAT_GPT_ACCESS_TOKEN = "XXXXXX"
  const options = {
      contentType: "application/json",
      headers: { Authorization: "Bearer " + CHAT_GPT_ACCESS_TOKEN},
      payload: JSON.stringify(payload),
  };
  const res = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());

  answer = res.choices[0].message.content
  answer = answer.replace("\n\n", "")

  return replyMessage(replyToken, answer);
}
