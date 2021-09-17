const config = require('../../.env/config.json')

module.exports = {
  name: 'destroy',
  description: 'Destroys other users with a chance of a backfire or miss',
  args: false, //true
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: [''],
  execute (message, args) {
    var targetIdentified = false
    var botId = "<@!" + config.discord.id + ">"
    var userId = "<@!" + message.author.id + ">"

    /*
    if (args.length == 0) {
      message.channel.send("No target specified, please use: !destroy @<user>")
      //break;
    }
    */

    for (var i = 0; i < args.length; i++) {
        var targetIdentified = true
        //console.log(args[i])

        //review below logic
        if (args[i].indexOf("><") !== -1) {
          targetIdentified = false
        } else if (!args[i].startsWith("<@") && args[i] !== "@everyone" && args[i] !== "@here") {
          targetIdentified = false
        } else if (args[i] === botId) {
          var order = userId + " attempts to destroy " + args[i] + ", but fails"
          var image = "https://i.imgur.com/Av8WEet.gifv"
        }  else if (args[i] === userId) {
          var sepukkuArray = [
              ["https://i.imgur.com/SPme9Mk.gifv", "commits seppuku"],
              ["https://i.imgur.com/QdoEa2D.gifv", "commits seppuku"],
              ["https://i.imgur.com/zWD0bNI.gifv", "commits seppuku"],
              ["https://i.imgur.com/epC83w1.gifv", "commits sudoku"]
          ]

          var sepukkuIndex = Math.floor(Math.random() * sepukkuArray.length)
          var order = userId + " " + sepukkuArray[sepukkuIndex][1]
          var image = sepukkuArray[sepukkuIndex][0]
        } else if (args[i] === config.owner.id) {
          var order = userId + "'s gun misfires and kills himself after attempting to shoot " + config.owner.id
          var image = "https://i.imgur.com/exd2yso.gifv"
        } else if (args[i] === "@here") {
          var hereArray = [
              ["https://i.imgur.com/llTxowt.gifv", "wipes out everyone here with a comet"],
              ["https://i.imgur.com/rQ97Qrf.gifv", "wipes out everyone here with a colony drop"]
          ]

          var hereIndex = Math.floor(Math.random() * hereArray.length)
          var order = userId + " " + hereArray[hereIndex][1]
          var image = hereArray[hereIndex][0]
        } else if (args[i] === "@everyone") {
          var everyoneArray = [
              ["https://i.imgur.com/88TvEfa.gifv", "destroys everyone with an ignition from the Death Star"],
              ["https://i.imgur.com/0oGyclt.gifv", "destroys everyone with an ignition from the Death Star"],
              ["https://i.imgur.com/U8mw1is.gifv", "destroys everyone with a single reactor ignition from the Death Star"],
              ["https://i.imgur.com/IQF4V6x.gifv", "calls down an exterminatus on everyone with an Atmospheric Incinerator Torpedo"]
          ]

          var everyoneIndex = Math.floor(Math.random() * everyoneArray.length)
          var order = userId + " " + everyoneArray[everyoneIndex][1]
          var image = everyoneArray[everyoneIndex][0]
        } else {
          var wmdArray = [
              ["stabs", "https://i.imgur.com/dyEYSxz.gifv", "with a sword"],
              ["slaps", "https://i.imgur.com/7LxAw4v.gifv", "with a salmon cannon"],
              ["bombards", "https://i.imgur.com/pdGzHtM.gifv", "with a battleship"],
              ["destroys", "https://i.imgur.com/Hq2slHC.gifv", "with a tiger tank"],
              ["assassinates", "https://i.imgur.com/zL845S5.gifv", "with a sniper rifle"],
              ["strikes", "https://i.imgur.com/56SS9Ac.gifv", "with an AC-130 Gunship"],
              ["sinks", "https://i.imgur.com/ciJVtg4.gifv", "with a destroyer"],
              ["targets", "https://i.imgur.com/nVixnXj.gifv", "with an attack helicopter"],
              ["mows down", "https://i.imgur.com/UKcVfgS.gifv", "with a Huey"],
              ["kamikazes", "https://i.imgur.com/cJw5jc1.gifv", "with a Zero"],
              ["mows down", "https://i.imgur.com/9R6XCgM.gifv", "with a howitzer"],
              ["burns", "https://i.imgur.com/P6wbpeA.gifv", "to death with a flamethrower"],
              ["napalms", "https://i.imgur.com/4VFMRfd.gifv", "with an A-1 Skyraider"],
              ["swats", "https://i.imgur.com/CuwooEX.gifv", "with a prank call"],
              ["terminates", "https://i.imgur.com/Z9Ob0UF.gifv", "with a nuke"],
              ["obliterates", "https://i.imgur.com/yYOL3Zp.gifv", "with a Jericho missile"],
              ["blows up", "https://i.imgur.com/uWTJ6gD.gifv", "with a pistol"],
              ["shoots", "https://i.imgur.com/nGW5Gf9.gifv", "with a gun"],
              ["shoots", "https://i.imgur.com/RnLwIiM.gifv", "with a gun"],
              ["sinks", "https://i.imgur.com/dqE3yfn.gifv", "with a torpedo"],
              ["blinds","https://i.imgur.com/oQp2L8b.gifv", "with light"],
              ["headshots","https://i.imgur.com/nRnPiyC.gifv", "with a sniper rifle"],
              ["blows up", "https://i.imgur.com/WFUVRR4.gifv", "with wildfire"],
              ["incinerates", "https://i.imgur.com/32R8Fyh.gifv", "with a dragon"],
              ["stabs", "https://i.imgur.com/P6wpiHj.gifv", "with a knife"],
              ["stabs", "https://i.imgur.com/2Pj1HYJ.gifv", "'s throat with a bayonet"],
              ["slits", "https://i.imgur.com/OrIE00a.gifv", "'s throat with a dagger"],
              ["breaks", "https://i.imgur.com/H0hlsPU.gifv", "'s skull with his/her bare hands"],
              ["rips out", "https://i.imgur.com/rwTBaxE.gifv", "'s throat with his/her bare hands"],
              ["melts", "https://i.imgur.com/EForv49.gifv", "with a golden crown"],
              ["beheads", "https://i.imgur.com/OH1T4OC.gifv", "with a sword"],
              ["slays", "https://i.imgur.com/TWigRBq.gifv", "with Valyrian Steel"],
              ["cuts", "https://i.imgur.com/9pDMPJV.gifv", "with a sword"],
              ["stabs", "https://i.imgur.com/ude5KAq.gifv", "with a fucking pencil"],
              ["stabs", "https://i.imgur.com/eNQkEyt.gifv", "with several knives"],
              ["blows up", "https://i.imgur.com/kgYlUzn.gifv", "with a wrench"],
              ["vaporizes", "https://i.imgur.com/3mzHY1J.gifv", "with a Beam Cannon"],
              ["embarasses", "https://i.imgur.com/NRCAl5z.gifv", "with a Bright Slap"],
              ["9/11s", "https://i.imgur.com/i04NTMX.gifv", "with a 767"],
              ["Pearl Harbors", "https://i.imgur.com/HQFYvhJ.gifv", "with a space cruiser"],
              ["DESTROYS", "https://i.imgur.com/HdjIdTJ.gifv", "with FACTS and LOGIC"]
          ]

          var backfireArray = [
              ["https://i.imgur.com/7VP0G70.gifv", userId + " tries to shoot " + args[i] + " but gets counter-sniped"],
              ["https://i.imgur.com/HHV6znr.gifv", userId + " tries to shoot " + args[i] + " but misses"],
              ["https://i.imgur.com/i1o3UYc.gifv", userId + " fires a torpedo at " + args[i] + " but fails to sink him"],
              ["https://i.imgur.com/6m8KcTX.gifv", userId + " flips his tank trying to kill " + args[i]],
              ["https://i.imgur.com/TiCEoGk.gifv", userId + " tries to kill " + args[i] + " with a throwing knife, but is reversed"]
          ]

          var backfirePercent = Math.random()

          // 90% chance of hitting, 10% chance of a backfire/miss
          if (backfirePercent <= 0.9) {
              var wmdIndex = Math.floor(Math.random() * wmdArray.length)
              var order = userId + " " + wmdArray[wmdIndex][0] + " " + args[i] + " " + wmdArray[wmdIndex][2]
              var image = wmdArray[wmdIndex][1]
          } else {
              var backfireIndex = Math.floor(Math.random() * backfireArray.length)
              var order = backfireArray[backfireIndex][1]
              var image = backfireArray[backfireIndex][0]
          }
        }

        if (targetIdentified) {
          message.channel.send(order)
          message.channel.send(image)
          targetIdentified = true
        }
    }

    if (!targetIdentified) {
      message.channel.send("No valid target identified, calling off the attack")
      message.channel.send("https://i.imgur.com/aFh4dvl.gifv")
    }
  }
}