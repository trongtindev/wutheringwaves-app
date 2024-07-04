<template>
  <v-card>
    <v-card-title>
      {{ $t('convene.rank.title') }}
    </v-card-title>
    <v-divider />

    <v-card-text>
      <!-- Total pulls -->
      <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2">
        <v-list-item>
          <v-list-item-title>
            {{ $t('convene.rank.totalPull') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ $t('convene.rank.more', { percentage: 0 }) }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center">
              <div class="mr-2">
                {{ $t('convene.rank.top') }}
              </div>
              <div class="text-h6 font-weight-bold">0%</div>
            </div>
          </template>
        </v-list-item>
      </v-sheet>

      <!-- Luckiness Win Rate -->
      <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2 mt-4">
        <v-list-item>
          <v-list-item-title>
            {{ $t('convene.rank.luckWinRateOff') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ $t('convene.rank.moreLuck', { percentage: 0 }) }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center">
              <div class="mr-2">
                {{ $t('convene.rank.top') }}
              </div>
              <div class="text-h6 font-weight-bold">0%</div>
            </div>
          </template>
        </v-list-item>
      </v-sheet>

      <!-- Luckiness 5★ -->
      <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2 mt-4">
        <v-list-item>
          <v-list-item-title>
            {{ $t('convene.rank.luck5') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ $t('convene.rank.moreLuck', { percentage: 0 }) }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center text-legendary">
              <div class="mr-2">
                {{ $t('Top') }}
              </div>
              <div class="text-h6 font-weight-bold">0%</div>
            </div>
          </template>
        </v-list-item>
      </v-sheet>

      <!-- Luckiness 4★ -->
      <v-sheet class="bg-blue-grey-darken-3 rounded pt-2 pb-2 mt-4">
        <v-list-item>
          <v-list-item-title>
            {{ $t('convene.rank.luck4') }}
          </v-list-item-title>

          <v-list-item-subtitle>
            {{ $t('convene.rank.lessLuck', { percentage: 0 }) }}
          </v-list-item-subtitle>

          <template #append>
            <div class="d-flex align-center text-rare">
              <div class="mr-2">
                {{ $t('convene.rank.top') }}
              </div>
              <div class="text-h6 font-weight-bold">0%</div>
            </div>
          </template>
        </v-list-item>
      </v-sheet>
    </v-card-text>
    <v-divider />

    <v-card-actions class="d-flex align-center justify-center">
      <div class="d-flex align-center flex-column">
        <v-btn-toggle variant="outlined" divided>
          <v-btn :text="$t('Resonator')" />
          <v-btn :text="$t('Weapon')" />
          <v-btn :text="$t('Standard')" />
        </v-btn-toggle>
      </div>
    </v-card-actions>
  </v-card>
</template>
