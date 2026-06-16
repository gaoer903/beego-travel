import { defineStore, skipHydrate } from "pinia";
import { ref } from "vue";
import type { CityRecord } from "~/types";

export const useCitiesStore = defineStore(
  "cities",
  () => {
    const citiesList = ref<CityRecord[]>([]);

    const updateCitiesList = (originCityData: CityRecord[]) => {
      citiesList.value = originCityData;
    };

    return {
      citiesList: skipHydrate(citiesList),
      updateCitiesList,
    };
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);
