import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import * as createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { defineConfig } from 'cypress';

async function setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions): Promise<Cypress.PluginConfigOptions> {
    // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
    await addCucumberPreprocessorPlugin(on, config);
    on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)],
    }));

    // Make sure to return the config object as it might have been modified by the plugin.
    return config;
}

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:9999',
        env: {
            NG_API_MOCK_BASE_URL: 'http://localhost:9999',
            NG_API_MOCK_ENABLE_LOGS: 'false'
        },
        specPattern: "test/features/*.feature",
        supportFile: 'test/support.ts',
        setupNodeEvents,
        video: false
    },
});
