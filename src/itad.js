const itad = require('itad-api-client-ts')

// Initialize ITAD Service
var itadApi = new itad.IsThereAnyDealApi(config.itadKey)
async () => {
  const shops = await itadApi.getShops()
}
