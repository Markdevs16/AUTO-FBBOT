const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "upload",
    description: "Upload and save commands from a Pastebin URL",
    version: "1.0.0",
    cooldowns: 5,
    async execute(api, event, args) {
        const { threadID, messageID } = event;
        const pastebinUrl = args[0];

        if (!pastebinUrl) {
            return api.sendMessage("Please provide a valid Pastebin URL.", threadID, messageID);
        }

        try {
            // Fetch the content from Pastebin
            const response = await axios.get(pastebinUrl);
            const fileContent = response.data;

            // Derive filename from URL, using a fixed name or timestamp could be another approach
            const fileName = pastebinUrl.split('/').pop() + '.js'; // Ensuring file name ends with .js
            const filePath = path.join(__dirname, '../commands', fileName);

            // Save the content to the file
            fs.writeFile(filePath, fileContent, (err) => {
                if (err) {
                    console.error(err);
                    return api.sendMessage("Failed to save the file. Please try again.", threadID, messageID);
                }

                api.sendMessage(
                    `Command uploaded successfully!\n\nFile saved as: ${fileName}`,
                    threadID,
                    messageID
                );
            });
        } catch (error) {
            console.error(error);
            api.sendMessage("Failed to fetch or save the file. Please try again later.", threadID, messageID);
        }
    },
};
