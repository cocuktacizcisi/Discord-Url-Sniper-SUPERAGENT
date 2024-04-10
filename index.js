console.clear();

const { WebSocket } = require('ws');
const superagent = require('superagent');

const listtkn = "";
const sniptkn = "";
const serverid = "";
const websocket = "wss://gateway-us-east1-b.discord.gg";

const ws = new WebSocket(websocket);
const guilds = {};
let vanity = '';

ws.onopen = async () => {
    ws.send(JSON.stringify({
        op: 2,
        d: {
            token: listtkn,
            intents: 1,
            properties: {
                os: 'linux',
                browser: 'firefox',
                device: 'firefox'
            }
        }
    }));
};

ws.onmessage = async message => {
    const data = JSON.parse(message.data);
    if (data.t === 'GUILD_UPDATE') {
        const bum = guilds[data.d.guild_id];
        if (bum && bum !== data.d.vanity_url_code) {
            const tim = Date.now();
            const payload = { code: bum };
            try {
                const response = await superagent.patch(`https://canary.discord.com/api/v7/guilds/${serverid}/vanity-url`)
                    .send(payload)
                    .set('Authorization', sniptkn);

                vanity = bum;
                noldu = `GUİLD_UPDATE`
                const çek = Date.now();
                const çektim = çek - tim;
                console.log(`VANİTY: ${vanity}\nMS: ${çektim}\nEVENT: ${noldu}`);
            } catch (error) {
                console.error('Hata:', error.response.body);
            }
        }
    } else if (data.t === 'GUILD_DELETE') {
        const bum = guilds[data.d.id];
        if (bum) {
            const tim = Date.now();
            const payload = { code: bum };
            try {
                const response = await superagent.patch(`https://canary.discord.com/api/v8/guilds/${serverid}/vanity-url`)
                    .send(payload)
                    .set('Authorization', sniptkn);

                vanity = bum;
                noldu = `GUILD_DELETE`
                const çek = Date.now();
                const çektim = çek - tim;
                console.log(`VANİTY: ${vanity}\nMS: ${çektim}\nEVENT: ${noldu}`);
            } catch (error) {
                console.error('Hata:', error.response.body);
            }
        }
    } else if (data.t === 'READY') {
        for (let guild of data.d.guilds) {
            if (guild.vanity_url_code) guilds[guild.id] = guild.vanity_url_code;
        }
        console.log(Object.values(guilds).map(code => code).join(', '));
    }

    if (data.op === 10) {
        const heartbeat = {
            op: 1,
            d: {},
            s: null,
            t: 'heartbeat'
        };
        setInterval(() => ws.send(JSON.stringify(heartbeat)), data.d.heartbeat_interval);
    } else if (data.op === 7) {
        ws.close();
    }
};

ws.onclose = () => process.exit();
ws.onerror = () => process.exit();