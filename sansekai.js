const { downloadMediaMessage } = require("@whiskeysockets/baileys");
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
// const axios = require("axios");
// const axios = require('axios');

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
		// const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

		const from = m.chat;
		const reply = m.reply;
		// const sender = m.sender;
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
		const axios = require('axios');

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
			let kirim = `[ LOGS ] ${argsLog} from ${pushname}`;
			await client.sendMessage(botNumber, { text: kirim });
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
			let kirim = `[ LOGS ] ${argsLog} From ${pushname} IN ${groupName}`;
			await client.sendMessage(botNumber, { text: kirim });
		}

		if (isCmd2) {
			switch (command) {
				case "info":
					const waktu = new Date();
					const year = waktu.getFullYear();
					const month = waktu.getMonth();
					const days = waktu.getDate();
					const hours = waktu.getHours();
					const minutes = waktu.getMinutes();
					const seconds = waktu.getSecond();

					console.log(year, month, days, " ", hours, minutes, seconds);

				// 	break;
				case "help":
				case "menu":
				case "start":
					m.reply(`*▁ ▄ ▆ ▇ █ Whatsapp Bot █ ▇ ▆ ▄ ▁*
            
*ミ★ ChatGPT ★彡*
★ Cmd: ${prefix}ai 
   Tanyakan apa saja kepada AI. {versi gpt 3.5 turbo}
★ Cmd: ${prefix}gpt
   Tanyakan apa saja kepada AI. {versi gpt 5} 

*ミ★ Stiker ★彡*
★ Cmd: ${prefix}stiker
   Membuat stiker dari gambar

*ミ★ tiktok download ★彡*
★ Cmd: ${prefix}tkmp4 or ${prefix}tiktok-video
   Mendownload vidio dari tiktok

★ Cmd: ${prefix}tkmp3 or ${prefix}tiktok-song
   Mendownload lagu dari tiktok

*ミ★ Instagram download  ★彡*
★ Cmd: ${prefix}ig
   Mendownload vidio/gambar dari instagram (reels/IGTV/Post)

★ Cmd: ${prefix}igs or ${prefix}ig-story
   Mendownload vidio/gambar dari story instagram

*ミ★ Youtube download  ★彡*
★ Cmd: ${prefix}ytmp4
   Mendownload vidio dari youtube
★ Cmd: ${prefix}ytmp3
   Mendownload audio dari youtube

*ミ★ Matkul ★彡*
★ Cmd: ${prefix}jadwal or ${prefix}matkul
   lihat jadwal matkul hari ini

*ミ★ Games ★彡*
★ Cmd: ${prefix}free
   See free current epic games
★ Cmd: ${prefix}up
   See free upcoming epic games

*ミ★ cendol ★彡*
★ Cmd: ${prefix}cendol
   `);

					break;
				case "ai":
				case "ask":
					try {
						// m.reply(`processing your prompt \nPlease wait..`);
						if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI")
							return reply(
								"Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys"
							);
						if (!text) {
							return reply(
								`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`
							);
						} else {
							// reply(`processing your prompt \nPlease wait..`);
							await waitEmote(mek.key);
						}

						const configuration = new Configuration({
							apiKey: setting.keyopenai,
						});
						const openai = new OpenAIApi(configuration);
						const response = await openai.createChatCompletion({
							model: "gpt-3.5-turbo",
							messages: [{ role: "user", content: text }],
						});
						if (response.status != 200) throw new Error();
						if (response.status == 200) await doneEmote(mek.key);

						m.reply(`${response.data.choices[0].message.content} \n\n<gpt-3>`);
					} catch (error) {
						if (error.response) {
							console.log(error.response.status);
							console.log(error.response.data);
							console.log(`${error.response.status}\n\n${error.response.data}`);
						} else {
							console.log(error);
							m.reply("Maaf, sepertinya ada yang error :" + error.message);
							failEmote(mek.key);
							
						}
					}
					break;
				
				
				case "gpt":
					if (!text) {
					return reply(
						`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`
					);
					} else {
						// reply(`processing your prompt \nPlease wait..`);
						await waitEmote(mek.key);
					}
				
					// const axios = require('axios');
					const gpt5 = {
						method: 'POST',
						url: 'https://chatgpt-gpt5.p.rapidapi.com/ask',
						headers: {
						  'content-type': 'application/json',
						  'X-RapidAPI-Key': '766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46',
						  'X-RapidAPI-Host': 'chatgpt-gpt5.p.rapidapi.com'
						},
						data: {
						  query: text
						}
					  };

					  try {
						const response = await axios.request(gpt5);
						if (response.status != 200) throw new Error();
						if (response.status == 200) await doneEmote(mek.key);

						await m.reply(`${response.data.response} \n\n<gpt-5>`);

						// console.log(response.data);
					} catch (error) {
						console.error(error);
						m.reply(`maaf sepertinya ada yang error: ${error.message}`);
						failEmote(mek.key);
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
							// m.reply("processing your image \nplease wait... ");
							await waitEmote(mek.key);
						}

						buffer = await writeExifImg(buffer, {
							packname: "0w0",
							author: "0w0",
						});

						await client.sendMessage(mek.key.remoteJid, {
							sticker: { url: buffer },
						});
						doneEmote(mek.key);

						fs.unlinkSync(buffer);
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
					
				case "tkmp4":
				case "tiktok-video":
					if (!text)
						return reply(
							`Download Video from tiktok No watermak.\n\nContoh:\n${prefix}tkmp4 (link vidio tiktok) atau\n${prefix}tiktok-video (link vidio tiktok)`
						);

					try {
						TiktokDL(tiktok_url, {
							version: "v1",
						}).then(async (result) => {
							if (
								result.status == "success" &&
								result.result.video != undefined
							) {
								// m.reply(`downloading..`);
								await waitEmote(mek.key);

								await client.sendMessage(mek.key.remoteJid, {
									video: { url: result.result.video },
								});
								await doneEmote(mek.key);
							} else {
								m.reply(`gagal mendownload\ncoba lagi nanti`);
							}
						});
					} catch (err) {
						console.log(err);
						m.reply(`Hanya vidio tiktok yang bisa di download..`);
						failEmote(mek.key);
						
					}
					break;

				
				case "tkmp3":
				case "tiktok-song":
					if (!text)
						return reply(
							`Download lagu from tiktok .\n\nContoh:\n${prefix}tkmp3 (link tiktok) atau\n${prefix}tiktok-song (link tiktok)`
						);

					try {
						TiktokDL(tiktok_url, {
							version: "v3",
						}).then(async (result) => {
							if (
								result.status == "success" &&
								result.result.music != undefined
							) {
								// m.reply(`downloading..`);
								await waitEmote(mek.key);

								await client.sendMessage(
									mek.key.remoteJid,
									{
										audio: { url: result.result.music },
										mimetype: "audio/mp4",
									},
									{ url: result.result.music }
								);
								await doneEmote(mek.key);

								// console.log(result.result.music);
							} else {
								m.reply(`gagal mendownload\ncoba lagi nanti atau ganti link`);
							}
						});
					} catch (err) {
						console.log(err);
						m.reply(`Hanya music tiktok yang bisa di download..`);
						failEmote(mek.key);

					}
					break;

				case "jadwal":
				case "matkul":
					const date = new Date();
					const day = date.getDay();
					// m.reply(`${day}`);
					console.log(day);
					let teks;
					let up;
					switch (day) {
						case 0:
							teks = "Tidak ada jadwal sekarang";
							up =
								"SENIN\n• 07:30 - 09:00 | C306 | Struktur data\n• 14:40 - 16:10 | C307 | Organisasi dan arsitektur komputer";
							break;
						case 1:
							teks =
								"SENIN\n• 07:30 - 09:00 | C306 | Struktur data\n• 14:40 - 16:10 | C307 | Organisasi dan arsitektur komputer";
							up =
								"SELASA\n• 09:10 - 10:40 | C304 | Managemen proyek IT\n• 14:40 - 16:10 | C306 | Alajabar linear";
							break;
						case 2:
							teks =
								"SELASA\n• 09:10 - 10:40 | C304 | Managemen proyek IT\n• 14:40 - 16:10 | C306 | Alajabar linear";
							up =
								"RABU\n• 09:10 - 10:40 | C306 | Keamanan komputer\n• 13:00 - 14:30 | C306 | Pemrograman web";
							break;
						case 3:
							teks =
								"RABU\n• 09:10 - 10:40 | C306 | Keamanan komputer\n• 13:00 - 14:30 | C306 | Pemrograman web";
							up = "KAMIS\n• 10:50 - 12:20 | C306 | Basis data";
							break;
						case 4:
							teks = "KAMIS\n• 10:50 - 12:20 | C306 | Basis data";
							up =
								"JUMAT\n• 13:30 - 15:00 | D408 & D409 | Probabiltas dan statistika";
							break;
						case 5:
							teks =
								"JUMAT\n• 13:30 - 15:00 | D408 & D409 | Probabiltas dan statistika";
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
							m.reply(`eror code : ${response.status}`);
						} else {
							// m.reply(`please wait...`);
							await waitEmote(mek.key);
						}
						for (let i = 0; i < response.data.length; i++) {
							let nama = response.data[i].name;
							let image = response.data[i].offerImageTall;
							let url = response.data[i].appUrl;
							let description = response.data[i].description;
							let publisher = response.data[i].publisher;
							let ket = `*${nama}*\n\nOpen In : ${url}\n\n*Price : free*\n\nDescription : ${description}\n\nPublisher : ${publisher}`;

							await client.sendImage(from, image, ket, mek);
						}
						await doneEmote(mek.key);
					} catch (error) {
						console.error(error);
						m.reply("maaf sepertinya ada yang error : ", error);
						failEmote(mek.key);

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
							m.reply(`eror code : ${response.status}`);
						} else {
							// m.reply(`please wait...`);
							await waitEmote(mek.key);
						}
						for (let i = 0; i < response.data.length; i++) {
							let nama = response.data[i].name;
							let image = response.data[i].offerImageTall;
							let url = response.data[i].appUrl;
							let description = response.data[i].description;
							let publisher = response.data[i].publisher;
							let ket = `*${nama}* (coming soon)\n\nOpen In : ${url}\n\nDescription : ${description}\n\nPublisher : ${publisher}`;

							await client.sendImage(from, image, ket, mek);
						}
						await doneEmote(mek.key);
					} catch (error) {
						console.error(error);
						m.reply("maaf sepertinya ada yang error : ", error);
						failEmote(mek.key);

					}
					break;

				case "ig":
				case "instagram":
					if (!text)
						return reply(
							`Download Video/gambar dari ig.\n\nContoh:\n${prefix}ig (link instagram) atau\n${prefix}instagram (link instagram)`
						);

					const options = {
						method: "GET",
						url: "https://instagram-api32.p.rapidapi.com/",
						params: {
							url: text,
						},
						headers: {
							"X-RapidAPI-Key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"X-RapidAPI-Host": "instagram-api32.p.rapidapi.com",
						},
					};
					try {
						const response = await axios.request(options);
						if (response.status != 200) throw new Error();
						if (response.status == 200) await waitEmote(mek.key);

						for (var i = 0; i < response.data.total_count; i++) {
							let p = response.data.medias[i].extension;
							let medias = response.data.medias[i].url;
							// console.log(p);
							if (p === "jpg") {
								const tekss = " ";
								await client.sendImage(from, medias, tekss, mek);
							} else if (p === "mp4") {
								await client.sendMessage(mek.key.remoteJid, {
									video: { url: medias },
								});
							}

							// await client.sendMessage(mek.key.remoteJid , {p : })
							// console.log(response.data);
						}

						doneEmote(mek.key);
					} catch (error) {
						console.error(error);
						m.reply("maaf sepertinya ada yang error : ", error);
						failEmote(mek.key);

					}

					break;

				case "igs":
				case "ig_story":
					if (!text)
						return reply(
							`Download Video/gambar dari story ig.\n\nContoh:\n${prefix}igs (username instagram) atau\n${prefix}ig-story (username instagram)`
						);
					const apaini = {
						method: "GET",
						url: "https://instagram-api32.p.rapidapi.com/",
						params: {
							username: text,
						},
						headers: {
							"X-RapidAPI-Key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"X-RapidAPI-Host": "instagram-api32.p.rapidapi.com",
						},
					};

					try {
						const response = await axios.request(apaini);
						if (response.status != 200) throw new Error();
						if (response.status == 200) await waitEmote(mek.key);

						for (var i = 0; i < response.data.total_count; i++) {
							let p = response.data.medias[i].extension;
							let medias = response.data.medias[i].url;

							if (p === "jpg") {
								const tekss = " ";
								await client.sendImage(from, medias, tekss, mek);
							} else if (p === "mp4") {
								await client.sendMessage(mek.key.remoteJid, {
									video: { url: medias },
								});
							}

							// await client.sendMessage(mek.key.remoteJid , {p : })
						}

						// console.log(response.data);
						doneEmote(mek.key);
					} catch (error) {
						console.error(error);
						m.reply("maaf sepertinya ada yang error : ", error);
						failEmote(mek.key);

					}
					break;

				case "ytmp4":
					if (!text)
						return reply(
							`Download Video dari yt.\n\nContoh:\n${prefix}ytmp4 (link youtube)`
						);

					const ytmp4 = {
						method: "GET",
						url: "https://youtube-audio-video-download.p.rapidapi.com/geturl",
						params: {
							video_url: text,
						},
						headers: {
							"X-RapidAPI-Key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"X-RapidAPI-Host": "youtube-audio-video-download.p.rapidapi.com",
						},
					};
					try {
						const response = await axios.request(ytmp4);
						// console.log(response);

						if (response.status == 200) waitEmote(mek.key);
						if (response.status != 200) throw new Error();

						await client.sendMessage(mek.key.remoteJid, {
							video: { url: response.data.video_high },
						});
						doneEmote(mek.key);
					} catch (error) {
						console.error(error);
						m.reply(`maaf sepertinya ada yang eror : ${error.message}`);
						failEmote(mek.key);

					}
					break;

				case "ytmp3":
					if (!text)
						return reply(
							`Download audio dari yt.\n\nContoh:\n${prefix}ytmp3 (link youtube)`
						);

					const ytmp3 = {
						method: "GET",
						url: "https://youtube-audio-video-download.p.rapidapi.com/geturl",
						params: {
							video_url: text,
						},
						headers: {
							"X-RapidAPI-Key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"X-RapidAPI-Host": "youtube-audio-video-download.p.rapidapi.com",
						},
					};
					try {
						const response = await axios.request(ytmp3);
						// console.log(response.statusCode);

						if (response.status == 200) waitEmote(mek.key);
						if (response.status != 200) throw new Error();

						await client.sendMessage(mek.key.remoteJid, {
							audio: { url: response.data.audio_high },
							mimetype: "audio/mp4",
						});
						doneEmote(mek.key);

						// console.log(response.data.video_high);
					} catch (error) {
						console.error(error);
						m.reply(`maaf sepertinya ada yang eror : ${error.message}`);
						failEmote(mek.key);

					}
					break;

				case "spech-id":
					// const axios = require("axios");

					const spechId = {
						method: "GET",
						url: "https://text-to-speech27.p.rapidapi.com/speech",
						params: {
							text: text,
							lang: "id",
						},
						headers: {
							"X-RapidAPI-Key":
								"766d24ccc8msh20c3ff3132d20fep1e10fajsnc931cbce4d46",
							"X-RapidAPI-Host": "text-to-speech27.p.rapidapi.com",
						},
					};

					try {
						const response = await axios.request(spechId);

						await client.sendMessage(mek.key.remoteJid, {audio:  response.data, mimetype: 'audio/mp4'});
						// console.log(response.data);
					} catch (error) {
						console.error(error);
					}
					break;

				case "ping":
					client.sendMessage(
						mek.key.remoteJid,
						{ text: "pong" },
						{ ephemeralExpiration: WA_DEFAULT_EPHEMERAL }
					);
					break;

				case "cendol":
					m.reply(`cendol nya dong puh sepuh https://saweria.co/amway`);
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

		async function waitEmote(keyMessage) {
			const reactionMessage = {
				react: {
					text: "⏳", // use an empty string to remove the reaction✅
					key: keyMessage,
				},
			};
			await client.sendMessage(mek.key.remoteJid, reactionMessage);
		}
		async function doneEmote(keyMessage) {
			const reactionMessage = {
				react: {
					text: "✅", // use an empty string to remove the reaction
					key: keyMessage,
				},
			};
			await client.sendMessage(mek.key.remoteJid, reactionMessage);
		}
		async function failEmote(keyMessage) {
			const reactionMessage = {
				react: {
					text: "❌", // use an empty string to remove the reaction
					key: keyMessage,
				},
			};
			await client.sendMessage(mek.key.remoteJid, reactionMessage);
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
