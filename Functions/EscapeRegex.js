module.exports = {
  escapeRegex: function(str) {
    try {
      return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (error) {
      console.error(`[ESCAPE_REGEX]: ${error}`);
    }
  }
}