#!/usr/bin/env node
import { config as dotenv } from 'dotenv'
import { Client } from 'discord.js'

dotenv ()

let regexes = [
    /<h1.+?>(.+?)<\/h1>/,
    /<span>(Shares Outstanding).+?<td.+?>(.+?)</,
    /<span>(Implied Shares Outstanding).+?<td.+?>(.+?)</,
    /<span>(Float).+?<td.+?>(.+?)</,
    /<span>(% Held by Insiders).+?<td.+?>(.+?)</,
    /<span>(% Held by Institutions).+?<td.+?>(.+?)</,
    /<span>(Shares Short \(.+?\)).+?<td.+?>(.+?)</,
    /<span>(Short % of Float \(.+?\)).+?<td.+?>(.+?)</,
    /<span>(Shares Short \(prior month .+?\)).+?<td.+?>(.+?)</,
    /<span>(Market Cap).+?<td.+?>(.+?)</,
]

let discord = new Client ({ intents: 33281 })

discord .on ('messageCreate', async function (message) {
    let symbol = message.content .match (/^\$([a-zA-Z]{1,5})$/)
    if (! symbol) return

    let text
    try {
        let response = await fetch (`https://finance.yahoo.com/quote/${symbol [1]}/key-statistics`)
        text = await response .text ()
    } catch { return }

    let reply = ''
    for (let regex of regexes) {
        let match = text .match (regex)
        if (! match) continue
        if (match [2] && match [2] .includes ('N/A')) continue

        reply += `${match [1]}`
        if (match [2]) reply += `: ${match [2]}`
        reply += "\n"
    }

    message .reply (reply)
})

discord .on ('ready', function (client) {
    console .log (new Date (), client.user.tag, 'ready!')
})

discord .login ()
