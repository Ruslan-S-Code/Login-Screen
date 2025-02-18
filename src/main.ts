window.addEventListener("DOMContentLoaded", () => {
  const overlayEl = document.getElementById("overlay");
  const loginUsername = document.getElementById(
    "login-username"
  ) as HTMLInputElement | null;
  const loginPassword = document.getElementById(
    "login-password"
  ) as HTMLInputElement | null;
  const submitLoginBtn = document.getElementById("submit-login-btn");
  const errorMsg = document.getElementById("error-msg");
  const welcomeText = document.getElementById("username-display");
  const logOutBtn = document.getElementById("logout-btn");
  const mainContentBtn = document.getElementById("secret-content-btn");

  // Храним имя/пароль для дальнейшего использования (secret-content)
  let currentUser: string | null = null;
  let currentPass: string | null = null;

  // Показываем оверлей логина
  overlayEl?.classList.remove("hidden");

  // --- Функции сброса подсветок ------------------------------------------------
  function resetUsername() {
    if (!loginUsername || !errorMsg) return;
    loginUsername.classList.remove("border-red-500", "text-red-500");
    loginUsername.classList.add("text-gray-200");
    if (errorMsg.textContent?.includes("user doesn't exist")) {
      errorMsg.classList.add("hidden");
    }
  }
  function resetPassword() {
    if (!loginPassword || !errorMsg) return;
    loginPassword.classList.remove("border-red-500", "text-red-500");
    loginPassword.classList.add("text-gray-200");
    if (errorMsg.textContent?.includes("password is wrong")) {
      errorMsg.classList.add("hidden");
    }
  }

  // Сброс при фокусе
  loginUsername?.addEventListener("focus", resetUsername);
  loginPassword?.addEventListener("focus", resetPassword);

  // --- Клик "SUBMIT": локальная проверка логина/пароля -------------------------
  submitLoginBtn?.addEventListener("click", async () => {
    if (!loginUsername || !loginPassword || !errorMsg || !overlayEl) return;

    const userVal = loginUsername.value.trim();
    const passVal = loginPassword.value.trim();

    // const response = await fetch(
    //   "https://stfnsr-supercode_login_screen_project.web.val.run/login",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name: userVal,
    //       secret: passVal,
    //     }),
    //   }
    // );
    // const user = await response.json();
    // console.log(user);

    // Сбрасываем старые ошибки
    errorMsg.classList.add("hidden");
    loginUsername.classList.remove("border-red-500", "text-red-500");
    loginPassword.classList.remove("border-red-500", "text-red-500");
    loginUsername.classList.add("text-gray-200");
    loginPassword.classList.add("text-gray-200");

    // Пример локальной проверки
    // Условимся, что валид: (admin / 123)
    // Или (user / password) — это можно поменять на любую вашу логику
    // (не путать с тем, что у вас будет на самом деле в API)
    if (userVal.toLowerCase() !== "admin") {
      errorMsg.textContent = "*user doesn't exist";
      errorMsg.classList.remove("hidden");
      loginUsername.classList.remove("text-gray-200");
      loginUsername.classList.add("text-red-500");
      return;
    }
    if (passVal !== "123") {
      errorMsg.textContent = "*password is wrong";
      errorMsg.classList.remove("hidden");
      loginPassword.classList.remove("text-gray-200");
      loginPassword.classList.add("text-red-500");
      return;
    }

    // Если дошли сюда — локальная проверка пройдена
    overlayEl.classList.add("hidden");
    if (welcomeText) {
      welcomeText.textContent = userVal;
    }

    // Сохраняем в переменные, чтобы использовать при клике на "secret content"
    currentUser = userVal;
    currentPass = passVal;
  });

  // --- Клик "SECRET CONTENT": здесь делаем запрос к API -----------------------
  mainContentBtn?.addEventListener("click", async () => {
    if (!currentUser || !currentPass) {
      alert("Сначала нужно залогиниться!");
      return;
    }

    try {
      const response = await fetch(
        "https://stfnsr-supercode_login_screen_project.web.val.run/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: currentUser,
            secret: currentPass,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Если сервер подтверждает логин => показываем секретный контент
        alert("Accessing the secret content... (API says success)");
      } else {
        // Если сервер говорит ошибка (неверные данные)
        alert("API says error: " + (data.message || "no success"));
      }
    } catch (err) {
      console.error("Ошибка при запросе SECRET:", err);
      alert("Server error or no response for secret content");
    }
  });

  // --- LOGOUT -----------------------------------------------------------------
  logOutBtn?.addEventListener("click", () => {
    // Перезагружаем страницу
    window.location.reload();
  });
});
