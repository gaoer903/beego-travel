import { defineStore } from "pinia";
import { ref } from "vue";
import type { AssessmentResult } from "~/types";

interface AssessInput {
  text: string;
  travelers?: string[];
  season?: string;
  budget?: "low" | "medium" | "high";
}

export const useAssessStore = defineStore("assess", () => {
  const draft = ref<string>("");
  const currentInput = ref<AssessInput | null>(null);
  const currentResult = ref<AssessmentResult | null>(null);
  const loading = ref<boolean>(false);
  const history = ref<AssessmentResult[]>([]);

  function saveDraft(text: string) {
    draft.value = text;
  }

  function clearDraft() {
    draft.value = "";
  }

  async function createAssessment(input: AssessInput) {
    loading.value = true;
    currentInput.value = input;
    try {
      const data = await $fetch<AssessmentResult>("/api/assess/create", {
        method: "POST",
        body: input,
      });
      currentResult.value = data;
      history.value.unshift(data);
      return data;
    } finally {
      loading.value = false;
    }
  }

  return {
    draft,
    currentInput,
    currentResult,
    loading,
    history,
    saveDraft,
    clearDraft,
    createAssessment,
  };
});
