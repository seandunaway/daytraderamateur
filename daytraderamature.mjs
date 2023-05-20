#!/usr/bin/env node
// https://discord.com/api/oauth2/authorize?client_id=1109514098791698502&permissions=3072&scope=bot

import { Client } from 'discord.js'

let discord = new Client ({ intents: 33281 })

discord.on ('messageCreate', async function (message) {
    let symbol = message.content.match (/^\$([a-zA-Z]{1,5})$/)
    if (! symbol) return

    try {
        let response = await fetch (`https://finance.yahoo.com/quote/${symbol [1]}/key-statistics`)
        let text = await response.text ()

        let name = text.match (/<h1.+?>(.+?)<\/h1>/m)
        let shares_outstanding = text.match (/<span>(Shares Outstanding).+?<td.+?>(.+?)</m)
        let shares_outstanding_implied = text.match (/<span>(Implied Shares Outstanding).+?<td.+?>(.+?)</m)
        let float = text.match (/<span>(Float).+?<td.+?>(.+?)</m)
        let percent_insiders = text.match (/<span>(% Held by Insiders).+?<td.+?>(.+?)</m)
        let percent_institutions = text.match (/<span>(% Held by Institutions).+?<td.+?>(.+?)</m)
        let short_shares = text.match (/<span>(Shares Short \(.+?\)).+?<td.+?>(.+?)</m)
        let short_percent = text.match (/<span>(Short % of Float \(.+?\)).+?<td.+?>(.+?)</m)
        let short_shares_prior = text.match (/<span>(Shares Short \(prior month .+?\)).+?<td.+?>(.+?)</m)
        let market_cap = text.match (/<span>(Market Cap).+?<td.+?>(.+?)</m)

        message.reply (
            `${name [1]}
            ${shares_outstanding [1]}: ${shares_outstanding [2]}
            ${shares_outstanding_implied [1]}: ${shares_outstanding_implied [2]}
            ${float [1]}: ${float [2]}
            ${percent_insiders [1]}: ${percent_insiders [2]}
            ${percent_institutions [1]}: ${percent_institutions [2]}
            ${short_shares [1]}: ${short_shares [2]}
            ${short_percent [1]}: ${short_percent [2]}
            ${short_shares_prior [1]}: ${short_shares_prior [2]}
            ${market_cap [1]}: ${market_cap [2]}`
        )
    } catch { return }
})

discord.on ('ready', function (client) {
    console.log (new Date (), client.user.tag, 'ready!')
})

discord.login ('MTEwOTUxNDA5ODc5MTY5ODUwMg.G5I1wC.VsF-9bZvbYqGG5fgfTDoPdWy6rB7G6xTR5iVVQ')
