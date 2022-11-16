export default {
    clearMocks: true,
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        // why ? because test configuration is a mistery
        customExportConditions: [
            'node',
            'node-addons'
        ]
    },
};
