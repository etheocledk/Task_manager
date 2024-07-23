import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

export const useSwal = (
  title: string,
  text: string,
  icon: SweetAlertIcon = "error"
) => {
  return {
    permanant: () => {
      return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "Oui",
        confirmButtonColor: "#1C5EA3"
      });
    },
    temporary: () => {
     return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
        cancelButtonText:"Fermer"
      });
    },

    fire: (object: SweetAlertOptions) => {
      Swal.fire(object);
    },
  };
};
