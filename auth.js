
let isRegisterMode = false;

const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authButton = document.getElementById("authButton");
const toggleAuth = document.getElementById("toggleAuth");
const authMessage = document.getElementById("authMessage");

toggleAuth.addEventListener("click", () => {
  isRegisterMode = !isRegisterMode;

  authTitle.textContent = isRegisterMode
    ? "Buat akun baru"
    : "Masuk ke akun";

  authButton.textContent = isRegisterMode
    ? "Daftar"
    : "Masuk";

  toggleAuth.textContent = isRegisterMode
    ? "Sudah punya akun? Masuk"
    : "Belum punya akun? Daftar";

  authMessage.textContent = "";
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  authButton.disabled = true;
  authButton.textContent = "Memproses...";
  authMessage.textContent = "";

  try {
    if (isRegisterMode) {
      const { data, error } =
        await supabaseClient.auth.signUp({
          email,
          password
        });

      if (error) throw error;

      authMessage.textContent = data.session
        ? "Pendaftaran berhasil! Silakan masuk."
        : "Pendaftaran berhasil. Periksa email untuk konfirmasi.";
    } else {
      const { error } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

      if (error) throw error;

      window.location.href = "./index.html";
    }
  } catch (error) {
    authMessage.textContent = error.message;
  } finally {
    authButton.disabled = false;
    authButton.textContent = isRegisterMode
      ? "Daftar"
      : "Masuk";
  }
});
