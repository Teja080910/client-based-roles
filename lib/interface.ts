export interface ClientType {
    readonly id: string,
    clientId: String,
    name: String,
    enabled: boolean,
    description: String,
    protocol: String,
    publicClient: boolean,
    serviceAccountsEnabled: boolean,
}