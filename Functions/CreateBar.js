module.exports = {
  createBar: function(queue) {
    try {
      let length = 15;
      let index = Math.round(
        (queue.currentTime / queue.songs[0].duration) * length
      );
      let indicator = "🔵";
      let line = "▬";
      if (index >= 1 && index <= length) {
        let bar = line.repeat(length - 1).split("");
        bar.splice(index, 0, indicator);
        let timestamp = queue.formattedCurrentTime;
        return `\`${timestamp}\` | ${bar.join("")} | \`${
          queue.songs[0].formattedDuration || "`Live`"
          }\``;
        // return `${bar.join("")}`;
      } else {
        return `${indicator}${line.repeat(length - 1)}`;
      }
    } catch (e) {
      console.log(`[CREATE_BAR]: ${e}`);
    }
  }
}