const fs = require("fs");
const Ascii = require("ascii-table");

module.exports = (client) => {
  const table = new Ascii("Commands");
  table.setHeading("Command", "Load status");
  
  let count = 0;

  fs.readdirSync("./Commands").forEach(dir => {
    const commands = fs.readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith(".js"));
    for (const file of commands) {
      const fileName = `../Commands/${dir}/${file}`;
      delete require.cache[require.resolve(fileName)];
      const pull = require(fileName);
      if (pull.name) {
        count++;
        client.commands.set(pull.name, pull);
        table.addRow(file, "✅");
      } else {
        table.addRow(file, `❌ -> missing help.name, or help.name is not a string.`);
        continue;
      }
      if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
    }
  });

  console.log(table.toString());
  console.log(`There are ${count} commands working`);
}