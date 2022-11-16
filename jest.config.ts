export default {
    clearMocks: true,
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: [
            'node',
            'node-addons'
        ]
    },
};
