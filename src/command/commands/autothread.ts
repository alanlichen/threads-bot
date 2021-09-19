export default {
    commandData: {name: 'autothread',
        description: 'Sets up autothread',
        options: [
            {
                name: 'channel',
                description: 'The channel to enable autothread for',
                type: 'CHANNEL',
                required: true,
            },
            {
                name: 'name',
                description:
                    'The name of the thread to be created when someone chats',
                type: 'STRING',
                required: true,
            },
        ],}
};
