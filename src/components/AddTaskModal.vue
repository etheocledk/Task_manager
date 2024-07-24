<template>
    <div class="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
        <div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><i
                    class="bx bx-plus me-1"></i> Ajouter une tâche</button>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="z-index: 1050;">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Ajouter une nouvelle tâche</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="save">
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="title" class="form-label">Titre<strong class="text-danger">*</strong></label>
                            <input type="text" class="form-control" v-model="task.title" id="title" max="30"
                                placeholder="Entrez le titre de votre tâche">
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description<strong
                                    class="text-danger">*</strong></label>
                            <input type="text" class="form-control" id="description" v-model="task.description"
                                placeholder="Entrez la descrition de votre tâche">
                        </div>
                        <div class="mb-3">
                            <label for="prioritySelect" class="form-label">Priorité<strong
                                    class="text-danger">*</strong></label>
                            <select id="prioritySelect" class="form-select" v-model="task.priority">
                                <option selected disabled>Sélectionnez la priorité...</option>
                                <option value="high">Haute</option>
                                <option value="medium">Moyenne</option>
                                <option value="low">Basse</option>
                            </select>
                        </div>
                    </div>

                    <div class="d-flex justify-content-end w-100 pe-4">
                        <strong class="text-danger">*</strong>
                        <p>: Champs obligatoires</p>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                        <button type="submit" class="btn btn-primary d-flex align-items-center gap-1"><span
                                v-if="isLoading">
                                <div class="spinner-border spinner-border-sm  text-light" role="status">
                                    <span class="visually-hidden"></span>
                                </div>
                            </span>Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useTasks } from "../composables/tasks";
import { useSwal } from "../composables/swal";
import { ref } from "vue";

const emits = defineEmits("newTask");
const { addTask } = useTasks();
const isLoading = ref(false);

const task = ref({
    title: "",
    description: "",
    priority: ""
});

//fonction d'enregistrement d'une tâche
async function save() {
    if (!task.value.title || !task.value.description || !task.value.priority) {
        useSwal(
            "Erreur",
            "Veuillez remplir tous les champs.",
            "error"
        ).temporary();
    } else {
        isLoading.value = true;
        const response = await addTask(task);
        if (response) {
            isLoading.value = false;
            const closeButton = document.querySelector('.btn-close');
            if (closeButton) {
                closeButton.click();
            }
            emitnewTask(response);
            task.value.title = '';
            task.value.description = '';
            task.value.priority = '';
        }
    }
}

const emitnewTask = (task) => {
  emits("newTask", task);
};
</script>
<style scoped>
.modal-backdrop.show {
    z-index: 1040;
}

.modal-content {
    z-index: 1050;
}
</style>