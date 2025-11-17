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
            //alert("Please enter your email and password.");
            return;
        }

        // If identifier looks like email, log in with it
        let emailToUse = identifier;

        // If user typed a username instead of email, resolve it:
        if (!identifier.includes("@")) {
            const { data: userByUsername, error: lookupErr } = await supabase
                .from("users")
                .select("email")
                .eq("username", identifier)
                .single();

            if (lookupErr || !userByUsername) {
                //alert("Invalid username or password.");
                return;
            }

            emailToUse = userByUsername.email;
        }

        // REAL Supabase Auth login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: emailToUse,
            password: pass
        });

        if (error) {
            //alert("Login error: " + error.message);
            return;
        }

        // Save session using Supabase Auth token automatically
        //alert("Login successful!");
        window.location = "index.html";
    });

    registerNowBtn.addEventListener("click", () => {
        window.location = "register.html";
    });

    const forgotModal = document.getElementById("forgotModal");
    const resetEmailInput = document.getElementById("resetEmailInput");
    const sendResetBtn = document.getElementById("sendResetBtn");
    const cancelResetBtn = document.getElementById("cancelResetBtn");

    // Show modal
    forgotBtn.addEventListener("click", () => {
        forgotModal.style.display = "flex";
    });

    // Hide modal
    cancelResetBtn.addEventListener("click", () => {
        forgotModal.style.display = "none";
        resetEmailInput.value = "";
    });

    // Send reset email
    sendResetBtn.addEventListener("click", async () => {
        const email = resetEmailInput.value.trim();
        if (!email) return;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://over-lords.github.io/overlords/reset.html"
        });

        if (error) {
            forgotModal.querySelector(".modal-content").innerHTML =
                `<h3>Error</h3><p>${error.message}</p>`;
            return;
        }

        forgotModal.querySelector(".modal-content").innerHTML =
            `<h3>Email Sent!</h3><p>Check your inbox.</p>`;

        setTimeout(() => {
            forgotModal.style.display = "none";
            resetEmailInput.value = "";
        }, 2000);
    });
});
