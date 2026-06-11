async function run() {
  try {
    const email = "apiuser" + Date.now() + "@makany.app";
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Test Api User",
        email: email,
        password: "password123",
        role: "seeker",
      })
    });
    console.log("STATUS:", res.status);
    const data = await res.json();
    console.log("DATA:", data);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

run();
