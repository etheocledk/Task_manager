import { supabase } from "../utils/supabase"
import { useSwal } from "../composables/swal";
import emailjs from 'emailjs-com';

export const useTasks = () => {

    const addTask = async (data) => {
        const { data: insertedTask, error: insertError } = await supabase
            .from('tasks')
            .insert([{
                title: data.value.title,
                description: data.value.description,
                priority: data.value.priority
            }])
            .select('*');

        if (insertError) {
            console.error("Erreur lors de l'ajout de la tâche :", insertError.message);
            useSwal("Erreur", `${insertError.message}`, "error").temporary();
            return false;
        }

        useSwal("Succès", `La tâche a été ajoutée avec succès.`, "success").temporary();
        return insertedTask;
    };


    const getTasks = async () => {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Erreur lors de la récupération des tâches :", error.message);
            return [];
        }

        return tasks || [];
    };



    const deleteTask = async (taskId) => {
        const { data: existingTask, error: fetchError } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId);

        if (fetchError || !existingTask || existingTask.length === 0) {
            useSwal("Erreur", `La tâche que vous voulez supprimer n'existe pas.`, "error").temporary();
            return null;
        }

        const { error: deleteError } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (deleteError) {
            console.error("Erreur lors de la suppression de la tâche :", deleteError.message);
            return null;
        }

        useSwal("Succès", `La tâche a été supprimée avec succès.`, "success").temporary();
        return true;
    };


    const getSingleTask = async (id) => {
        const { data: task, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', id);

        if (error) {
            console.error("Erreur lors de la récupération de la tâche :", error.message);
            return null;
        }

        return task;
    };


    const updateTask = async (id, data) => {
        const { data: updatedTask, error: updateError } = await supabase
            .from('tasks')
            .update({
                title: data.value.title,
                description: data.value.description,
                priority: data.value.priority,
                status: data.value.status,
                updated_at: new Date()
            })
            .eq('id', id)
            .select('*');

        if (updateError) {
            console.error("Erreur lors de la mise à jour de la tâche :", updateError.message);
            useSwal("Erreur", `${updateError.message}`, "error").temporary();
            return null;
        }

        useSwal("Succès", `La tâche a été mise à jour avec succès.`, "success").temporary();
        return updatedTask;
    };


    const assignTask = async (taskId, email) => {
        const { data: updatedTask, error: updateError } = await supabase
            .from('tasks')
            .update({
                assigned_to: email,
                updated_at: new Date()
            })
            .eq('id', taskId)
            .select('*');

        if (updateError) {
            console.error("Erreur lors de l'assignation de la tâche :", updateError.message);
            useSwal("Erreur", `${updateError.message}`, "error").temporary();
            return null;
        }

        try {
            const message = `
                  Bonjour,
                  Une nouvelle tâche vous a été assignée. Voici les détails :
                  Titre : ${updatedTask[0].title}
                  Description : ${updatedTask[0].description}
                  Priorité : ${updatedTask[0].priority}
                  Statut : ${updatedTask[0].status}
                  Assignée par : Administrateur
                `;
            const response = await emailjs.send('service_qtk8agz', 'template_lce8uim', {
                email: 'Recipient Name',
                from_name: 'Your Name',
                to_email: email,
                message: message,
                reply_to: 'your-email@example.com'
            }, '-iI2FlNPB-PC7nx7I');

            useSwal("Succès", `La tâche a été assignée et l'email a été envoyé avec succès.`, "success").temporary();
        } catch (emailError) {
            console.error("Erreur lors de l'envoi de l'email :", emailError.message);
            useSwal("Erreur", `La tâche a été assignée mais l'email n'a pas pu être envoyé.`, "error");
        }

        return updatedTask;
    };

    return {
        addTask,
        getTasks,
        deleteTask,
        getSingleTask,
        updateTask,
        assignTask
    }
}