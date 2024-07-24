<template>
    <div>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" :class="{ show: showOffcanvas }"
            aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
                <h5 id="offcanvasRightLabel">Détails</h5>
                <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
            </div>
            <div class="offcanvas-body">
                <div class="mb-3">
                    <label for="taskTitle" class="form-label">Titre :</label>
                    <input id="taskTitle" type="text" class="form-control" :value="task.title" disabled />
                </div>
                <div class="mb-3">
                    <label for="taskDescription" class="form-label">Description :</label>
                    <textarea id="taskDescription" class="form-control" :value="task.description" rows="3"
                        disabled></textarea>
                </div>
                <div class="mb-3">
                    <label for="taskPriority" class="form-label">Priorité :</label>
                    <input id="taskPriority" type="text" class="form-control" :value="formatPriority(task.priority)"
                        disabled />
                </div>
                <div class="mb-3">
                    <label for="taskStatus" class="form-label">Status :</label>
                    <input id="taskStatus" type="text" class="form-control" :value="task.status || 'undefined'"
                        disabled />
                </div>
                <div class="mb-3">
                    <label for="taskCollaborator" class="form-label">Collaborateur :</label>
                    <input id="taskCollaborator" type="text" class="form-control" :value="task.collaborator || 'N/A'"
                        disabled />
                </div>
                <div class="mb-3">
                    <label for="taskDate" class="form-label">Date de création :</label>
                    <input id="taskDate" type="text" class="form-control" :value="formatDate(task.created_at)"
                        disabled />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineEmits, ref, watch } from "vue";
import { useTasks } from "../composables/tasks";
import moment from 'moment';
const props = defineProps(["showOffcanvas", "taskChooseId"]);
const emits = defineEmits(["showOffcanvas"]);
const { getSingleTask } = useTasks();

const emitModeEvent = () => {
    emits("showOffcanvas", false);
};

const closeModal = () => {
    emitModeEvent();
};

const task = ref([]);

const formatPriority = (priority) => {
    switch (priority) {
        case 'high':
            return 'Élevé';
        case 'medium':
            return 'Moyen';
        case 'low':
            return 'Bas';
        default:
            return 'Non défini';
    }
};

const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY HH:mm:ss');
};

watch(() => props.taskChooseId, async (id) => {
  if (id) {
    const response = await getSingleTask(id);
    task.value = response[0];
  }
});
</script>

<style scoped>
.offcanvas-full {
    width: 100%;
    height: 100%;
    margin: 0;
}

.offcanvas-body {
    padding: 1rem;
}

</style>