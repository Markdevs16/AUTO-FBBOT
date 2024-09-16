const axios = require('axios');
const querystring = require('querystring');

module.exports = {
    name: 'pastebin',
    description: 'Upload code to Pastebin',
    version: '1.0.0',
    async execute(api, event, args) {
        const { threadID, messageID, senderID } = event;
        const code = args.join(' ');
        const apiKey = 'MfYbjq5sw2xHeEHxTfpCnrqGwsgd0mU_';
        const pasteName = 'bilat.php';
        const pastePrivate = '1';
        const pasteExpireDate = '10M';
        const pasteFormat = 'php';

        if (!code) {
            return api.sendMessage('Please provide the code you want to upload.', threadID, messageID);
        }

        const postData = querystring.stringify({
            api_option: 'paste',
            api_user_key: '',
            api_paste_private: pastePrivate,
            api_paste_name: pasteName,
            api_paste_expire_date: pasteExpireDate,
            api_paste_format: pasteFormat,
            api_dev_key: apiKey,
            api_paste_code: code
        });

        try {
            const response = await axios.post('https://pastebin.com/api/api_post.php', postData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const pastebinUrl = response.data;
            return api.sendMessage(`Upload succesfully: \n\n${pastebinUrl}`, threadID, messageID);
        } catch (error) {
            console.error('Error uploading to Pastebin:', error.message);
            return api.sendMessage('Failed to upload the code. Please try again later.', threadID, messageID);
        }
    }
};
