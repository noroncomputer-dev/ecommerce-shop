import Swal from "sweetalert2";

export const showSuccess = async (message: string) => {
  return await Swal.fire({
    icon: "success",
    title: "موفقیت",
    text: message,
    confirmButtonText: "باشه",
    confirmButtonColor: "#3b82f6",
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showError = async (message: string) => {
  return await Swal.fire({
    icon: "error",
    title: "خطا",
    text: message,
    confirmButtonText: "متوجه شدم",
    confirmButtonColor: "#ef4444",
  });
};

export const showWarning = async (message: string) => {
  return await Swal.fire({
    icon: "warning",
    title: "هشدار",
    text: message,
    confirmButtonText: "متوجه شدم",
    confirmButtonColor: "#f59e0b",
  });
};

export const showLogoutConfirm = async () => {
  const result = await Swal.fire({
    title: "خروج از حساب",
    text: "آیا مطمئن هستید که می‌خواهید خارج شوید؟",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "بله، خارج شو",
    cancelButtonText: "لغو",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
  });
  return result.isConfirmed;
};

export const showLoginSuccess = async (name: string) => {
  return await Swal.fire({
    icon: "success",
    title: "خوش آمدید!",
    html: `<div class="text-center">
      <span class="text-2xl">👋</span>
      <p class="text-xl font-bold mt-2">${name} عزیز</p>
      <p class="text-sm text-gray-600 mt-1">به فروشگاه ما خوش اومدی</p>
    </div>`,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#f9fafb",
  });
};
