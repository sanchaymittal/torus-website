<template>
  <v-layout>
    <v-flex xs12 text-center>
      <v-dialog :value="loginDialog && showModal" max-width="375" persistent>
        <v-card class="login-dialog-container">
          <v-layout wrap>
            <v-flex text-center class="login-header" xs12 pt-8 pb-6 px-6>
              <img
                class="home-link mr-1"
                alt="Torus Logo"
                :height="whiteLabelGlobal.isWhiteLabelActive && whiteLabelGlobal.logo ? '50' : '30'"
                :src="
                  whiteLabelGlobal.isWhiteLabelActive && whiteLabelGlobal.logo
                    ? whiteLabelGlobal.logo
                    : require(`../../../../public/images/torus-logo-${$vuetify.theme.dark ? 'white' : 'blue'}.svg`)
                "
              />
              <v-btn class="close-btn" icon @click="closeDialog">
                <v-icon>$vuetify.icons.close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout wrap pa-6>
            <v-flex xs12>
              <div class="verifier-title headline torus_text--text font-weight-bold">
                <span v-if="$vuetify.breakpoint.xsOnly">
                  {{ t('login.your') }}
                  <img :src="require(`../../../../public/images/login-verifiers.gif`)" />
                </span>
                <span v-else>
                  {{ t('login.your') }}
                  <span v-if="activeButton === GOOGLE">
                    <span class="verifier-title__google-blue">G</span>
                    <span class="verifier-title__google-red">o</span>
                    <span class="verifier-title__google-yellow">o</span>
                    <span class="verifier-title__google-blue">g</span>
                    <span class="verifier-title__google-green">l</span>
                    <span class="verifier-title__google-red">e</span>
                  </span>
                  <span v-else-if="activeButton === FACEBOOK" class="verifier-title__facebook">Facebook</span>
                  <span v-else-if="activeButton === REDDIT" class="verifier-title__reddit">Reddit</span>
                  <span v-else-if="activeButton === TWITCH" class="verifier-title__twitch">Twitch</span>
                  <span v-else-if="activeButton === DISCORD" class="verifier-title__discord">Discord</span>
                </span>
              </div>
              <div class="font-weight-bold verifier-subtitle torus_text--text">
                {{ t('login.digitalWallet') }}
              </div>
            </v-flex>
            <v-flex xs12 mt-7>
              <div class="body-1 torus_text--text">{{ t('login.signUpIn') }}</div>
            </v-flex>
            <v-flex xs12>
              <v-layout wrap mx-n1>
                <v-flex v-for="verifier in loginButtons" :key="verifier" xs4 px-1 mt-2>
                  <v-btn
                    block
                    class="login-btn"
                    :class="{ active: verifier === activeButton }"
                    type="button"
                    :title="`${t('login.loginWith')} ${verifier}`"
                    @mouseover="loginBtnHover(verifier)"
                    @click="startLogin(verifier)"
                  >
                    <img
                      v-if="verifier === activeButton || $vuetify.breakpoint.xsOnly"
                      :src="require(`../../../../public/img/icons/login-${verifier}.svg`)"
                    />
                    <v-icon v-else size="30" :class="$vuetify.theme.dark ? 'white--text' : 'loginBtnGray--text'">
                      {{ `$vuetify.icons.${verifier}` }}
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex mt-8 mb-4>
              <span class="caption torus_text--text">
                {{ t('login.acceptTerms') }}
                <a
                  :href="
                    whiteLabelGlobal.isWhiteLabelActive && whiteLabelGlobal.tncLink
                      ? whiteLabelGlobal.tncLink
                      : 'https://docs.tor.us/legal/terms-and-conditions'
                  "
                  target="_blank"
                  :style="{ textDecoration: 'none' }"
                >
                  <span class="torusBrand1--text">{{ t('login.termsAndConditions') }}</span>
                </a>
              </span>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import log from 'loglevel'
import { mapActions, mapState } from 'vuex'

import { DISCORD, FACEBOOK, GOOGLE, REDDIT, TWITCH } from '../../../utils/enums'

export default {
  name: 'PopupLogin',
  props: {
    loginDialog: {
      type: Boolean,
      dafault: false,
    },
  },
  data() {
    return {
      GOOGLE,
      FACEBOOK,
      REDDIT,
      TWITCH,
      DISCORD,
      activeButton: GOOGLE,
      showModal: true,
    }
  },
  computed: {
    ...mapState({
      enabledVerifiers: (state) => state.embedState.enabledVerifiers,
    }),
    loginButtons() {
      return Object.keys(this.enabledVerifiers).filter((x) => this.enabledVerifiers[x])
    },
  },
  methods: {
    loginBtnHover(verifier) {
      if (!this.$vuetify.breakpoint.xsOnly) this.activeButton = verifier
    },
    async startLogin(verifier) {
      try {
        this.showModal = false
        await this.triggerLogin({ verifier, calledFromEmbed: true })
      } catch (error) {
        log.error(error)
        this.closeDialog()
      } finally {
        this.showModal = true
      }
    },
    closeDialog() {
      this.$emit('closeDialog')
    },
    ...mapActions({
      triggerLogin: 'triggerLogin',
    }),
  },
}
</script>

<style lang="scss" scoped>
@import 'PopupLogin.scss';
</style>