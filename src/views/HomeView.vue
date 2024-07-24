<template>
  <HeaderVue></HeaderVue>
  <div class="container">
    <div v-if="isLoading" class="d-flex justify-content-center align-items-center h-100">
      <div class="spinner-grow" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <div class="row align-items-center">
        <div class="col-md-6">
          <div class="mb-3">
            <h5 class="card-title">
              Liste des tâches
              <span class="text-muted fw-normal ms-2">({{ totalTasks }})</span>
            </h5>
          </div>
        </div>
        <div class="col-md-6">
          <AddTaskModal @newTask="handleNewTask"></AddTaskModal>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="">
            <div class="table-responsive">
              <table class="table project-list-table table-nowrap align-middle table-borderless">
                <thead>
                  <tr>
                    <th class="ps-4" scope="col">Date</th>
                    <th scope="col">Titre</th>
                    <th scope="col">Priorité</th>
                    <th scope="col">Statut</th>
                    <th scope="col" style="width: 200px;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in paginatedTasks" :key="item.id">
                    <td class="ps-4">{{ moment(item.created_at).format("DD/MM/YYYY HH:mm:ss") }}</td>
                    <td>{{ item.title }}</td>
                    <td>
                      <span :class="{
                        'badge': true,
                        'badge-soft-danger': item.priority === 'high',
                        'badge-soft-warning': item.priority === 'medium',
                        'badge-soft-success': item.priority === 'low'
                      }" class="mb-0">
                        {{ item.priority === 'high' ? 'Élevé' : item.priority === 'medium' ? 'Moyen' : 'Bas' }}
                      </span>
                    </td>
                    <td>{{ item.status || 'undefined' }}</td>
                    <td>
                      <ul class="list-inline mb-0">
                        <li class="list-inline-item">
                          <a href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Modifier"
                            @click="openUpdateModal(item.id)" class="px-2 text-primary"><i
                              class="bx bx-pencil font-size-18"></i></a>
                        </li>
                        <li class="list-inline-item">
                          <a href="#" data-bs-toggle="tooltip" data-bs-placement="top" @click="remove(item.id)"
                            title="Supprimer" class="px-2 text-danger"><i class="bx bx-trash-alt font-size-18"></i></a>
                        </li>
                        <li class="list-inline-item dropdown">
                          <a class="text-muted dropdown-toggle font-size-18 px-2" href="#" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false"><i
                              class="bx bx-dots-vertical-rounded"></i></a>
                          <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" @click="openDetailModal(item.id)">Détails</a></li>
                            <li><a class="dropdown-item" href="#">Assigner</a></li>
                          </ul>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-0 align-items-center pb-4">
        <div class="col-sm-6">
          <div>
            <p class="mb-sm-0">Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage *
              itemsPerPage, totalTasks) }} of {{ totalTasks }} entries</p>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="float-sm-end">
            <ul class="pagination mb-sm-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a href="#" @click.prevent="changePage(currentPage - 1)" class="page-link"><i
                    class="mdi mdi-chevron-left"></i></a>
              </li>
              <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                <a href="#" @click.prevent="changePage(page)" class="page-link">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a href="#" @click.prevent="changePage(currentPage + 1)" class="page-link"><i
                    class="mdi mdi-chevron-right"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <TaskDetail :showOffcanvas="showOffcanvas" :taskChooseId="taskChooseId" @showOffcanvas="getShowOffcanvasStatus">
    </TaskDetail>
    <UpdateTaskModal :mode="mode" :taskChooseId="taskChooseId" @newTask = "updateTaskRow"></UpdateTaskModal >

      <!-- const assignTask = async (taskId, email) -->

  </div>
</template>
<script setup>
import HeaderVue from "../components/Header.vue";
import AddTaskModal from "@/components/AddTaskModal.vue";
import TaskDetail from "@/components/TaskDetail.vue";
import UpdateTaskModal from "@/components/UpdateTaskModal.vue";
import { useTasks } from "../composables/tasks";
import { useSwal } from "../composables/swal";
import moment from "moment";
import { ref, onMounted, computed } from "vue";

const { getTasks, deleteTask } = useTasks();
const isLoading = ref(false);
const tasksList = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showOffcanvas = ref(false);
const taskChooseId = ref();
const mode = ref(false);

// Nombre total de tâches
const totalTasks = computed(() => tasksList.value.length);
const totalPages = computed(() => Math.ceil(totalTasks.value / itemsPerPage.value));

// Calculer les tâches paginées
const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return tasksList.value.slice(start, end);
});

onMounted(async () => {
  await getTasksList();
});

// Fonction de récupération de la liste des tâches
const getTasksList = async () => {
  isLoading.value = true;
  const tasks = await getTasks();
  if (tasks) {
    isLoading.value = false;
    tasksList.value = tasks;
  }
};

// Fonction de suppression d'une tâche
const remove = async (id) => {
  const result = await useSwal(
    "Suppression",
    "Voulez-vous vraiment supprimer cette tâche ?",
    "error"
  ).permanant();

  if (result.isConfirmed) {
    await deleteTask(id);
    const index = tasksList.value.findIndex(task => task.id === id);

    if (index !== -1) {
      tasksList.value.splice(index, 1);
    }
  }
}

// Fonction pour gérer l'ajout d'une nouvelle tâche
const handleNewTask = (value) => {
  tasksList.value.unshift(value[0]);
};

// Fonction pour changer de page
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

async function getShowOffcanvasStatus(value) {
  showOffcanvas.value = value;
}

async function openDetailModal(id) {
  showOffcanvas.value = true;
  taskChooseId.value = id;
}

async function openUpdateModal(id) {
  mode.value = true;
  taskChooseId.value = id;
}

async function updateTaskRow(value) {
  const updatedTask = value[0];
  const index = tasksList.value.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasksList.value.splice(index, 1);
  }
  tasksList.value.unshift(updatedTask);
}

</script>
