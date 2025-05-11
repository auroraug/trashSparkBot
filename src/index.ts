import TelegramBot from 'node-telegram-bot-api';
import { formatDevInfo, myselfInfo } from './msg';
import { SparkWallet } from "@buildonspark/spark-sdk";
import { getLatestDepositTxId } from "@buildonspark/spark-sdk/utils";
import dotenv from 'dotenv';
dotenv.config()

const token = process.env.TELEGRAM_BOT_TOKEN || '';
// const groupId = process.env.TELEGRAM_GROUP_ID || '';
const mnemonic = process.env.mnemonic
const bot = new TelegramBot(token, { polling: true });

interface Exec {
    action: "claim" | "send"
    address: string
    msgId: string
}
// const DepositStates = new Map<string, string>()
const UserStates = new Map<string, any>()


// Handle /help command
bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    const helpMessage = `
Available commands:
/me - Show owner wallet
<spark address> - Show dev wallet
    `;
    bot.sendMessage(chatId, helpMessage);
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id
    const text = msg.text
    const replyToMessageId = msg.reply_to_message?.message_id
    const replyTimestamp = msg.reply_to_message?.date

    if (!replyToMessageId || !replyTimestamp || !text || isNaN(parseFloat(text)) || parseFloat(text) <=0) return

    const userstate = JSON.parse(UserStates.get(chatId.toString())) as Exec
    UserStates.delete(chatId.toString())
    const currentTimestamp = Date.now()
    if (replyToMessageId.toString() !== userstate.msgId && currentTimestamp - replyTimestamp > 5 * 60) return

    if (userstate.action === 'send') {
        const { wallet } = await SparkWallet.initialize({
            mnemonicOrSeed: mnemonic,
            options: {
                network: "MAINNET",
            },
        });
        const transfer = await wallet.transfer({
            receiverSparkAddress: userstate.address,
                amountSats: Number(text),
            });

        console.log("Transfer:", transfer);
        bot.sendMessage(chatId, transfer.id)
    }else if (userstate.action === 'claim') {
        const { wallet } = await SparkWallet.initialize({
            mnemonicOrSeed: mnemonic,
            options: {
                network: "MAINNET",
            },
        });
        // Claim L1 deposit
        const result = await getLatestDepositTxId(userstate.address);

        if (result) {
            console.log("Transaction ID: ", result);
            await bot.sendMessage(chatId, `deposit tx: ${result}`)
            const tx = await wallet.claimDeposit(result);
            console.log("Deposit TX: ", tx);
            await bot.sendMessage(chatId, `claim tx: ${tx}`)
        }
    }
    
})

bot.onText(/^[a-z0-9]{65}$/, async (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text) return
    const { message, keyboard } = formatDevInfo(msg.text)
    await bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: keyboard
    });
});

bot.onText(/\/me/, async (msg) => {
    const chatId = msg.chat.id;
    const { wallet } = await SparkWallet.initialize({
        mnemonicOrSeed: mnemonic,
        options: {
            network: "MAINNET",
        },
    });
    const [pubkey, l1Address, sparkAddress, balance] = await Promise.all([wallet.getIdentityPublicKey(),
        wallet.getTokenL1Address(),wallet.getSparkAddress(),wallet.getBalance()
    ])
    const { message, keyboard } = myselfInfo(pubkey, l1Address, sparkAddress, balance.balance)
    bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        reply_markup: keyboard
    })
});

// // Handle callback_query
bot.on('callback_query', async (callback_query) => {
    const chatId = callback_query.message?.chat.id;
    const messageId = callback_query.message?.message_id;
    const data = callback_query.data
    if (!chatId || !messageId || !data) return

    if (data.startsWith('deposit')) {
        const { wallet } = await SparkWallet.initialize({
            mnemonicOrSeed: mnemonic,
            options: {
                network: "MAINNET",
            },
        });
        const depositAddress = await wallet.getSingleUseDepositAddress()
        bot.sendMessage(chatId, `Please deposit to this following depositAddress:`)
        bot.sendMessage(chatId, depositAddress)
        await bot.answerCallbackQuery(callback_query.id)
        return
    }
    else if (data.startsWith('send_')) {
        const sparkAddress = `sp1pgss${data.replace('send_','')}`
        const sentMsg = await bot.sendMessage(chatId, `please enter the amount(sats)`, {
            reply_markup: {
                force_reply: true,
                selective: true
            }
        })
        const sendState: Exec = {
            action: 'send',
            address: sparkAddress,
            msgId: sentMsg.message_id.toString()
        }
        UserStates.set(chatId.toString(), JSON.stringify(sendState))
        await bot.answerCallbackQuery(callback_query.id)
        return
        
    }else if (data.startsWith('refresh')) {
        bot.sendMessage(chatId, 'refresh')
    }else if (data.startsWith('claim')) {
        const userstate = JSON.parse(UserStates.get(chatId.toString())) as Exec
        const { wallet } = await SparkWallet.initialize({
            mnemonicOrSeed: mnemonic,
            options: {
                network: "MAINNET",
            },
        });
        // Claim L1 deposit
        const result = await getLatestDepositTxId(userstate.address);

        if (result) {
            console.log("Transaction ID: ", result);
            await bot.sendMessage(chatId, `deposit tx: ${result}`)
            const tx = await wallet.claimDeposit(result);
            console.log("Deposit TX: ", tx);
            await bot.sendMessage(chatId, `claim tx: ${tx}`)
        }
        await bot.answerCallbackQuery(callback_query.id)
        return
    }
});

// // Handle /on command
// bot.onText(/\/on/, (msg) => {
//     const chatId = msg.chat.id;
//     if (isMonitoring) {
//         bot.sendMessage(chatId, 'Monitoring is already running');
//         return;
//     }
    
//     // Start monitoring asynchronously
//     startConnection(connection, PUMPFUN_GRADUATED, INSTRUCTION_NAME)
//         .then(() => {
//             bot.sendMessage(chatId, 'Started monitoring for new pumpFun launched LPs');
//         })
//         .catch(error => {
//             console.error('Error starting monitoring:', error);
//             bot.sendMessage(chatId, 'Failed to start monitoring');
//         });
// });

// // Handle /off command
// bot.onText(/\/off/, (msg) => {
//     const chatId = msg.chat.id;
//     if (!isMonitoring) {
//         bot.sendMessage(chatId, 'Monitoring is already stopped');
//         return;
//     }
    
//     stopConnection();
//     bot.sendMessage(chatId, 'Stopped monitoring for new LPs');
// });

// // Handle regular messages
// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     const text = msg.text;
    
//     // Ignore commands
//     if (text && !text.startsWith('/')) {
//         console.log(`Received message: ${text} from chat ${chatId}`);
//     }
// });

// // Handle errors
// bot.on('polling_error', (error) => {
//     console.log('Polling error:', error);
// });

// Remove the automatic start
console.log('Telegram bot is running...');