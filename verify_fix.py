from playwright.sync_api import sync_playwright
import time
import sys

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console errors
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        try:
            print("Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000")

            # Wait for content to load
            page.wait_for_selector("h1", timeout=10000)
            print("Page loaded.")

            # Take initial screenshot
            page.screenshot(path="verification.png")
            print("Screenshot taken.")

            # Trigger reload to test beforeunload (implicitly)
            print("Reloading page...")
            page.reload()

            page.wait_for_selector("h1", timeout=10000)
            print("Page reloaded.")

            if console_errors:
                print("Console errors found:")
                for err in console_errors:
                    print(f"- {err}")
                # We expect no ReferenceError
                if any("stateRef" in err for err in console_errors):
                    print("CRITICAL: ReferenceError found!")
                    sys.exit(1)
            else:
                print("No console errors found.")

        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    run()
