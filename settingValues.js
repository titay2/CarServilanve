angular.module('app')
    .value('settings', {
        // ADAL-B2C configuration
        adalB2C: {
            tenantName: 'funutest.onmicrosoft.com',
            clientId: '75c0ddab-96b0-48c8-8ccb-1c068a6c62bd',
            policy: 'B2C_1_policy'
        }
    });