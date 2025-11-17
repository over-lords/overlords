// login.js
import { supabase } from "../supabaseClient.js";
import bcrypt from "https://cdn.jsdelivr.net/npm/bcryptjs/+esm";

// Grab elements once DOM is ready
window.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const registerNowBtn = document.getElementById("registerNowBtn");
    const forgotBtn = document.getElementById("forgotBtn");

    if (!loginBtn || !registerNowBtn || !forgotBtn) {
        console.error("Login page elements not found.");
        return;
    }

    loginBtn.addEventListener("click", async () => {
        const identifier = document.getElementById("identifier").value.trim();
        const pass = document.getElementById("password").value;

        if (!identifier || !pass) {
            alert("Please enter both identifier and password.");
            return;
        }

        // get user by email OR username
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .or(`email.eq.${identifier},username.eq.${identifier}`)
            .single();

        if (error || !user) {
            alert("User not found.");
            return;
        }

        const ok = bcrypt.compareSync(pass, user.password);

        if (!ok) {
            alert("Incorrect password.");
            return;
        }

        // Save session token
        localStorage.setItem("session_user_id", user.id);

        window.location = "index.html";
    });

    registerNowBtn.addEventListener("click", () => {
        window.location = "register.html";
    });

    // NOTE: full secure reset flow needs Supabase Auth or a backend.
    // For now, stub it so the button doesn't break the page.
    forgotBtn.addEventListener("click", () => {
        alert("Forgot password is not implemented yet.\n\nLater we can hook this to a real reset flow.");
    });
});
