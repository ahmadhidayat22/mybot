const {
	BufferJSON,
	WA_DEFAULT_EPHEMERAL,
	generateWAMessageFromContent,
	proto,
	generateWAMessageContent,
	generateWAMessage,
	prepareWAMessageMedia,
	areJidsSameUser,
	getContentType,
	downloadMediaMessage,
} = require("@adiwajshing/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const { Configuration, OpenAIApi } = require("openai");
let setting = require("./key.json");
const { tmpdir } = require("os");
const Crypto = require("crypto");
const ff = require("fluent-ffmpeg");
const webp = require("node-webpmux");
const path = require("path");
const { TiktokDL } = require("@tobyg74/tiktok-api-dl");
const axios = require("axios");

const current = {
	method: "GET",
	url: "https://epic-free-games.p.rapidapi.com/epic-free-games",
	headers: {
		"X-RapidAPI-Key": "766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
		"X-RapidAPI-Host": "epic-free-games.p.rapidapi.com",
	},
};
const upcoming = {
	method: "GET",
	url: "https://epic-free-games.p.rapidapi.com/epic-free-games-coming-soon",
	headers: {
		"X-RapidAPI-Key": "766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
		"X-RapidAPI-Host": "epic-free-games.p.rapidapi.com",
	},
};

module.exports = sansekai = async (client, m, chatUpdate, store) => {
	try {
		var body =
			m.mtype === "conversation"
				? m.message.conversation
				: m.mtype == "imageMessage"
				? m.message.imageMessage.caption
				: m.mtype == "videoMessage"
				? m.message.videoMessage.caption
				: m.mtype == "extendedTextMessage"
				? m.message.extendedTextMessage.text
				: m.mtype == "buttonsResponseMessage"
				? m.message.buttonsResponseMessage.selectedButtonId
				: m.mtype == "listResponseMessage"
				? m.message.listResponseMessage.singleSelectReply.selectedRowId
				: m.mtype == "templateButtonReplyMessage"
				? m.message.templateButtonReplyMessage.selectedId
				: m.mtype === "messageContextInfo"
				? m.message.buttonsResponseMessage?.selectedButtonId ||
				  m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
				  m.text
				: "";
		var budy = typeof m.text == "string" ? m.text : "";
		// var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
		var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
		const isCmd2 = body.startsWith(prefix);
		const command = body
			.replace(prefix, "")
			.trim()
			.split(/ +/)
			.shift()
			.toLowerCase();
		const args = body.trim().split(/ +/).slice(1);
		const pushname = m.pushName || "No Name";
		const botNumber = await client.decodeJid(client.user.id);
		const itsMe = m.sender == botNumber ? true : false;
		let text = (q = args.join(" "));
		const arg = budy.trim().substring(budy.indexOf(" ") + 1);
		const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

		const from = m.chat;
		const reply = m.reply;
		const sender = m.sender;
		const mek = chatUpdate.messages[0];

		const color = (text, color) => {
			return !color ? chalk.green(text) : chalk.keyword(color)(text);
		};
		const tiktok_url = text;
		// Group
		const groupMetadata = m.isGroup
			? await client.groupMetadata(m.chat).catch((e) => {})
			: "";
		const groupName = m.isGroup ? groupMetadata.subject : "";

		// Push Message To Console
		let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;
		// console.log(groupMetadata)
		if (isCmd2 && !m.isGroup) {
			console.log(
				chalk.black(chalk.bgWhite("[ LOGS ]")),
				color(argsLog, "turquoise"),
				chalk.magenta("From"),
				chalk.green(pushname),
				chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`)
			);
		} else if (isCmd2 && m.isGroup) {
			console.log(
				chalk.black(chalk.bgWhite("[ LOGS ]")),
				color(argsLog, "turquoise"),
				chalk.magenta("From"),
				chalk.green(pushname),
				chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
				chalk.blueBright("IN"),
				chalk.green(groupName)
			);
		}

		if (isCmd2) {
			switch (command) {
				case "help":
				case "menu":
				case "start":
				case "info":
					m.reply(`*Whatsapp Bot OpenAI*
            
*(ChatGPT)*
Cmd: ${prefix}ai 
Tanyakan apa saja kepada AI. 

*(Stiker)*
Cmd: ${prefix}stiker
Membuat stiker dari gambar

*(no-watermark tiktok)*
Cmd: ${prefix}tk or ${prefix}tiktok
Mendownload vidio dari tiktok


*(Matkul)*
Cmd: ${prefix}jadwal or ${prefix}matkul
lihat jadwal matkul 2023


*(Games)*
-Cmd: ${prefix}free
 See free current epic games
-Cmd: ${prefix}up
See free upcoming epic games




`);
// *(stop)*
// Cmd: ${prefix}stop
// Menghentikan bot
					break;
				case "ai":
				case "openai":
				case "chatgpt":
				case "ask":
					try {
						m.reply(`processing your prompt \nPlease wait..`);
						// tidak perlu diisi apikeynya disini, karena sudah diisi di file key.json
						if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI")
							return reply(
								"Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys"
							);
						if (!text)
							return reply(
								`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`
							);
						const configuration = new Configuration({
							apiKey: setting.keyopenai,
						});
						const openai = new OpenAIApi(configuration);
						const response = await openai.createChatCompletion({
							model: "gpt-3.5-turbo",
							messages: [{ role: "user", content: text }],
						});
						m.reply(`${response.data.choices[0].message.content}`);
					} catch (error) {
						if (error.response) {
							console.log(error.response.status);
							console.log(error.response.data);
							console.log(`${error.response.status}\n\n${error.response.data}`);
						} else {
							console.log(error);
							m.reply("Maaf, sepertinya ada yang error :" + error.message);
						}
					}
					break;
				case "img":
				case "ai-img":
				case "image":
				case "images":
				case "dall-e":
				case "dalle":
					try {
						// tidak perlu diisi apikeynya disini, karena sudah diisi di file key.json
						if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI")
							return reply(
								"Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys"
							);
						if (!text)
							return reply(
								`Membuat gambar dari AI.\n\nContoh:\n${prefix}${command} Wooden house on snow mountain`
							);
						const configuration = new Configuration({
							apiKey: setting.keyopenai,
						});
						const openai = new OpenAIApi(configuration);
						const response = await openai.createImage({
							prompt: text,
							n: 1,
							size: "512x512", // you can change the size of the image here
						});
						//console.log(response.data.data[0].url) // see the response
						client.sendImage(from, response.data.data[0].url, text, mek);
					} catch (error) {
						console.log();
						if (error.response) {
							console.log(error.response.status);
							console.log(error.response.data);
							console.log(`${error.response.status}\n\n${error.response.data}`);
						} else {
							console.log(error);
							m.reply("Maaf, sepertinya ada yang error :" + error.message);
						}
					}
					break;

				case "stiker":
					try {
						let buffer = await downloadMediaMessage(
							mek,
							"buffer",
							{},
							{
								reuploadRequest: client.updateMediaMessage,
							}
						);
						if (buffer != "") {
							m.reply("processing your image \nplease wait... ");
						}

						buffer = await writeExifImg(buffer, {
							packname: "amway",
							author: "amway",
						});

						await client.sendMessage(mek.key.remoteJid, {
							sticker: { url: buffer },
						});

						await fs.unlinkSync(buffer);
					} catch (err) {
						console.log("eror", err);
						m.reply(
							`Convert gambar ke stiker.\n\nContoh:\n${prefix}${command} lalu sertakan foto`
						);
					}
					break;
				case "stop":
					await m.reply("Bot stop..\n\n\nPlease contact owner to run ");
					process.exit(0);
					break;
				case "tk":
				case "tiktok":
					if (!text)
						return reply(
							`Download Video from tiktok No watermak.\n\nContoh:\n${prefix}tk (link vidio tiktok) atau\n${prefix}tiktok  (link vidio tiktok)`
						);

					try {
						TiktokDL(tiktok_url, {
							version: "v1",
						}).then(async (result) => {
							if (
								result.status == "success" &&
								result.result.video != undefined
							) {
								m.reply(`downloading..`);

								await client.sendMessage(mek.key.remoteJid, {
									video: { url: result.result.video },
								});
							} else {
								m.reply(`gagal mendownload`);
							}
						});
					} catch (err) {
						console.log(err);
						m.reply(`Hanya vidio tiktok yang bisa di download..`);
					}
					break;

				case "jadwal":
				case "matkul":
					const date = new Date();
					const day = date.getDay();
					let teks;
					let up;
					switch (day) {
						case 0:
							teks = "Tidak ada jadwal sekarang";
							up = "SENIN\n• 07:30 - 09:00 | C306 | Struktur data\n• 14:40 - 16:10 | C307 | Organisasi dan arsitektur komputer";
							break;
						case 1:
							teks = "SENIN\n• 07:30 - 09:00 | C306 | Struktur data\n• 14:40 - 16:10 | C307 | Organisasi dan arsitektur komputer";
							up ="SELASA\n• 09:10 - 10:40 | C304 | Managemen proyek IT\n• 14:40 - 16:10 | C306 | Alajabar linear";
							break;
						case 2: 
							teks = "SELASA\n• 09:10 - 10:40 | C304 | Managemen proyek IT\n• 14:40 - 16:10 | C306 | Alajabar linear";
							up = "RABU\n• 09:10 - 10:40 | C306 | Keamanan komputer\n• 13:00 - 14:30 | C306 | Pemrograman web";
							break;
						case 3:
							teks = "RABU\n• 09:10 - 10:40 | C306 | Keamanan komputer\n• 13:00 - 14:30 | C306 | Pemrograman web";
							up = "KAMIS\n• 10:50 - 12:20 | C306 | Basis data";
							break;
						case 4:
							teks = "KAMIS\n• 10:50 - 12:20 | C306 | Basis data";
							up =  "JUMAT\n• 13:30 - 15:00 | D408 & D409 | Probabiltas dan statistika";
							break;
						case 5:
							teks = "JUMAT\n• 13:30 - 15:00 | D408 & D409 | Probabiltas dan statistika";
							up = "Tidak ada jadwal ";
							break;
						case 6:
							teks = "Tidak ada jadwal sekarang";
							up = "Tidak ada jadwal ";
							break;

					}
					m.reply(`
*JADWAL HARI INI*
${teks}

*JADWAL BESOK*
${up}
`);
					break;

				case "free":
					try {
						const response = await axios.request(current);
						if (response.status != 200) {
							console.log(
								"eror code : ",
								response.status,
								" ",
								response.statusText
							);
						}
						let nama = response.data[0].name;
						let image = response.data[0].offerImageTall;
						let url = response.data[0].appUrl;
						let description = response.data[0].description;
						let publisher = response.data[0].publisher;
						let ket = `*${nama}*\n\nOpen In : ${url}\n\n*Price : free*\n\nDescription : ${description}\n\nPublisher : ${publisher}`;

	

						client.sendImage(from, image, ket, mek);
					} catch (error) {
						console.error(error);
					}
					break;

				case "up":
					try {
						const response = await axios.request(upcoming);
						if (response.status != 200) {
							console.log(
								"eror code : ",
								response.status,
								" ",
								response.statusText
							);
						}
						for (let i = 0; i < response.data.length; i++) {
							let nama = response.data[i].name;
							let image = response.data[i].offerImageTall;
							let url = response.data[i].appUrl;
							let description = response.data[i].description;
							let publisher = response.data[i].publisher;
							let ket = `*${nama}*\n\nOpen In : ${url}\n\nDescription : ${description}\n\n Publisher : ${publisher}`;

							client.sendImage(from, image, ket, mek);
						}
					} catch (error) {
						console.error(error);
					}
					break;

				default: {
					if (isCmd2 && budy.toLowerCase() != undefined) {
						if (m.chat.endsWith("broadcast")) return;
						if (m.isBaileys) return;
						if (!budy.toLowerCase()) return;
						if (argsLog || (isCmd2 && !m.isGroup)) {
							// client.sendReadReceipt(m.chat, m.sender, [m.key.id])
							console.log(
								chalk.black(chalk.bgRed("[ ERROR ]")),
								color("command", "turquoise"),
								color(`${prefix}${command}`, "turquoise"),
								color("tidak tersedia", "turquoise")
							);
						} else if (argsLog || (isCmd2 && m.isGroup)) {
							// client.sendReadReceipt(m.chat, m.sender, [m.key.id])
							console.log(
								chalk.black(chalk.bgRed("[ ERROR ]")),
								color("command", "turquoise"),
								color(`${prefix}${command}`, "turquoise"),
								color("tidak tersedia", "turquoise")
							);
						}
					}
				}
			}
		}
	} catch (err) {
		m.reply(util.format(err));
	}
};

async function imageToWebp(media) {
	const tmpFileOut = path.join(
		tmpdir(),
		`${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
	);
	const tmpFileIn = path.join(
		tmpdir(),
		`${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`
	);

	fs.writeFileSync(tmpFileIn, media);

	await new Promise((resolve, reject) => {
		ff(tmpFileIn)
			.on("error", reject)
			.on("end", () => resolve(true))
			.addOutputOptions([
				"-vcodec",
				"libwebp",
				"-vf",
				"scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
			])
			.toFormat("webp")
			.save(tmpFileOut);
	});

	const buff = fs.readFileSync(tmpFileOut);
	fs.unlinkSync(tmpFileOut);
	fs.unlinkSync(tmpFileIn);
	return buff;
}
async function writeExifImg(media, metadata) {
	let wMedia = await imageToWebp(media);
	const tmpFileIn = path.join(
		"./",
		`${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
	);
	const tmpFileOut = path.join(
		"./",
		`${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
	);
	fs.writeFileSync(tmpFileIn, wMedia);

	if (metadata.packname || metadata.author) {
		const img = new webp.Image();
		const json = {
			"sticker-pack-id": `https://github.com/DikaArdnt/Hisoka-Morou`,
			"sticker-pack-name": metadata.packname,
			"sticker-pack-publisher": metadata.author,
			emojis: metadata.categories ? metadata.categories : [""],
		};
		const exifAttr = Buffer.from([
			0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
			0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00,
		]);
		const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8");
		const exif = Buffer.concat([exifAttr, jsonBuff]);
		exif.writeUIntLE(jsonBuff.length, 14, 4);
		await img.load(tmpFileIn);
		fs.unlinkSync(tmpFileIn);
		img.exif = exif;
		await img.save(tmpFileOut);
		return tmpFileOut;
	}
}

let file = require.resolve(__filename);
fs.watchFile(file, () => {
	fs.unwatchFile(file);
	console.log(chalk.redBright(`Update ${__filename}`));
	delete require.cache[file];
	require(file);
});
