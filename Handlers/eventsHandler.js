const fs = require("fs");
const Ascii = require("ascii-table");

module.exports = (client) => {
  const table = new Ascii("Discord Events");
  table.setHeading("Event", "Status");

  let eventArray = [];

  fs.readdirSync("./Events").forEach((dir) => {
    const events = fs.readdirSync(`./Events/${dir}`).filter((file) => file.endsWith(".js"));
    for (const file of events) {
      const event = require(`../Events/${dir}/${file}`);
      const eventN = file.split(".")[0];
      eventArray.push(eventN);
      client.on(eventN, event.bind(null, client));
    }
  });

  for (let i = 0; i < eventArray.length; i++) {
    try {
      table.addRow(eventArray[i], "✅");
    } catch (e) {
      console.error(e);
    }
  }

  console.log(table.toString());
  console.log("Discord Events successfully loaded");
}