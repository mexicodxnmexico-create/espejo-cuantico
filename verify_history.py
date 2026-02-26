import time
from playwright.sync_api import sync_playwright

def verify_history():
    with sync_playwright() as p:
        print("Starting verification...")
        # Launch browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Set localStorage to skip onboarding
        page.add_init_script("localStorage.setItem('quantum_onboarded', 'true');")

        # Navigate to page
        page.goto("http://localhost:3000")

        # Wait for loading to finish
        try:
            page.wait_for_selector("main", timeout=10000)
        except Exception as e:
            print("❌ Main content not loaded (timeout)")
            print(page.content())
            exit(1)

        # Check for history list
        log_container = page.locator("div[role='log']")
        if not log_container.is_visible():
            print("❌ Log container not found")
            exit(1)

        # Check for list items
        list_items = log_container.locator("li")
        # Wait for at least one item
        list_items.first.wait_for()

        count = list_items.count()
        if count == 0:
            print("❌ No history items found")
            exit(1)

        print(f"✅ Found {count} history items")

        # Verify latest item has correct color (black vs grey)
        # Note: CSS colors are computed. #000 is rgb(0, 0, 0)
        latest_item = list_items.last
        color = latest_item.evaluate("el => getComputedStyle(el).color")
        print(f"Latest item color: {color}")

        if color != "rgb(0, 0, 0)":
             print(f"❌ Latest item should be black, got {color}")
             exit(1)

        # Click Observe to add an item
        page.get_by_text("Observar").click()
        time.sleep(1) # Wait for update

        new_count = list_items.count()
        if new_count != count + 1:
             print(f"❌ Expected {count + 1} items after observe, got {new_count}")
             exit(1)

        print(f"✅ Item added successfully. Total: {new_count}")

        # Scroll to log container to ensure visibility
        log_container.scroll_into_view_if_needed()

        output_path = "/home/jules/verification/verification.png"
        page.screenshot(path=output_path, full_page=True)
        print(f"✅ Verification successful. Screenshot saved to {output_path}.")
        browser.close()

if __name__ == "__main__":
    verify_history()
