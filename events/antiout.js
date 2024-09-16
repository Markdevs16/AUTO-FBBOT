const fs = require('fs');
const path = require('path');

module.exports = {
    name: "antiout",
    version: "1.0.0",
    description: "Automatically re-add users who leave the group",
    author: "joshuaApostol",
    async onEvent({ api, event }) {
        const { logMessageType, logMessageData, threadID } = event;

        if (logMessageType === "log:unsubscribe") {
            const { removedParticipants } = logMessageData;
            
            const userIDs = removedParticipants.map(participant => participant.userFbId);
            
            try {
                for (const userID of userIDs) {
                    await api.addUserToGroup(userID, threadID);
                }
                
                const removedNames = removedParticipants.map(participant => participant.fullName).join(", ");
                const readdMessage = `
                    𝗔𝘂𝘁𝗼-𝗥𝗲-𝗔𝗱𝗱 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻
                    › ${removedNames} has been automatically re-added to the group.
                `;
                api.sendMessage(readdMessage, threadID);
            } catch (error) {
                console.error('Error re-adding users:', error);
                api.sendMessage('❌ Failed to re-add users. Please try again later.', threadID);
            }
        }
    },
};
