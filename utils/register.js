import bcrypt from "https://cdn.jsdelivr.net/npm/bcryptjs/+esm";
import { supabase } from "../supabaseClient.js";

async function getRandomProfilePicture() {
    const apiUrl =
        "https://api.github.com/repos/over-lords/overlords/contents/Public/Images/Profile%20Pictures?ref=fc271a8062837c99e1c991fb0aa263eb7ffc54d1";

    const response = await fetch(apiUrl);

    if (!response.ok) {
        console.error("GitHub API error:", response.status, await response.text());
        return "default.png"; // fallback
    }

    const files = await response.json();

    // Filter for images only
    const images = files.filter(f =>
        f.type === "file" &&
        f.name.match(/\.(png|jpg|jpeg|gif|webp)$/i)
    );

    if (images.length === 0) return "default.png";

    const random = images[Math.floor(Math.random() * images.length)];

    // Return JUST the filename, e.g. "avatar23.png"
    return random.name;
}

window.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("registerBtn");
    const goLoginBtn = document.getElementById("goLoginBtn");

    registerBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value.trim();
        const username = document.getElementById("username").value.trim();
        const pass = document.getElementById("password").value;
        const confirm = document.getElementById("confirmPassword").value;

        if (!email || !username || !pass || !confirm) {
            //alert("Please fill out all fields.");
            return;
        }

        if (pass !== confirm) {
            //alert("Passwords do not match.");
            return;
        }

        // ⭐ 1) Sign up in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password: pass
        });

        if (authError) {
            //alert("Auth error: " + authError.message);
            return;
        }

        // Get the auth user's UUID
        const userId = authData.user.id;

        // ⭐ NEW: Get random profile picture
        const randomPic = await getRandomProfilePicture();

        // ⭐ 2) Insert into your own table with REAL auth user ID
        const { error: dbError } = await supabase.from("users").insert({
            id: userId,          // this links your table to Supabase auth
            email,
            username,
            profile_picture: randomPic
        });

        if (dbError) {
            //alert("DB error: " + dbError.message);
            return;
        }

        //alert("Account created! Please login.");
        window.location = "login.html";
    });


    goLoginBtn.addEventListener("click", () => {
        window.location = "login.html";
    });
});
