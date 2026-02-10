import time
from playwright.sync_api import sync_playwright

def verify_quantum_field():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        print("Navigating to localhost:3000...")
        # Go to home page
        try:
            page.goto("http://localhost:3000", timeout=60000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            return

        print("Skipping onboarding...")
        # Skip onboarding
        page.evaluate("localStorage.setItem('quantum_onboarded', 'true')")
        page.reload()

        print("Waiting for Quantum Field...")
        # Wait for content to load
        # Check for the Quantum Field text overlay
        try:
            page.wait_for_selector("text=CAMPO CUÁNTICO", timeout=30000)
            print("Quantum Field overlay found.")
        except Exception as e:
            print(f"Quantum Field overlay not found: {e}")
            page.screenshot(path="verification_failure.png")
            return

        # Wait a bit for the canvas to render
        time.sleep(5)

        # Take screenshot
        page.screenshot(path="verification_success.png")
        print("Screenshot taken: verification_success.png")

        browser.close()

if __name__ == "__main__":
    verify_quantum_field()
