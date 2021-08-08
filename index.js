const Discord = require("discord.js"); //Conexão com a livraria Discord.js
const client = new Discord.Client({partials: ["MESSAGE", "USER", "REACTION",]}); //Criação de um novo Client
const config = require("./config.json"); //Pegando o prefixo do bot para respostas de comandos
const db = require("quick.db"); //Database quick.db
const enmap = require('enmap');

const usersMap = new Map();

// SPAM //

const valor = 3 //limite de mensagens
const tempmute = 60000 //tempo do mute
const dentro = 1000 //se o usuário floodar sem para até bater o limite antes desse tempo ele será mutado
const chx = ''//id do canal que não vai funciona o antispam - (Opcional) - Para desligar fução é so deixa em branco
const chx1 = ''//id do canal que não vai funciona o antispam - (Opcional) - Para desligar fução é so deixa em branco
const chx2 = ''//id do canal que não vai funciona o antispam - (Opcional) - Para desligar fução é so deixa em branco
const chx3 = ''//id do canal que não vai funciona o antispam - (Opcional) - Para desligar fução é so deixa em branco

// TEMPO CALL //



// scripts //

client.on('ready', () => {
  let ferinha = [
    `prefixo: ${config.prefix}`,
  ],
  fera = 0;
setInterval( () => client.user.setActivity(`${ferinha[fera++ % ferinha.length]}`, {
      type: "PLAYING" //mais tipos: WATCHING / LISTENING
    }), 1000 * 30); 
client.user
    .setStatus("online")
  var logger_1 = require("./modules/log");
var logger = new logger_1.default();
logger.warn('Logado como ' + client.user.tag + "\n");

/*console.log(`
-------------------------
BOT - online
Username: ${client.user.username}
Client ID: ${client.user.id}
---------STATUS----------
`)*/

})
client.on('message', message => {

     if (message.author.bot) return;
     if (message.channel.type == 'dm') return;

     if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
     if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;


    const args = message.content
        .trim().slice(config.prefix.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`./commands/${command}.js`)
        commandFile.run(client, message, args);

    } catch (err) {
    console.error('Erro:' + err);

    }
});

client.on('message', message => {

  if(message.author.bot) return;
  
  if (usersMap.has(message.author.id)) {  
  
  if (message.channel.id === chx) return;
  if (message.channel.id === chx1) return;
  if (message.channel.id === chx2) return;
  if (message.channel.id === chx3) return;
    
    const userData = usersMap.get(message.author.id);
    const { lastMessage, time } = userData;
    const tem = message.createdTimestamp - lastMessage.createdTimestamp;
    let msgCount = userData.msgCount;
    console.log(tem);
    if (tem > dentro) {
        clearTimeout(time);
        console.log('tempo resetado');
        userData.msgCount = 1;
        userData.lastMessage = message;
        userData.timer = setTimeout(() => {
            usersMap.delete(message.author.id);
            
        }, tempmute);
        usersMap.set(message.author.id, userData);
    }
  else {
   ++ msgCount;
  if(parseInt(msgCount) === valor) {

    const role = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'mutado')//necessario ter o cargo mutado criado no servidor

    message.member.roles.add(role)
     message.channel.send(new Discord.MessageEmbed().setDescription(`${message.author} você foi mutado por floodar sem parar`)) //texto de mute 

     setTimeout(() => {
       message.member.roles.remove(role)
          message.channel.send(new Discord.MessageEmbed().setDescription(`${message.author} você foi desmutado`)) //texto de unmute
     }, tempmute)
  } else {
    userData.msgCount = msgCount;
    usersMap.set(message.author.id, userData);
    }
  }
  

}
else {
  let fn = setTimeout(() => {
    usersMap.delete(message.author.id);
  }, tempmute)

  usersMap.set(message.author.id, {
      msgCount: 1,
      lastMessage: message,
      time: fn
  });
}
 


});

const settings = new enmap({
    name: "settings",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});

const dono = 'Hishiro';
const link = 'https://discord.gg/nm96RzswZe';
const prefixobot = 'cdd!';
const nomedobot = 'Cidade de Deus 👑';
const botversao = 'Alpha v.1.0.0';
const sidoka = new Discord.MessageEmbed()
      .setDescription(`**Olá me chamo ${nomedobot} [ Desenvolvido Por [${dono}](${link}) ] \n Estou na Versao ${botversao}\n Meu Prefixo e [ ${prefixobot} ]**`)
      .setColor('BLACK')
       .setTimestamp()
      .setFooter(`Ultilize ${prefixobot} help para saber meus Comandos`, ``);

      const alt = require("discord-anti-alt");
      const account = new alt.config({
          days: 1,//Dias de conta para ser banida ou expulsa
          options: "kick"
      });
      
      let altChannel = "863191034866434078"; //Canal que vai as logs
      
      client.on('guildMemberAdd', async member => {
          let play = account.run(member);
          let info = alt.profile(member); 
          if(play){
              
              const embed = new Discord.MessageEmbed()
              .setAuthor(info.userTag,info.avatar)
              .setColor(config.color)
              .addField("Usuário",info.username)
              .addField("ID",info.userID)
              .addField("Tempo",info.userAge)
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, format: "png", size: 1024 }))
              .setFooter(`Atenciosamente Cidade de Deus ©`)
              .setTimestamp()
              return member.guild.channels.cache.get(altChannel).send(embed)
             
          }
      })

client.on("message", message => {
    if (message.author.bot) return;
    if (message.channel.type == 'mençao')
    return
    if(message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {
    return message.channel.send(sidoka).then(msg=>{msg.delete({timeout:10000})});
    }
    });
client.on("guildMemberAdd",  async (member) => {
    let ferinha_autorole = db.get(`ferinha_autorole_${member.guild.id}`);
    if (!ferinha_autorole === null) return;
    member.roles.add(ferinha_autorole)
  });
  
client.on('message', message => {

  let prefixo_fera = db.get(`ferinha_prefixo_${message.guild.id}`);
  if (!prefixo_fera) prefixo_fera = config.prefix;

  if (message.author.bot) return;
  if (message.channel.type == 'dm') return;
  if (!message.content.toLowerCase().startsWith(prefixo_fera.toLowerCase())) return;
  if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

 const args = message.content
     .trim().slice(prefixo_fera.length)
     .split(/ +/g);
 const command = args.shift().toLowerCase();

 try {
     const commandFile = require(`./commands/${command}.js`)
     commandFile.run(client, message, args);
 } catch (err) {

   let emoji_fera = "❌";
   let ferinha_author = message.author;
   let prefixo_fera_handler = prefixo_fera;
   let comando_inexistente = `${prefixo_fera_handler}${command}`;

   message.channel.send(`${emoji_fera} | ${ferinha_author} O comando \`${comando_inexistente}\` não existe!`).then(msg=>{msg.delete({timeout:5000})});

 console.error('Erro:' + err);
}
});

client.on("message", async message => {
  const regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|club)|discordapp\.com\/invite|discord\.com\/invite)\/.+[a-z]/gi;
  if (regex.exec(message.content)) {
  if (!message.member.hasPermission("MANAGE_MESSAGES"))  
    await message.delete({timeout: 100});
    await message.channel.send(
      `${message.author} **você não pode postar link de outros servidores aqui!**`
      );
    }
});

client.on("guildMemberAdd", (member) => {
    let ferinha_canal_de_boas_vindas = db.get(`ferinha_boas_vindas_${member.guild.id}`);
    let ferinha_contador = member.guild.memberCount;
    let ferinha_servidor = member.guild.name;
  
    if (!ferinha_canal_de_boas_vindas) return;
  
    let msg_embed_ferinha = new Discord.MessageEmbed() //mensagem embed
    .setAuthor(`${member.user.tag}`, member.user.avatarURL())
    .setDescription(`<a:world:867925405171068958> Seja bem-vindx ${member.user} ao servidor **${ferinha_servidor}**! \nAtualmente estamos com \`${ferinha_contador}\` membros!<a:ww_corasub:867927629406277632>`)
    .setColor("#F8F8FF")
  
    let msg_not_embed_ferinha = `Boas Vindas ${member.user}! \nAtualmente estamos com \`${ferinha_contador}\` membros!`; //mensagem não embed
  
    client.channels.cache.get(ferinha_canal_de_boas_vindas).send(msg_embed_ferinha).then(msg => msg.delete({ timeout: 8000 }))
  });

client.login(config.token); //Ligando o Bot caso ele consiga acessar o token