import themes from '../plugins/themes'
import vuetify from '../plugins/vuetify'
import { THEME_DARK_BLACK_NAME, THEME_LIGHT_BLUE_NAME } from '../utils/enums'
import { storageAvailable } from '../utils/utils'

export default {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setWallet(state, wallet) {
    state.wallet = wallet
  },
  setWeiBalance(state, weiBalance) {
    state.weiBalance = { ...state.weiBalance, ...weiBalance }
    state.weiBalanceLoaded = true
  },
  setTokenDataLoaded(state) {
    state.tokenDataLoaded = true
  },
  setTokenData(state, tokenData) {
    state.tokenData = { ...state.tokenData, ...tokenData }
  },
  setTokenRates(state, tokenRates) {
    state.tokenRates = tokenRates
  },
  setSelectedAddress(state, selectedAddress) {
    state.selectedAddress = selectedAddress
  },
  setNetworkId(state, networkId) {
    state.networkId = networkId
  },
  setNetworkType(state, networkType) {
    state.networkType = networkType
  },
  setTransactions(state, transactions) {
    state.transactions = transactions
  },
  setCurrencyData(state, data) {
    state.currencyData = { ...state.currencyData, [data.currentCurrency]: data.conversionRate }
  },
  setSelectedCurrency(state, currency) {
    state.selectedCurrency = currency
  },
  setTypedMessages(state, unapprovedTypedMessages) {
    state.unapprovedTypedMessages = unapprovedTypedMessages
  },
  setPersonalMessages(state, unapprovedPersonalMsgs) {
    state.unapprovedPersonalMsgs = unapprovedPersonalMsgs
  },
  setMessages(state, unapprovedMsgs) {
    state.unapprovedMsgs = unapprovedMsgs
  },
  setJwtToken(state, payload) {
    state.jwtToken = payload
  },
  setUserInfoAccess(state, payload) {
    state.userInfoAccess = payload
  },
  setNewUser(state, payload) {
    state.isNewUser = payload
  },
  setPastTransactions(state, payload) {
    state.pastTransactions = payload
    state.loadingUserTransactions = false
  },
  patchPastTransactions(state, payload) {
    state.pastTransactions = [...state.pastTransactions, payload]
  },
  setTheme(state, payload) {
    state.theme = payload
    // Update vuetify theme
    localThemeSet(payload, state)
  },
  setLocale(state, payload) {
    state.locale = payload
    vuetify.framework.lang.current = payload
  },
  setAssets(state, payload) {
    state.assets = { ...state.assets, ...payload }
  },
  setBillboard(state, payload) {
    state.billboard = payload
  },
  setContacts(state, payload) {
    state.contacts = payload
  },
  logOut(state, payload) {
    Object.keys(state).forEach((key) => {
      state[key] = payload[key] // or = initialState[key]
    })
  },
  setPermissions(state, payload) {
    state.permissions = payload
  },
  setPaymentTx(state, payload) {
    state.paymentTx = payload
  },
  setErrorMsg(state, payload) {
    state.errorMsg = payload
  },
  setSuccessMsg(state, payload) {
    state.successMsg = payload
  },
  setMetaData(state, payload) {
    const keys = Object.keys(payload)
    const key = keys[keys.length - 1] || ''
    const value = payload[key] || { name: '', icon: '' }
    state.iframeMetadata = {
      origin: key,
      ...value,
    }
  },
  setWhiteLabel(state, payload) {
    state.whiteLabel = {
      ...state.whiteLabel,
      isActive: true,
      ...payload,
    }
    localThemeSet(undefined, state)
    if (storageAvailable('sessionStorage') && payload) sessionStorage.setItem('torus-white-label', JSON.stringify(payload))
  },
}
function localThemeSet(payload, state) {
  let theme = themes[payload || THEME_LIGHT_BLUE_NAME]
  if (state.whiteLabel.isActive) {
    const { theme: whiteLabelTheme } = state.whiteLabel
    theme = themes[whiteLabelTheme.isDark ? THEME_DARK_BLACK_NAME : THEME_LIGHT_BLUE_NAME]
    if (whiteLabelTheme.colors) {
      theme.theme = { ...theme.theme, ...whiteLabelTheme.colors }
    }
  }
  vuetify.framework.theme.dark = theme.isDark
  vuetify.framework.theme.themes[theme.isDark ? 'dark' : 'light'] = theme.theme
  if (storageAvailable('localStorage') && payload) localStorage.setItem('torus-theme', payload)
}
