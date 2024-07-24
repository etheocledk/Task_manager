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
            <h5 class="card-title">Liste des tâches <span
                class="text-muted fw-normal ms-2">({{ tasksList.length }})</span></h5>
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
                    <!-- <th scope="col">Description</th> -->
                    <th scope="col">Priorité</th>
                    <th scope="col">Statut</th>
                    <th scope="col" style="width: 200px;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, key) in tasksList" :key="key">
                    <td class="ps-4">{{ moment(item.created_at).format("DD/MM/YYYY HH:mm:ss") }}</td>
                    <td>{{ item.title }}</td>
                    <!-- <td>{{ item.description }}</td> -->
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
                    <td>{{ item.statut || 'undefined' }}</td>
                    <td>
                      <ul class="list-inline mb-0">
                        <li class="list-inline-item">
                          <a href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Modifier"
                            class="px-2 text-primary"><i class="bx bx-pencil font-size-18"></i></a>
                        </li>
                        <li class="list-inline-item">
                          <a href="#" data-bs-toggle="tooltip" data-bs-placement="top" @click="remove(item.id)"
                            title="Supprimer" class="px-2 text-danger"><i class="bx bx-trash-alt font-size-18"></i></a>
                        </li>
                        <li class="list-inline-item dropdown">
                          <a class="text-muted dropdown-toggle font-size-18 px-2" href="#" role="button"
                            data-bs-toggle="dropdown" aria-haspopup="true"><i
                              class="bx bx-dots-vertical-rounded"></i></a>
                          <!-- <div class="dropdown-menu dropdown-menu-end">
                          <a class="dropdown-item" href="#">Action</a><a class="dropdown-item" href="#">Another
                            action</a><a class="dropdown-item" href="#">Something else here</a>
                        </div> -->
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
            <p class="mb-sm-0">Showing 1 to 10 of 57 entries</p>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="float-sm-end">
            <ul class="pagination mb-sm-0">
              <li class="page-item disabled">
                <a href="#" class="page-link"><i class="mdi mdi-chevron-left"></i></a>
              </li>
              <li class="page-item active"><a href="#" class="page-link">1</a></li>
              <li class="page-item"><a href="#" class="page-link">2</a></li>
              <li class="page-item"><a href="#" class="page-link">3</a></li>
              <li class="page-item"><a href="#" class="page-link">4</a></li>
              <li class="page-item"><a href="#" class="page-link">5</a></li>
              <li class="page-item">
                <a href="#" class="page-link"><i class="mdi mdi-chevron-right"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>
<script setup>
import HeaderVue from "../components/Header.vue";
import AddTaskModal from "@/components/AddTaskModal.vue";
import { useTasks } from "../composables/tasks";
import { useSwal } from "../composables/swal";
import moment from "moment";
import { ref, onMounted } from "vue";
const { getTasks, deleteTask } = useTasks();
const isLoading = ref(false);

const tasksList = ref([]);

onMounted(async () => {
  await getTasksList();
});

//fonction de recupération de la liste de tâche
const getTasksList = async () => {
  isLoading.value = true;
  const tasks = await getTasks();
  if (tasks) {
    isLoading.value = false;
    tasksList.value = tasks;
  }
};

//fonction de suppression d'une tâche
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

const handleNewTask = (value) => {
  tasksList.value.unshift(value[0]);
};

</script>
