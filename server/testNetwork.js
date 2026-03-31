async function test() {
    try {
        console.log("Testing general connectivity to google.com...");
        const response = await fetch("https://www.google.com", { timeout: 5000 });
        console.log("Response Status:", response.status);
        if (response.ok) {
            console.log("✅ Successfully reached google.com");
        }
    } catch (error) {
        console.error("❌ Failed to reach google.com:", error);
    }
}
test();
