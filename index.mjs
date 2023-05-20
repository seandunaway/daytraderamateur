#!/usr/bin/env node
import { config as dotenv } from 'dotenv'
import { Client } from 'discord.js'

dotenv ()

let regexes = [
    /<h1.+?>(.+?)<\/h1>/m,
    /<span>(Shares Outstanding).+?<td.+?>(.+?)</m,
    /<span>(Implied Shares Outstanding).+?<td.+?>(.+?)</m,
    /<span>(Float).+?<td.+?>(.+?)</m,
    /<span>(% Held by Insiders).+?<td.+?>(.+?)</m,
    /<span>(% Held by Institutions).+?<td.+?>(.+?)</m,
    /<span>(Shares Short \(.+?\)).+?<td.+?>(.+?)</m,
    /<span>(Short % of Float \(.+?\)).+?<td.+?>(.+?)</m,
    /<span>(Shares Short \(prior month .+?\)).+?<td.+?>(.+?)</m,
    /<span>(Market Cap).+?<td.+?>(.+?)</m,
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
