const Discord = require('discord.js');
const Gamedig = require('gamedig');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

const token = ''; //Token Buraya

// sunucu port vb start

let serverStatus = {
    serverIP: '11.111.11.111', //İp 
    serverPort: 30120, // Port
    players: null, // Değer null olarak kalıcak
    maxPlayers: null, // Değer null olarak kalıcak
    ping: null // Değer null olarak kalıcak
};

let serverMessage = null;

// sunucu port vb end

//Bot Giriş Yap start

client.on('ready', async() => {
    console.log(`Bot Başarıyla Giriş Yaptı ${client.user.tag}`);
    checkServerStatus();
    setInterval(checkServerStatus, 5000);

    const channelID = 'Kanal İD'; // Bot 0 Dan Başlayınca Önceki Kontrol Mesajlarını Sil
    const channel = await client.channels.fetch(channelID);
    if (channel.isText()) {
        const messages = await channel.messages.fetch({ limit: 100 });
        channel.bulkDelete(messages);
    }
});

//Bot Giriş Yap End

//Sunucuya Hızlı Giriş İçin !ip Komutu start

client.on('messageCreate', async(message) => {
    if (message.content === '!ip') {
        const embed = new Discord.MessageEmbed()
            .setColor('#0000FF')
            .setTitle('Server İp Hızlı Giriş Linki')
            .setDescription(`First Rp Fivem Sunucusuna Hızlı Bağlanmak İçin Aşağıdaki Butona Tıklayın.`)
            .setFooter('First Rp Server', client.user.avatarURL());

        const button = new Discord.MessageButton()
            .setLabel('Sunucuya Bağlan')
            .setURL(`http://${serverStatus.serverIP}:${serverStatus.serverPort}`)
            .setStyle('LINK');

        embed.setThumbnail('https://thumbs.dreamstime.com/b/dreamstime-187819349.jpg'); // Resmin linkini buraya girin

        message.channel.send({ embeds: [embed], components: [{ type: 1, components: [button] }] })
            .catch((error) => console.error('Mesaj gönderilirken bir hata oluştu:', error));
    }
});

//Sunucuya Hızlı Giriş İçin !ip Komutu end

// Fivem Sunucusu Kontrol Response start

function checkServerStatus() {
    Gamedig.query({
            type: 'fivem',
            host: serverStatus.serverIP,
            port: serverStatus.serverPort,
        })
        .then((server) => {
            if (!serverStatus.players) {
                console.log('Sunucu aktif oldu!');
            }

            serverStatus.players = server.players.length;
            serverStatus.maxPlayers = server.maxplayers;
            serverStatus.ping = server.ping;

            const activity = `Oyuncu Sayısı: ${serverStatus.players} / Sunucu Durumu: Aktif`;
            client.user.setActivity(activity, { type: 'PLAYING' });

            const embed = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTitle('First Rp Sunucu Durumu')
                .setDescription('Sunucu aktif ve online iyi oyunlar dileriz.')
                .setFooter('First Rp Server', client.user.avatarURL());

            if (serverStatus.players !== null && serverStatus.maxPlayers !== null) {
                embed.addField('Oyuncu Sayısı', `${serverStatus.players}/${serverStatus.maxPlayers}`, true);
            } else {
                embed.addField('Oyuncu Sayısı', 'Bilinmiyor', true);
            }

            if (serverStatus.ping !== null) {
                embed.addField('Ping', `${serverStatus.ping} ms`, true);
            } else {
                embed.addField('Ping', 'Bilinmiyor', true);
            }
            embed.setThumbnail('https://thumbs.dreamstime.com/b/dreamstime-187819349.jpg'); // Resmin linkini buraya girin
            if (serverMessage) {
                serverMessage.edit({ embeds: [embed] });
            } else {
                client.channels.fetch('1113932158038442044') // Discord kanalının ID'sini buraya girin
                    .then((channel) => {
                        channel.send({ embeds: [embed] })
                            .then((sentMessage) => {
                                serverMessage = sentMessage;
                                console.log('Sunucu durumu mesajı gönderildi.');
                            })
                            .catch((error) => console.error('Mesaj gönderilirken bir hata oluştu:', error));
                    })
                    .catch((error) => console.error('Kanal bulunamadı:', error));
            }
        })
        .catch((error) => {
            console.error('Sunucu durumu alınırken bir hata oluştu:', error);

            serverStatus.players = null;
            serverStatus.maxPlayers = null;
            serverStatus.ping = null;
            client.user.setActivity('Sunucu Çevrimdışı', { type: 'PLAYING' });

            const embed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('First Rp Sunucu Durumu')
                .setDescription('Sunucu çevrimdışı veya erişilemez durumda.')
                .setFooter('First Rp Server', client.user.avatarURL())
                .setThumbnail('https://thumbs.dreamstime.com/b/dreamstime-187819349.jpg'); // Resmin linkini buraya girin

            if (serverMessage) {
                serverMessage.edit({ embeds: [embed] });
            } else {
                client.channels.fetch('Kanal id') // Discord kanalının ID'sini buraya girin
                    .then((channel) => {
                        channel.send({ embeds: [embed] })
                            .then((sentMessage) => {
                                serverMessage = sentMessage;
                                console.log('Sunucu durumu mesajı gönderildi.');
                            })
                            .catch((error) => console.error('Mesaj gönderilirken bir hata oluştu:', error));
                    })
                    .catch((error) => console.error('Kanal bulunamadı:', error));
            }

            console.log('Sunucu Çevrimdışı');
        });
}

// Fivem Sunucusu Kontrol Response end


//Botu Sese Sok start 

const { joinVoiceChannel } = require('@discordjs/voice');
client.on('ready', () => {
    joinVoiceChannel({
        channelId: "1113931698313363507",
        guildId: "929434654086414336",
        adapterCreator: client.guilds.cache.get("929434654086414336").voiceAdapterCreator
    });
});

//Botu Sese Sok End


client.login(token); //Giriş Yap
