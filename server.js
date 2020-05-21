const express = require("express");
const line = require("@line/bot-sdk");
const messagejson = require("./message.json");

const PORT = process.env.PORT || 5000;

const config = {
  channelSecret: process.env.SECRET_KEY,
  channelAccessToken: process.env.ACCESS_TOKEN,
};
const client = new line.Client(config);
const app = express();

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

// 最大値・最小値を引数に持つ乱数発生の関数
function getRandom(min, max) {
  const random = Math.floor(Math.random() * (max + 1 - min)) + min;

  return random;
}

function handleEvent(event) {
  let retmessage = [];

  switch (event.type) {
    case "message": {
      switch (event.message.type) {
        case "text": {
          switch (event.message.text) {
            case "迷惑メールモードSTART": {
              const result = getRandom(1, 4); // 乱数で正常or不審メールを選択する
              // 一時---
              // result = 4;
              // ---一時
              switch (result) {
                case 1: {
                  retmessage = messagejson.Truemail;
                  break;
                }
                case 2: {
                  retmessage = messagejson.Falsemail1;
                  break;
                }
                case 3: {
                  retmessage = messagejson.Falsemail2;
                  break;
                }
                case 4: {
                  retmessage = messagejson.Falsemail3;
                  break;
                }
                default: {
                  retmessage = messagejson.Truemail;
                  break;
                }
              }
              break;
            }
            case "Q-TECNO QUEST START": {
              retmessage[0] = {
                type: "text",
                text: "このモードはメンテナンス中です",
              };
              break;
            }
            case "諦める": {
              retmessage[0] = {
                type: "text",
                text: "諦めるのはまだ早い！！！！",
              };
              break;
            }
            case "HELP": {
              retmessage[0] = {
                type: "text",
                text: "ヘルプメニューは、メンテナンス中です。",
              };
              break;
            }
            default: {
              retmessage = {
                type: "text",
                text: "wrong text",
              };
            }
          }
          break;
        }
        default: {
          retmessage = {
            type: "text",
            text: "Not text",
          };
        }
      }
      break;
    }

    case "postback": {
      switch (event.postback.data) {
        case "Truemail_Open": {
          // 完了
          retmessage[0] = {
            type: "text",
            text:
              "100点！！正常なメールでした。この調子で次も挑戦してください！これで不審メール対応フローを終了します。お疲れ様でした。",
          };
          break;
        }
        case "Truemail_Notopen": {
          // 完了
          retmessage[0] = {
            type: "text",
            text:
              "0点⤵正常なメールでした。会議の出席調整をしなかったため重石部長に怒られちゃった！⤵憂鬱",
          };
          retmessage[1] = {
            type: "text",
            text:
              "気を取り直して再挑戦してください、これで不審メール対応フローを終了します。お疲れ様でした。",
          };
          break;
        }
        case "Falsemail1_Open": {
          // 完了
          retmessage[0] = messagejson.postback.Falsemail.Open1; // 感染動画
          retmessage[1] = messagejson.postback.Falsemail1.Open1_Next1; // 次へボタン
          break;
        }
        case "Falsemail1_Open_Next1": {
          // 完了
          retmessage[0] = {
            type: "text",
            text:
              "受信したメールは不審メールでした、下の気付きポイントを確認してください",
          };
          retmessage[1] = messagejson.postback.Falsemail1.Realize; // 気付きポイント画像
          retmessage[2] = messagejson.postback.Falsemail1.Open1_Next2; // 次へボタン
          break;
        }
        case "Falsemail_Open_Next2": {
          // 完了
          retmessage[0] = {
            type: "text",
            text: "次はどう対応しますか",
          };
          retmessage[1] = messagejson.postback.Falsemail.Open2; // 次の選択肢
          break;
        }
        case "Falsemail2_Open": {
          // 完了
          retmessage[0] = messagejson.postback.Falsemail.Open1; // 感染動画
          retmessage[1] = messagejson.postback.Falsemail2.Open1_Next1; // 次へボタン
          break;
        }
        case "Falsemail2_Open_Next1": {
          // 完了
          retmessage[0] = {
            type: "text",
            text:
              "受信したメールは不審メールでした、下の気付きポイントを確認してください",
          };
          retmessage[1] = messagejson.postback.Falsemail2.Realize; // 気付きポイント画像
          retmessage[2] = messagejson.postback.Falsemail2.Open1_Next2; // 次へボタン
          break;
        }
        case "Falsemail3_Open": {
          // 完了
          retmessage[0] = messagejson.postback.Falsemail.Open1; // 感染動画
          retmessage[1] = messagejson.postback.Falsemail3.Open1_Next1; // 次へボタン
          break;
        }
        case "Falsemail3_Open_Next1": {
          // 完了
          retmessage[0] = {
            type: "text",
            text:
              "受信したメールは不審メールでした、下の気付きポイントを確認してください",
          };
          retmessage[1] = messagejson.postback.Falsemail3.Realize; // 気付きポイント画像
          retmessage[2] = messagejson.postback.Falsemail3.Open1_Next2; // 次へボタン
          break;
        }
        case "Falsemail_Notopen1": {
          // 完了
          retmessage[0] = messagejson.postback.Falsemail.Notopen1; // 正解画像もしくは動画
          retmessage[1] = messagejson.postback.Falsemail.Notopen1_Next; // 次へ
          break;
        }
        case "Falsemail_Notopen1_Nextyes": {
          // 完了
          retmessage[0] = {
            type: "text",
            text:
              "正解！あなたは冷静な判断ができる名探偵です！これは不審メールでした！",
          };
          retmessage[1] = {
            type: "text",
            text: "次はどう対応しますか",
          };
          retmessage[2] = messagejson.postback.Falsemail.Notopen2; // 次の選択肢
          break;
        }
        case "Falsemail_Open2_NG": {
          retmessage[0] = {
            type: "text",
            text:
              "0点⤵不正解！ウイルスがネットワークを通じてとなりの松田君PCに感染しちゃった！松田君が発狂している！！",
          };
          retmessage[1] = {
            type: "text",
            text:
              "下の気付きポイントを確認して再挑戦してください、これで不審メール対応フローを終了します。お疲れ様でした。",
          };
          retmessage[2] = messagejson.postback.Falsemail.Realize21; // 気付きポイント画像
          break;
        }
        case "Falsemail_Open2_Disconnectlan": {
          retmessage[0] = {
            type: "text",
            text:
              "正解！ウイルス感染の拡大を防ぐことができた！となりの松田君のパソコンが喜んだ気がした！次はどう対応しますか？",
          };
          retmessage[1] = messagejson.postback.Falsemail.Disconnectlan;
          break;
        }
        case "Falsemail_Open2_Disconnectlan_Contact": {
          retmessage[0] = {
            type: "text",
            text:
              "正解！50点！情報ｼｽﾃﾑGの方にウイルスの対処を実施してもらった！テクノ部長が喜んでいる！",
          };
          retmessage[1] = {
            type: "text",
            text:
              "また再挑戦してください、これで不審メール対応フローを終了します。お疲れ様でした。",
          };
          break;
        }
        case "Falsemail_Open2_Disconnectlan_NG": {
          retmessage[0] = {
            type: "text",
            text:
              "25点⤵不正解！ウイルスが感染したまま業務できず！テクノ部長に叱られた！！憂鬱⤵",
          };
          retmessage[1] = {
            type: "text",
            text:
              "下の気付きポイントを確認して再挑戦してください、これで不審メール対応フローを終了します。お疲れ様でした。",
          };
          retmessage[2] = messagejson.postback.Falsemail.Realize22; // 気付きポイント画像
          break;
        }
        case "Falsemail_Notopen2_Delete_NG": {
          retmessage[0] = {
            type: "text",
            text: "75点⤵不正解！不審メールは情報ｼｽﾃﾑGへ転送しよう。",
          };
          retmessage[1] = {
            type: "text",
            text:
              "下の気付きポイントを確認して再挑戦してください、これで不審メール対応フローを終了します。お疲れ様でした。",
          };
          retmessage[2] = messagejson.postback.Falsemail.Realize13; // 気付きポイント画像
          break;
        }
        case "Falsemail_Notopen2_NG": {
          retmessage[0] = {
            type: "text",
            text:
              "50点⤵不正解！後日、不審メールだったことを忘れてしまい添付資料を開いちゃった！ウイルス感染！",
          };
          retmessage[1] = {
            type: "text",
            text:
              "下の気付きポイントを確認して再挑戦してください、これで不審メール対応フローを終了します。お疲れ様でした。",
          };
          retmessage[2] = messagejson.postback.Falsemail.Realize13; // 気付きポイント画像
          break;
        }
        case "Falsemail_Notopen2_Transfer": {
          retmessage[0] = {
            type: "text",
            text:
              "正解！不審メールは情報ｼｽﾃﾑGへ転送しよう、次はどう対応しますか？",
          };
          retmessage[1] = messagejson.postback.Falsemail.Transfer;
          break;
        }
        case "Falsemail_Notopen2_Transfer_NG": {
          retmessage[0] = {
            type: "text",
            text:
              "75点⤵不正解！後日、不審メールだったことを忘れてしまい添付資料を開いちゃった！ウイルス感染！",
          };
          retmessage[1] = {
            type: "text",
            text:
              "下の気付きポイントを確認して再挑戦してください、これで不審メール対応フローを終了します。お疲れ様でした。",
          };
          retmessage[2] = messagejson.postback.Falsemail.Realize14; // 気付きポイント画像
          break;
        }
        case "Falsemail_Notopen2_Transfer_Delete": {
          retmessage[0] = {
            type: "text",
            text:
              "100点！あなたの正しい対応により、社内ネットワークは救われました！",
          };
          retmessage[1] = {
            type: "text",
            text:
              "おめでとうございます！また挑戦してください、これで不審メール対応フローを終了します。お疲れ様でした。",
          };
          break;
        }
        default: {
          retmessage = {
            type: "text",
            text: "wrong postback",
          };
        }
      }
      break;
    }
    default: {
      retmessage = {
        type: "text",
        text: "Not event",
      };
    }
  }
  console.log(retmessage);
  return client.replyMessage(event.replyToken, retmessage);
}

// const handleEvent = event => {
//   let message;

//   switch (event.type) {
//     case "message": {
//       switch (event.message.type) {
//         case "text": {
//           switch (event.message.text) {
//             case "迷惑メールモードSTART": {
//               switch (getRandomInt(2)) {
//                 case 0: {
//                   message = messagejson.trueMail;
//                   break;
//                 }
//                 default: {
//                   message = messagejson.falseMail;
//                 }
//               }
//               break;
//             }
//             case "Q-TECNO QUEST START": {
//               message = messagejson.maintenance;
//               break;
//             }
//             case "GIVE UP": {
//               message = messagejson.maintenance;
//               break;
//             }
//             case "HELP": {
//               message = messagejson.maintenance;
//               break;
//             }
//             default: {
//               message = messagejson.error.wrongText;
//             }
//           }
//           break;
//         }
//         default: {
//           message = messagejson.error.wrongMessageType;
//         }
//       }
//       break;
//     }

//     case "postback": {
//       switch (event.postback.data) {
//         case "trueMailOpen": {
//           message = messagejson.postback.trueMail.open;
//           break;
//         }
//         case "trueMailNotOpen": {
//           message = messagejson.postback.trueMail.notOpen;
//           break;
//         }
//         case "trueMailDelete": {
//           message = messagejson.postback.trueMail.delete;
//           break;
//         }
//         case "falseMailOpen": {
//           message = messagejson.postback.falseMail.open;
//           break;
//         }
//         case "falseMailNotOpen": {
//           message = messagejson.postback.falseMail.notOpen;
//           break;
//         }
//         case "falseMailDelete": {
//           message = messagejson.postback.falseMail.delete;
//           break;
//         }
//         default: {
//           message = messagejson.error.wrongPostback;
//         }
//       }
//       break;
//     }

//     default: {
//       message = messagejson.error.notEvent;
//     }
//   }

//   return client.replyMessage(event.replyToken, [
//     message,
//     { type: "text", text: "2nd message" }
//   ]);
// };

app.get("/", (req, res) => res.send("Hello LINE BOT!(GET)")); // ブラウザ確認用(無くても問題ない)
app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);
  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

app.listen(PORT);
