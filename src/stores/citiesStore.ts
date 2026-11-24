import { defineStore, skipHydrate } from "pinia";
import { ref } from "vue";
import type { CityRecord, RiskCitiesResponse } from "~/types";

export const useCitiesStore = defineStore(
  "cities",
  () => {
    const citiesList = ref<CityRecord[]>([]);

    const updateCitiesList = async () => {
      if (citiesList.value.length > 0) return citiesList.value;
      const response = await $fetch<RiskCitiesResponse>("/api/home/risk-cities");
      citiesList.value = response.data;
      return citiesList.value;
    };

    return {
      citiesList: skipHydrate(citiesList),
      updateCitiesList,
    };
  },
  {
    persist: process.client
      ? {
          storage: localStorage,
        }
      : false,
  }
);
