(() => {
  "use strict";
  const CORRECT_URL = "https://wkvkqdjtlazpcuxpbbqz.supabase.co";
  const KEY = "sb_publishable_L_tfxYAWnjIpNRG8gOsz4Q_lviqp4Fm";

  function showError(message) {
    const box = document.getElementById("staticAuthError");
    if (box) box.textContent = message || "";
  }

  function wireStaticLogin() {
    const form = document.getElementById("staticLoginForm");
    const test = document.getElementById("staticConnectionTest");
    if (!form || form.dataset.wired) return;
    form.dataset.wired = "1";

    test?.addEventListener("click", async () => {
      test.disabled = true;
      test.textContent = "Testing…";
      showError("");
      try {
        const r = await fetch(CORRECT_URL + "/auth/v1/settings", {
          headers: { apikey: KEY, Authorization: "Bearer " + KEY },
          cache: "no-store"
        });
        showError(r.ok ? "Supabase Auth is reachable." : "Supabase Auth returned HTTP " + r.status + ".");
      } catch (e) {
        showError("The browser cannot reach Supabase Auth right now.");
      } finally {
        test.disabled = false;
        test.textContent = "Test connection";
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!window.supabase?.createClient) {
        showError("The Supabase client library did not load. Refresh the page and try again.");
        return;
      }
      const button = form.querySelector(".primary");
      button.disabled = true;
      button.textContent = "Signing in…";
      showError("");
      try {
        const client = window.supabase.createClient(CORRECT_URL, KEY);
        const { error } = await client.auth.signInWithPassword({
          email: form.email.value.trim(),
          password: form.password.value
        });
        if (error) showError(error.message === "Failed to fetch" ? "The browser cannot reach Supabase Auth right now." : error.message);
        else location.reload();
      } catch (err) {
        showError("The browser cannot reach Supabase Auth right now.");
      } finally {
        button.disabled = false;
        button.textContent = "Sign in →";
      }
    });
  }

  if (window.supabase?.createClient) {
    const original = window.supabase.createClient.bind(window.supabase);
    window.supabase.createClient = (url, key, options) => {
      const normalized = String(url || "").replace(/\\/g, "").replace(/\\s/g, "");
      return original(normalized.includes("wkvkqdjtlazpcuxpbqbz.supabase.co") ? CORRECT_URL : url, key, options);
    };
  }

  wireStaticLogin();
  document.addEventListener("DOMContentLoaded", wireStaticLogin);
})();
