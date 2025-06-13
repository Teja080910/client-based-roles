export interface Realm {
  id: string;
  name: string;
  displayName?: string;
  enabled: boolean;
  sslRequired: 'external' | 'none' | 'all';
  registrationAllowed: boolean;
  loginWithEmailAllowed: boolean;
  duplicateEmailsAllowed: boolean;
  resetPasswordAllowed: boolean;
  editUsernameAllowed: boolean;
  bruteForceProtected: boolean;
  permanentLockout: boolean;
  maxFailureWaitSeconds: number;
  minimumQuickLoginWaitSeconds: number;
  waitIncrementSeconds: number;
  quickLoginCheckMilliSeconds: number;
  maxDeltaTimeSeconds: number;
  failureFactor: number;
  defaultRoles: string[];
  requiredCredentials: string[];
  passwordPolicy?: string;
  otpPolicyType?: string;
  otpPolicyAlgorithm?: string;
  otpPolicyInitialCounter?: number;
  otpPolicyDigits?: number;
  otpPolicyLookAheadWindow?: number;
  otpPolicyPeriod?: number;
  browserSecurityHeaders?: Record<string, string>;
  smtpServer?: Record<string, string>;
  eventsEnabled?: boolean;
  eventsListeners?: string[];
  enabledEventTypes?: string[];
  adminEventsEnabled?: boolean;
  adminEventsDetailsEnabled?: boolean;
  attributes?: Record<string, string>;
}

export interface Client {
  id: string;
  clientId: string;
  name?: string;
  realm: string;
  description?: string;
  enabled: boolean;
  alwaysDisplayInConsole: boolean;
  clientAuthenticatorType: string;
  secret?: string;
  registrationAccessToken?: string;
  defaultRoles?: string[];
  redirectUris: string[];
  webOrigins: string[];
  notBefore: number;
  bearerOnly: boolean;
  consentRequired: boolean;
  standardFlowEnabled: boolean;
  implicitFlowEnabled: boolean;
  directAccessGrantsEnabled: boolean;
  serviceAccountsEnabled: boolean;
  publicClient: boolean;
  frontchannelLogout: boolean;
  protocol: string;
  attributes?: Record<string, string>;
  authenticationFlowBindingOverrides?: Record<string, string>;
  fullScopeAllowed: boolean;
  nodeReRegistrationTimeout: number;
  defaultClientScopes?: string[];
  optionalClientScopes?: string[];
  access?: Record<string, boolean>;
}

export interface Resource {
  id: string;
  name: string;
  displayName?: string;
  type?: string;
  uri?: string;
  icon_uri?: string;
  owner?: string;
  ownerManagedAccess: boolean;
  scopes: Scope[];
  attributes?: Record<string, string[]>;
}

export interface Scope {
  id: string;
  name: string;
  displayName?: string;
  iconUri?: string;
  policies?: Policy[];
  resources?: Resource[];
}

export interface Policy {
  id: string;
  name: string;
  description?: string;
  type: 'role' | 'user' | 'client' | 'time' | 'aggregate' | 'group' | 'js' | 'regex';
  logic: 'POSITIVE' | 'NEGATIVE';
  decisionStrategy: 'UNANIMOUS' | 'AFFIRMATIVE' | 'CONSENSUS';
  config?: Record<string, string>;
  policies?: string[];
  resources?: string[];
  scopes?: string[];
  roles?: string[];
  users?: string[];
  clients?: string[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  type: 'resource' | 'scope';
  logic: 'POSITIVE' | 'NEGATIVE';
  decisionStrategy: 'UNANIMOUS' | 'AFFIRMATIVE' | 'CONSENSUS';
  resources?: string[];
  scopes?: string[];
  policies?: string[];
  resourceType?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  composite: boolean;
  clientRole: boolean;
  containerId: string;
  attributes?: Record<string, string[]>;
  composites?: {
    realm?: string[];
    client?: Record<string, string[]>;
  };
}

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  emailVerified: boolean;
  createdTimestamp?: number;
  attributes?: Record<string, string[]>;
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
}

export interface EvaluationRequest {
  userId: string;
  clientId: string;
  resources?: string[];
  scopes?: string[];
  context?: Record<string, any>;
}

export interface EvaluationResult {
  results: Array<{
    resource?: Resource;
    scopes?: Scope[];
    status: 'PERMIT' | 'DENY';
    policies: Array<{
      policy: Policy;
      status: 'PERMIT' | 'DENY';
    }>;
  }>;
}