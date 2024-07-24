<template>
    <div>
        <button type="button" @click="openModal">
        </button>

        <div class="modal fade" ref="assignModal" tabindex="-1" aria-labelledby="assignModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="assignModalLabel">Assigner la tâche</h1>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="assign">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email address</label>
                                <input type="email" class="form-control" id="email" v-model="email" required>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
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
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Modal } from 'bootstrap';
import { useTasks } from "@/composables/tasks";
import { useSwal } from "@/composables/swal";
const { assignTask } = useTasks();
const props = defineProps(["mode", "taskChooseId"]);

const email = ref('');
const isLoading = ref(false);
const assignModal = ref(null);


watch(() => props.mode == true, async () => {
    openModal()
});

const openModal = () => {
    const modalInstance = new Modal(assignModal.value);
    modalInstance.show();
};

const closeModal = () => {
    const modalInstance = Modal.getInstance(assignModal.value);
    modalInstance.hide();
};

const assign = async () => {
    if (!email) {
        useSwal(
            "Erreur",
            "Veuillez remplir tous les champs.",
            "error"
        ).temporary();
    } else {
        isLoading.value = true;
        const response = await assignTask(props.taskChooseId, email.value);
        if (response) {
            isLoading.value = false;
            closeModal();
            email.value = '';
        }
    }
};
</script>
