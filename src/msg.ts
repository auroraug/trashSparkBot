export function formatDevInfo(sparkAddress: string) {
    let telegramMsg = '🤑[Wallet Info]\n'
    telegramMsg += `SparkAddress: <code>${sparkAddress}</code>\n`
    telegramMsg += `<a href="https://www.sparkscan.io/address/${sparkAddress}?network=mainnet">Explorer</a>\n`

    const inlineKeyboard = {
        inline_keyboard: [
            [
                {
                    text: '✈send',
                    callback_data: `send_${sparkAddress.substring(7)}`
                },
            ]
        ]
    }

    return {
        message: telegramMsg,
        keyboard: inlineKeyboard
    }
}

// 钱⚔🛡💰🏛
export function myselfInfo(pubkey: string, l1Address: string, sparkAddress: string, balance: bigint) {
    // pubkey: 03beac388a4008a2a3d67e470c8c1f156ff0eb36b733284b6f8cbf17c550f29f44
    // l1Address: bc1ql4q4dtkkv6edccn8fzcyvynlq79tfzra6fafkx
    // sparkAddress: sp1pgss804v8z9yqz9z50t8u3cv3s032mlsavmtwvegfdhce0chc4g0986yerj6w7
    const temp_WithdrawlAddress = 'bc1puvljyjf07wr7qphen7d7jzeqpry4fxm35qeq86a99w2evnvaaxlsuc20pq'
    let telegramMsg = '[My Wallet]\n'
    telegramMsg += `pubkey: <code>${pubkey}</code>\n`
    telegramMsg += `l1Address:<code> ${l1Address}</code>\n`
    telegramMsg += `SparkAddress: <code>${sparkAddress}</code>\n`
    telegramMsg += (balance && Number(balance) > 0)? `balance: ${Number(balance)}`:''
    telegramMsg += `<a href="https://www.sparkscan.io/address/${sparkAddress}?network=mainnet">Explorer</a>\n`

    const inlineKeyboard = {
        inline_keyboard: [
            [
                {
                    text: 'deposit',
                    callback_data: `deposit`
                },
                {
                    text: 'claim',
                    callback_data: `claim`
                },
            ],
            [
                {
                    text: 'withdraw',
                    callback_data: `withdraw`
                },
                {
                    text: 'refresh',
                    callback_data: `refresh`
                }
            ]
        ]
    }

    return {
        message: telegramMsg,
        keyboard: inlineKeyboard
    }
}