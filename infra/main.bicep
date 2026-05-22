param environmentName string = 'production'
param location string = resourceGroup().location

var resourceToken = uniqueString(resourceGroup().id)
var appName = 'lahojaverde-${environmentName}'

resource storage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'st${resourceToken}'
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    supportsHttpsTrafficOnly: true
  }
}

resource functionApp 'Microsoft.Web/sites@2022-09-01' = {
  name: 'func-${appName}'
  kind: 'functionapp'
  location: location
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      appSettings: [
        { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' }
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' }
        { name: 'AzureWebJobsStorage', value: 'DefaultEndpointsProtocol=https;AccountName=${storage.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(storage.id, '2023-01-01').keys[0].value}' }
        { name: 'DEEPSEEK_API_KEY', value: '@Microsoft.KeyVault(SecretUri=${keyVault.properties.vaultUri}secrets/DEEPSEEK-API-KEY/)' }
        { name: 'SCM_DO_BUILD_DURING_DEPLOYMENT', value: 'true' }
        { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~18' }
      ]
      cors: {
        allowedOrigins: [
          'https://${staticWebApp.properties.defaultHostname}'
        ]
      }
    }
  }
}

resource hostingPlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: 'asp-${appName}'
  location: location
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
    size: 'Y1'
    family: 'Y'
    capacity: 0
  }
}

resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: 'swa-${appName}'
  location: location
  properties: {
    repositoryUrl: ''
    branch: 'main'
    buildProperties: {
      appLocation: 'frontend'
      apiLocation: 'backend'
      outputLocation: 'frontend/dist'
    }
  }
  sku: {
    name: 'Free'
    tier: 'Free'
    size: 'Free'
    family: 'Free'
    capacity: 0
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: 'kv-${resourceToken}'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: []
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
  }
}

output frontendUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output apiUrl string = 'https://${functionApp.properties.defaultHostName}/api'
