import { IIntegrationConnector } from "./IIntegrationConnector";

/**
 * Forgejo/Gitea connection handler.
 * 
 * Forgejo uses token-based authentication (Personal Access Token).
 * Unlike OAuth-based providers, the connection is established by
 * opening a configuration modal where users enter their host URL and token.
 */
export class ForgejoConnection implements IIntegrationConnector {
    async connect(
        hasConnection: boolean,
        routerConfig: any,
        routerPath?: string,
    ) {
        // Forgejo always uses the modal-based token flow
        // If there's an existing connection, go to configuration
        // If not, the calling component should open the token modal
        if (hasConnection) {
            routerConfig.push(
                routerPath || `${routerConfig.pathname}/forgejo/configuration`,
            );
        } else {
            // For new connections, the modal will be opened by the calling component
            // This is handled in the settings page's provider helpers
            routerConfig.push(
                routerPath || `${routerConfig.pathname}?connect=forgejo`,
            );
        }
    }
}
